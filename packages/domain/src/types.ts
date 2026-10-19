import { z } from "zod";

export const MetricSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  status: z.enum(["normal", "warning", "critical"]).optional(),
});

export type Metric = z.infer<typeof MetricSchema>;

export const AnomalySchema = z.object({
  id: z.string().min(1),
  signal: z.string().min(1),
  severity: z.enum(["warning", "critical"]),
  start: z.string().datetime(),
  end: z.string().datetime(),
  peakValue: z.number(),
  unit: z.string().min(1),
  description: z.string().min(1),
});

export type Anomaly = z.infer<typeof AnomalySchema>;

export const TimeSeriesPointSchema = z.object({
  timestamp: z.string().datetime(),
  value: z.number(),
});

export type TimeSeriesPoint = z.infer<typeof TimeSeriesPointSchema>;

export const TimeSeriesSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  unit: z.string().min(1),
  points: z.array(TimeSeriesPointSchema).min(1),
});

export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

export const SourceReferenceSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["fixture", "stream", "document"]),
  detail: z.string().min(1),
});

export type SourceReference = z.infer<typeof SourceReferenceSchema>;

export const TelemetryAnalysisSchema = z.object({
  id: z.string().min(1),
  vehicleId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  metrics: z.array(MetricSchema),
  anomalies: z.array(AnomalySchema),
  series: z.array(TimeSeriesSchema),
  status: z.enum(["normal", "warning", "critical"]),
  sources: z.array(SourceReferenceSchema),
  generatedAt: z.string().datetime(),
});

export type TelemetryAnalysis = z.infer<typeof TelemetryAnalysisSchema>;

export const TelemetrySampleSchema = z.object({
  timestamp: z.string().datetime(),
  batteryTemperatureC: z.number(),
  ambientTemperatureC: z.number(),
  stateOfChargePct: z.number(),
  chargingState: z.enum(["idle", "charging", "discharging"]),
  vehicleSpeedKph: z.number(),
});

export type TelemetrySample = z.infer<typeof TelemetrySampleSchema>;

export const TelemetryFixtureSchema = z.object({
  id: z.string().min(1),
  vehicleId: z.string().min(1),
  description: z.string().min(1),
  samples: z.array(TelemetrySampleSchema).min(1),
});

export type TelemetryFixture = z.infer<typeof TelemetryFixtureSchema>;

export interface AnalyzeTelemetryOptions {
  /** ISO timestamp recorded when analysis completes. Defaults to a fixed fixture time. */
  generatedAt?: string;
  normalBatteryMinC?: number;
  normalBatteryMaxC?: number;
}
