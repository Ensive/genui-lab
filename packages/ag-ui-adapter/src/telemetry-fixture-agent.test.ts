import { EventType } from "@ag-ui/core";
import { EventSchema } from "@ag-ui/core/schemas";
import { analyzeTelemetry } from "@genui-lab/domain";
import { CANONICAL_GENERATED_AT, TELEMETRY_DEMO_001 } from "@genui-lab/fixtures";
import { describe, expect, it } from "vitest";
import {
  INTERRUPT_ID_CLASSIFY,
  sharedStateFromAnalysis,
  TOOL_CALL_ID_CLASSIFY,
} from "./shared-state.js";
import { TelemetryFixtureAgent } from "./telemetry-fixture-agent.js";

async function collectTypes(
  agent: TelemetryFixtureAgent,
  resume?: Array<{
    interruptId: string;
    status: "resolved" | "cancelled";
    payload?: unknown;
  }>,
) {
  const types: string[] = [];
  const events: unknown[] = [];
  await agent.runAgent(
    { resume },
    {
      onEvent: ({ event }) => {
        types.push(event.type);
        events.push(event);
        EventSchema.parse(event);
      },
    },
  );
  return { types, events, agent };
}

describe("TelemetryFixtureAgent", () => {
  it("emits Run A ending in interrupt outcome with schema-valid events", async () => {
    const analysis = analyzeTelemetry(TELEMETRY_DEMO_001, {
      generatedAt: CANONICAL_GENERATED_AT,
    });
    const agent = new TelemetryFixtureAgent({
      fixture: TELEMETRY_DEMO_001,
      generatedAt: CANONICAL_GENERATED_AT,
      analysis,
      threadId: "thread:test-a",
    });

    const { types, events, agent: finished } = await collectTypes(agent);

    expect(types).toEqual([
      EventType.RUN_STARTED,
      EventType.TOOL_CALL_START,
      EventType.TOOL_CALL_ARGS,
      EventType.TOOL_CALL_END,
      EventType.STATE_SNAPSHOT,
      EventType.RUN_FINISHED,
    ]);

    const finishedEvent = events.find(
      (event) =>
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event.type === EventType.RUN_FINISHED,
    ) as { outcome?: { type?: string; interrupts?: { id: string }[] } };

    expect(finishedEvent.outcome?.type).toBe("interrupt");
    expect(finishedEvent.outcome?.interrupts?.[0]?.id).toBe(INTERRUPT_ID_CLASSIFY);
    expect(finished.pendingInterrupts[0]?.id).toBe(INTERRUPT_ID_CLASSIFY);
    expect(finished.state).toEqual(sharedStateFromAnalysis(analysis));
  });

  it("resumes with a new run and updates shared state", async () => {
    const analysis = analyzeTelemetry(TELEMETRY_DEMO_001, {
      generatedAt: CANONICAL_GENERATED_AT,
    });
    const agent = new TelemetryFixtureAgent({
      fixture: TELEMETRY_DEMO_001,
      generatedAt: CANONICAL_GENERATED_AT,
      analysis,
      threadId: "thread:test-b",
    });

    await collectTypes(agent);
    const { types, agent: finished } = await collectTypes(agent, [
      {
        interruptId: INTERRUPT_ID_CLASSIFY,
        status: "resolved",
        payload: { approved: true },
      },
    ]);

    expect(types[0]).toBe(EventType.RUN_STARTED);
    expect(types).toContain(EventType.TOOL_CALL_RESULT);
    expect(types).toContain(EventType.STATE_DELTA);
    expect(types.at(-1)).toBe(EventType.RUN_FINISHED);
    expect(finished.pendingInterrupts).toHaveLength(0);
    expect(finished.state).toMatchObject({
      analysisId: analysis.id,
      classificationApproved: true,
      status: analysis.status,
    });
    expect(TOOL_CALL_ID_CLASSIFY).toContain("classify");
  });
});
