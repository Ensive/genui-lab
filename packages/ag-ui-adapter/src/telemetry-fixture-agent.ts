import { AbstractAgent, type AgentConfig } from "@ag-ui/client";
import { type AgentCapabilities, type BaseEvent, EventType, type ResumeEntry } from "@ag-ui/core";
import { analyzeTelemetry, type TelemetryAnalysis, type TelemetryFixture } from "@genui-lab/domain";
import { of } from "rxjs";
import {
  CLASSIFY_ANOMALY_TOOL,
  INTERRUPT_ID_CLASSIFY,
  sharedStateFromAnalysis,
  type TelemetrySharedState,
  TelemetrySharedStateSchema,
  TOOL_CALL_ID_CLASSIFY,
} from "./shared-state.js";

export interface TelemetryFixtureAgentConfig extends AgentConfig {
  fixture: TelemetryFixture;
  generatedAt?: string;
  /** Injected analysis for tests; defaults to analyzeTelemetry(fixture). */
  analysis?: TelemetryAnalysis;
}

type RunInput = Parameters<AbstractAgent["run"]>[0];

/**
 * Deterministic in-process AG-UI agent for Telemetry 001.
 * Simulated fixture — not a live LLM. See ADR-0003.
 *
 * Run A (no resume): tool call + STATE_SNAPSHOT + RUN_FINISHED(interrupt).
 * Run B (with resume): TOOL_CALL_RESULT + STATE_DELTA + RUN_FINISHED(success).
 */
export class TelemetryFixtureAgent extends AbstractAgent {
  private readonly analysis: TelemetryAnalysis;

  constructor(config: TelemetryFixtureAgentConfig) {
    const analysis =
      config.analysis ?? analyzeTelemetry(config.fixture, { generatedAt: config.generatedAt });
    super({
      agentId: config.agentId ?? "agent:telemetry-fixture",
      description:
        config.description ??
        "Simulated AG-UI agent (fixture) for GenUI Lab Telemetry 001. Offline; no API key.",
      threadId: config.threadId ?? "thread:telemetry-001",
      initialMessages: config.initialMessages,
      initialState: config.initialState ?? {},
      debug: config.debug,
    });
    this.analysis = analysis;
  }

  getAnalysis(): TelemetryAnalysis {
    return this.analysis;
  }

  readSharedState(): TelemetrySharedState | null {
    const parsed = TelemetrySharedStateSchema.safeParse(this.state);
    return parsed.success ? parsed.data : null;
  }

  override async getCapabilities(): Promise<AgentCapabilities> {
    return {
      humanInTheLoop: {
        interrupts: true,
      },
    };
  }

  run(input: RunInput): ReturnType<AbstractAgent["run"]> {
    const resume = input.resume ?? [];
    if (resume.length > 0) {
      return of(...this.buildResumeRunEvents(input, resume));
    }
    return of(...this.buildInterruptRunEvents(input));
  }

  private buildInterruptRunEvents(input: RunInput): BaseEvent[] {
    const snapshot = sharedStateFromAnalysis(this.analysis);
    const toolArgs = JSON.stringify({
      vehicleId: this.analysis.vehicleId,
      analysisId: this.analysis.id,
    });
    const primaryAnomaly = this.analysis.anomalies[0];

    return [
      {
        type: EventType.RUN_STARTED,
        threadId: input.threadId,
        runId: input.runId,
        protocolVersion: "1.0",
        input,
        timestamp: 1,
      },
      {
        type: EventType.TOOL_CALL_START,
        toolCallId: TOOL_CALL_ID_CLASSIFY,
        toolCallName: CLASSIFY_ANOMALY_TOOL,
        timestamp: 2,
      },
      {
        type: EventType.TOOL_CALL_ARGS,
        toolCallId: TOOL_CALL_ID_CLASSIFY,
        delta: toolArgs,
        timestamp: 3,
      },
      {
        type: EventType.TOOL_CALL_END,
        toolCallId: TOOL_CALL_ID_CLASSIFY,
        timestamp: 4,
      },
      {
        type: EventType.STATE_SNAPSHOT,
        snapshot,
        timestamp: 5,
      },
      {
        type: EventType.RUN_FINISHED,
        threadId: input.threadId,
        runId: input.runId,
        timestamp: 6,
        outcome: {
          type: "interrupt",
          interrupts: [
            {
              id: INTERRUPT_ID_CLASSIFY,
              reason: "classification_approval",
              message: primaryAnomaly
                ? `Approve classifying ${primaryAnomaly.id} as ${primaryAnomaly.severity} for ${this.analysis.vehicleId}?`
                : `Approve anomaly classification for ${this.analysis.vehicleId}?`,
              toolCallId: TOOL_CALL_ID_CLASSIFY,
              responseSchema: {
                type: "object",
                properties: {
                  approved: { type: "boolean" },
                },
                required: ["approved"],
              },
            },
          ],
        },
      },
    ];
  }

  private buildResumeRunEvents(input: RunInput, resume: ResumeEntry[]): BaseEvent[] {
    const entry = resume.find((item) => item.interruptId === INTERRUPT_ID_CLASSIFY);
    if (!entry) {
      return [
        {
          type: EventType.RUN_STARTED,
          threadId: input.threadId,
          runId: input.runId,
          protocolVersion: "1.0",
          input,
          timestamp: 1,
        },
        {
          type: EventType.RUN_ERROR,
          message: `Missing resume entry for ${INTERRUPT_ID_CLASSIFY}`,
          timestamp: 2,
        },
      ];
    }

    const approved =
      entry.status === "resolved" &&
      typeof entry.payload === "object" &&
      entry.payload !== null &&
      "approved" in entry.payload &&
      Boolean((entry.payload as { approved: unknown }).approved);

    const base = sharedStateFromAnalysis(this.analysis);
    const nextState: TelemetrySharedState = {
      ...base,
      classificationApproved: approved,
      status: approved ? base.status : "warning",
    };

    const resultContent = JSON.stringify({
      tool: CLASSIFY_ANOMALY_TOOL,
      approved,
      interruptId: INTERRUPT_ID_CLASSIFY,
      resumeStatus: entry.status,
    });

    return [
      {
        type: EventType.RUN_STARTED,
        threadId: input.threadId,
        runId: input.runId,
        protocolVersion: "1.0",
        parentRunId: input.parentRunId,
        input,
        timestamp: 1,
      },
      {
        type: EventType.TOOL_CALL_RESULT,
        messageId: "msg:tool-result-classify-001",
        toolCallId: TOOL_CALL_ID_CLASSIFY,
        content: resultContent,
        role: "tool",
        timestamp: 2,
      },
      {
        type: EventType.STATE_DELTA,
        delta: [
          { op: "add", path: "/classificationApproved", value: approved },
          { op: "replace", path: "/status", value: nextState.status },
        ],
        timestamp: 3,
      },
      {
        type: EventType.STATE_SNAPSHOT,
        snapshot: nextState,
        timestamp: 4,
      },
      {
        type: EventType.RUN_FINISHED,
        threadId: input.threadId,
        runId: input.runId,
        timestamp: 5,
        outcome: { type: "success" },
      },
    ];
  }
}
