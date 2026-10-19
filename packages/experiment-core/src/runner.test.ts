import { describe, expect, it } from "vitest";
import { runExperiment } from "./runner.js";

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

describe("runExperiment", () => {
  it("records the full lifecycle for markdown mode", async () => {
    const run = await runExperiment(
      {
        experimentId: "telemetry-001",
        task: "Analyze vehicle telemetry for VIN DEMO-001",
        renderMode: "markdown",
      },
      {
        fixture,
        generatedAt: "2026-03-15T12:00:00.000Z",
        createRunId: () => "run:test-001",
      },
    );

    expect(run.status).toBe("completed");
    expect(run.id).toBe("run:test-001");
    expect(run.domainResult?.id).toBe("analysis:telemetry-demo-001");
    expect(typeof run.representation?.payload).toBe("string");
    expect(run.events.map((event) => event.type)).toEqual([
      "RUN_STARTED",
      "DOMAIN_ANALYSIS_STARTED",
      "DOMAIN_ANALYSIS_FINISHED",
      "REPRESENTATION_STARTED",
      "REPRESENTATION_FINISHED",
      "RUN_COMPLETED",
    ]);
    expect(run.metrics.domainAnalysisMs).toBeTypeOf("number");
    expect(run.metrics.representationMs).toBeTypeOf("number");
    expect(run.metrics.ttftMs).toBeNull();
  });

  it("rejects planned modes without inventing behavior", async () => {
    const run = await runExperiment(
      {
        experimentId: "telemetry-001",
        task: "Analyze vehicle telemetry for VIN DEMO-001",
        renderMode: "a2ui",
      },
      { fixture, generatedAt: "2026-03-15T12:00:00.000Z" },
    );
    expect(run.status).toBe("error");
    expect(run.error).toMatch(/not available/i);
  });
});
