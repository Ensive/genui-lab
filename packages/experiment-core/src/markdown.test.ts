import { analyzeTelemetry } from "@genui-lab/domain";
import { describe, expect, it } from "vitest";
import { telemetryAnalysisToMarkdown } from "./markdown.js";

const fixture = {
  id: "telemetry-demo-001",
  vehicleId: "DEMO-001",
  description: "Synthetic automotive telemetry for DEMO-001",
  samples: [
    {
      timestamp: "2026-03-15T10:00:00.000Z",
      batteryTemperatureC: 32,
      ambientTemperatureC: 18,
      stateOfChargePct: 72,
      chargingState: "discharging" as const,
      vehicleSpeedKph: 48,
    },
    {
      timestamp: "2026-03-15T10:10:00.000Z",
      batteryTemperatureC: 56,
      ambientTemperatureC: 20,
      stateOfChargePct: 68,
      chargingState: "discharging" as const,
      vehicleSpeedKph: 55,
    },
    {
      timestamp: "2026-03-15T10:20:00.000Z",
      batteryTemperatureC: 54,
      ambientTemperatureC: 19,
      stateOfChargePct: 65,
      chargingState: "idle" as const,
      vehicleSpeedKph: 0,
    },
    {
      timestamp: "2026-03-15T10:25:00.000Z",
      batteryTemperatureC: 40,
      ambientTemperatureC: 18,
      stateOfChargePct: 65,
      chargingState: "idle" as const,
      vehicleSpeedKph: 0,
    },
  ],
};

describe("telemetryAnalysisToMarkdown", () => {
  it("is deterministic and includes stable IDs", () => {
    const analysis = analyzeTelemetry(fixture, { generatedAt: "2026-03-15T12:00:00.000Z" });
    const a = telemetryAnalysisToMarkdown(analysis);
    const b = telemetryAnalysisToMarkdown(analysis);
    expect(a).toBe(b);
    expect(a).toContain("metric:battery-temp-max");
    expect(a).toContain("alert:temperature-anomaly-001");
    expect(a).toContain("source:telemetry-demo-001");
    expect(a).toContain("**Status:** critical");
  });
});
