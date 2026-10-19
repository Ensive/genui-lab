import { describe, expect, it } from "vitest";
import { analyzeTelemetry, detectBatteryTemperatureAnomalies } from "./analyze.js";
import type { TelemetryFixture } from "./types.js";
import { TelemetryAnalysisSchema } from "./types.js";

const FIXTURE: TelemetryFixture = {
  id: "telemetry-demo-001",
  vehicleId: "DEMO-001",
  description: "Synthetic automotive telemetry for DEMO-001",
  samples: [
    {
      timestamp: "2026-03-15T10:00:00.000Z",
      batteryTemperatureC: 32,
      ambientTemperatureC: 18,
      stateOfChargePct: 72,
      chargingState: "discharging",
      vehicleSpeedKph: 48,
    },
    {
      timestamp: "2026-03-15T10:05:00.000Z",
      batteryTemperatureC: 36,
      ambientTemperatureC: 19,
      stateOfChargePct: 70,
      chargingState: "discharging",
      vehicleSpeedKph: 52,
    },
    {
      timestamp: "2026-03-15T10:10:00.000Z",
      batteryTemperatureC: 56,
      ambientTemperatureC: 20,
      stateOfChargePct: 68,
      chargingState: "discharging",
      vehicleSpeedKph: 55,
    },
    {
      timestamp: "2026-03-15T10:15:00.000Z",
      batteryTemperatureC: 58,
      ambientTemperatureC: 20,
      stateOfChargePct: 66,
      chargingState: "discharging",
      vehicleSpeedKph: 40,
    },
    {
      timestamp: "2026-03-15T10:20:00.000Z",
      batteryTemperatureC: 54,
      ambientTemperatureC: 19,
      stateOfChargePct: 65,
      chargingState: "idle",
      vehicleSpeedKph: 0,
    },
    {
      timestamp: "2026-03-15T10:25:00.000Z",
      batteryTemperatureC: 40,
      ambientTemperatureC: 18,
      stateOfChargePct: 65,
      chargingState: "idle",
      vehicleSpeedKph: 0,
    },
  ],
};

describe("detectBatteryTemperatureAnomalies", () => {
  it("detects the elevated interval with stable semantic IDs", () => {
    const anomalies = detectBatteryTemperatureAnomalies(FIXTURE.samples);
    expect(anomalies).toHaveLength(1);
    const anomaly = anomalies[0];
    expect(anomaly?.id).toBe("alert:temperature-anomaly-001");
    expect(anomaly?.peakValue).toBe(58);
    expect(anomaly?.severity).toBe("critical");
    expect(anomaly?.start).toBe("2026-03-15T10:10:00.000Z");
    expect(anomaly?.end).toBe("2026-03-15T10:20:00.000Z");
  });
});

describe("analyzeTelemetry", () => {
  it("produces a schema-valid normalized result with stable IDs", () => {
    const analysis = analyzeTelemetry(FIXTURE, { generatedAt: "2026-03-15T12:00:00.000Z" });
    expect(() => TelemetryAnalysisSchema.parse(analysis)).not.toThrow();
    expect(analysis.id).toBe("analysis:telemetry-demo-001");
    expect(analysis.status).toBe("critical");
    expect(analysis.metrics.map((metric) => metric.id)).toContain("metric:battery-temp-max");
    expect(analysis.series.map((series) => series.id)).toEqual([
      "chart:battery-temperature",
      "chart:ambient-temperature",
    ]);
    expect(analysis.sources[0]?.id).toBe("source:telemetry-demo-001");
  });

  it("is deterministic for the same fixture", () => {
    const a = analyzeTelemetry(FIXTURE, { generatedAt: "2026-03-15T12:00:00.000Z" });
    const b = analyzeTelemetry(FIXTURE, { generatedAt: "2026-03-15T12:00:00.000Z" });
    expect(a).toEqual(b);
  });
});
