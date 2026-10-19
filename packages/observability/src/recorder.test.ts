import { describe, expect, it } from "vitest";
import { ExperimentRecorder, type NowProvider } from "./recorder.js";

function fakeClock(steps: number[]): NowProvider {
  let index = 0;
  let wall = 0;
  return {
    now: () => {
      const value = steps[Math.min(index, steps.length - 1)] ?? 0;
      index += 1;
      return value;
    },
    isoNow: () => {
      wall += 1;
      return `2026-03-15T12:00:0${wall}.000Z`;
    },
  };
}

describe("ExperimentRecorder", () => {
  it("records chronological offsets and derives honest metrics", () => {
    const recorder = new ExperimentRecorder(fakeClock([0, 0, 1.1, 2.7, 3.0, 3.6, 4.0]));
    recorder.record("RUN_STARTED");
    recorder.record("DOMAIN_ANALYSIS_STARTED");
    recorder.record("DOMAIN_ANALYSIS_FINISHED");
    recorder.record("REPRESENTATION_STARTED");
    recorder.record("REPRESENTATION_FINISHED");
    recorder.record("RUN_COMPLETED");

    const events = recorder.getEvents();
    expect(events.map((event) => event.type)).toEqual([
      "RUN_STARTED",
      "DOMAIN_ANALYSIS_STARTED",
      "DOMAIN_ANALYSIS_FINISHED",
      "REPRESENTATION_STARTED",
      "REPRESENTATION_FINISHED",
      "RUN_COMPLETED",
    ]);
    expect(events[0]?.id).toBe("event:0001");

    const metrics = recorder.deriveMetrics();
    expect(metrics.domainAnalysisMs).toBe(1.6);
    expect(metrics.representationMs).toBe(0.6);
    expect(metrics.totalRunMs).toBe(4);
    expect(metrics.ttftMs).toBeNull();
  });
});
