import { analyzeTelemetry } from "@genui-lab/domain";
import { describe, expect, it } from "vitest";
import {
  CANONICAL_GENERATED_AT,
  CANONICAL_TASK,
  TELEMETRY_DEMO_001,
} from "./telemetry-demo-001.js";

describe("TELEMETRY_DEMO_001", () => {
  it("is byte-stable across imports", () => {
    expect(TELEMETRY_DEMO_001.vehicleId).toBe("DEMO-001");
    expect(TELEMETRY_DEMO_001.samples).toHaveLength(26);
    expect(TELEMETRY_DEMO_001.samples[0]?.timestamp).toBe("2026-03-15T10:00:00.000Z");
    expect(TELEMETRY_DEMO_001.samples[15]?.batteryTemperatureC).toBe(59.1);
  });

  it("produces a critical anomaly for the elevated interval", () => {
    const analysis = analyzeTelemetry(TELEMETRY_DEMO_001, {
      generatedAt: CANONICAL_GENERATED_AT,
    });
    expect(analysis.status).toBe("critical");
    expect(analysis.anomalies).toHaveLength(1);
    expect(analysis.anomalies[0]?.id).toBe("alert:temperature-anomaly-001");
    expect(analysis.anomalies[0]?.peakValue).toBe(59.1);
    expect(CANONICAL_TASK).toContain("DEMO-001");
  });
});
