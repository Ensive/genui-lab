import {
  type AnalyzeTelemetryOptions,
  type Anomaly,
  type Metric,
  type TelemetryAnalysis,
  TelemetryAnalysisSchema,
  type TelemetryFixture,
  type TelemetrySample,
  type TimeSeries,
} from "./types.js";

const DEFAULT_NORMAL_MIN = 28;
const DEFAULT_NORMAL_MAX = 42;
const DEFAULT_GENERATED_AT = "2026-03-15T12:00:00.000Z";

function sampleValues(samples: TelemetrySample[], key: keyof TelemetrySample): number[] {
  return samples.map((sample) => {
    const value = sample[key];
    if (typeof value !== "number") {
      throw new Error(`Expected numeric signal for ${String(key)}`);
    }
    return value;
  });
}

function maxOf(values: number[]): number {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot compute max of empty series");
  }
  return values.reduce((max, value) => (value > max ? value : max), first);
}

function minOf(values: number[]): number {
  const first = values[0];
  if (first === undefined) {
    throw new Error("Cannot compute min of empty series");
  }
  return values.reduce((min, value) => (value < min ? value : min), first);
}

function meanOf(values: number[]): number {
  if (values.length === 0) {
    throw new Error("Cannot compute mean of empty series");
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/**
 * Detect contiguous intervals where battery temperature is outside the normal band.
 * Severity is critical when peak exceeds normalMax + 10°C, otherwise warning.
 */
export function detectBatteryTemperatureAnomalies(
  samples: TelemetrySample[],
  normalMinC = DEFAULT_NORMAL_MIN,
  normalMaxC = DEFAULT_NORMAL_MAX,
): Anomaly[] {
  const anomalies: Anomaly[] = [];
  let activeStart: TelemetrySample | undefined;
  let activePeak = Number.NEGATIVE_INFINITY;
  let anomalyIndex = 0;

  const flush = (endSample: TelemetrySample) => {
    if (!activeStart) {
      return;
    }
    anomalyIndex += 1;
    const severity = activePeak > normalMaxC + 10 ? "critical" : "warning";
    const id = `alert:temperature-anomaly-${String(anomalyIndex).padStart(3, "0")}`;
    anomalies.push({
      id,
      signal: "batteryTemperatureC",
      severity,
      start: activeStart.timestamp,
      end: endSample.timestamp,
      peakValue: round(activePeak),
      unit: "°C",
      description: `Battery temperature left the normal band (${normalMinC}–${normalMaxC} °C), peaking at ${round(activePeak)} °C.`,
    });
    activeStart = undefined;
    activePeak = Number.NEGATIVE_INFINITY;
  };

  for (let index = 0; index < samples.length; index += 1) {
    const sample = samples[index];
    if (!sample) {
      continue;
    }
    const outside =
      sample.batteryTemperatureC < normalMinC || sample.batteryTemperatureC > normalMaxC;
    if (outside) {
      if (!activeStart) {
        activeStart = sample;
      }
      activePeak = Math.max(activePeak, sample.batteryTemperatureC);
    } else if (activeStart) {
      const previous = samples[index - 1];
      if (previous) {
        flush(previous);
      }
    }
  }

  if (activeStart) {
    const last = samples[samples.length - 1];
    if (last) {
      flush(last);
    }
  }

  return anomalies;
}

function buildMetrics(samples: TelemetrySample[], anomalies: Anomaly[]): Metric[] {
  const batteryTemps = sampleValues(samples, "batteryTemperatureC");
  const ambientTemps = sampleValues(samples, "ambientTemperatureC");
  const soc = sampleValues(samples, "stateOfChargePct");
  const peakBattery = maxOf(batteryTemps);
  const critical = anomalies.some((anomaly) => anomaly.severity === "critical");
  const warning = anomalies.length > 0;

  return [
    {
      id: "metric:battery-temp-max",
      label: "Peak battery temperature",
      value: round(peakBattery),
      unit: "°C",
      status: critical ? "critical" : warning ? "warning" : "normal",
    },
    {
      id: "metric:battery-temp-min",
      label: "Minimum battery temperature",
      value: round(minOf(batteryTemps)),
      unit: "°C",
      status: "normal",
    },
    {
      id: "metric:battery-temp-mean",
      label: "Mean battery temperature",
      value: round(meanOf(batteryTemps)),
      unit: "°C",
      status: warning ? "warning" : "normal",
    },
    {
      id: "metric:ambient-temp-mean",
      label: "Mean ambient temperature",
      value: round(meanOf(ambientTemps)),
      unit: "°C",
      status: "normal",
    },
    {
      id: "metric:soc-end",
      label: "Ending state of charge",
      value: round(soc[soc.length - 1] ?? 0),
      unit: "%",
      status: "normal",
    },
  ];
}

function buildSeries(samples: TelemetrySample[]): TimeSeries[] {
  return [
    {
      id: "chart:battery-temperature",
      label: "Battery temperature",
      unit: "°C",
      points: samples.map((sample) => ({
        timestamp: sample.timestamp,
        value: sample.batteryTemperatureC,
      })),
    },
    {
      id: "chart:ambient-temperature",
      label: "Ambient temperature",
      unit: "°C",
      points: samples.map((sample) => ({
        timestamp: sample.timestamp,
        value: sample.ambientTemperatureC,
      })),
    },
  ];
}

function buildSummary(
  vehicleId: string,
  anomalies: Anomaly[],
  peakBattery: number,
  normalMinC: number,
  normalMaxC: number,
): string {
  if (anomalies.length === 0) {
    return `Telemetry for ${vehicleId} stayed within the normal battery temperature band (${normalMinC}–${normalMaxC} °C). Peak observed temperature was ${peakBattery} °C.`;
  }

  const primary = anomalies[0];
  if (!primary) {
    throw new Error("Expected at least one anomaly");
  }

  return `Telemetry for ${vehicleId} shows ${anomalies.length} battery-temperature deviation${anomalies.length === 1 ? "" : "s"} from the normal band (${normalMinC}–${normalMaxC} °C). The primary interval runs from ${primary.start} to ${primary.end}, peaking at ${primary.peakValue} °C.`;
}

/**
 * Transform a deterministic telemetry fixture into a renderer-independent analysis result.
 */
export function analyzeTelemetry(
  fixture: TelemetryFixture,
  options: AnalyzeTelemetryOptions = {},
): TelemetryAnalysis {
  const normalMinC = options.normalBatteryMinC ?? DEFAULT_NORMAL_MIN;
  const normalMaxC = options.normalBatteryMaxC ?? DEFAULT_NORMAL_MAX;
  const generatedAt = options.generatedAt ?? DEFAULT_GENERATED_AT;

  const anomalies = detectBatteryTemperatureAnomalies(fixture.samples, normalMinC, normalMaxC);
  const metrics = buildMetrics(fixture.samples, anomalies);
  const peakMetric = metrics.find((metric) => metric.id === "metric:battery-temp-max");
  const peakBattery = peakMetric?.value ?? 0;
  const status = anomalies.some((anomaly) => anomaly.severity === "critical")
    ? "critical"
    : anomalies.length > 0
      ? "warning"
      : "normal";

  const analysis: TelemetryAnalysis = {
    id: `analysis:${fixture.id}`,
    vehicleId: fixture.vehicleId,
    title: `Battery temperature analysis — ${fixture.vehicleId}`,
    summary: buildSummary(fixture.vehicleId, anomalies, peakBattery, normalMinC, normalMaxC),
    metrics,
    anomalies,
    series: buildSeries(fixture.samples),
    status,
    sources: [
      {
        id: `source:${fixture.id}`,
        label: fixture.description,
        kind: "fixture",
        detail: `${fixture.samples.length} synthetic samples for ${fixture.vehicleId}`,
      },
    ],
    generatedAt,
  };

  return TelemetryAnalysisSchema.parse(analysis);
}
