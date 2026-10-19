import { analyzeTelemetry, type TelemetryAnalysis, type TelemetryFixture } from "@genui-lab/domain";
import { ExperimentRecorder } from "@genui-lab/observability";
import { markdownAdapter } from "./markdown.js";
import { toolUiAdapter } from "./tool-ui.js";
import type {
  ExperimentRequest,
  ExperimentRun,
  RepresentationAdapter,
  RepresentationEnvelope,
} from "./types.js";
import { ExperimentRequestSchema } from "./types.js";

const adapters: Record<string, RepresentationAdapter> = {
  [markdownAdapter.id]: markdownAdapter,
  [toolUiAdapter.id]: toolUiAdapter,
};

export interface RunExperimentOptions {
  fixture: TelemetryFixture;
  /** Fixed analysis timestamp for deterministic fixtures. */
  generatedAt?: string;
  createRunId?: () => string;
}

let runCounter = 0;

function defaultRunId(): string {
  runCounter += 1;
  return `run:${String(runCounter).padStart(4, "0")}`;
}

function toInspectable(mode: string, payload: unknown): unknown {
  if (mode === "markdown" && typeof payload === "string") {
    return { markdown: payload };
  }
  return payload;
}

/**
 * Execute the canonical vertical slice:
 * fixture → domain analysis → representation adapter.
 * Rendering remains the responsibility of the host UI.
 */
export async function runExperiment(
  rawRequest: ExperimentRequest,
  options: RunExperimentOptions,
): Promise<ExperimentRun> {
  const request = ExperimentRequestSchema.parse(rawRequest);
  const recorder = new ExperimentRecorder();
  const startedAt = new Date().toISOString();
  const runId = options.createRunId?.() ?? defaultRunId();

  recorder.record("RUN_STARTED", {
    data: { runId, renderMode: request.renderMode, experimentId: request.experimentId },
  });

  try {
    const adapter = adapters[request.renderMode];
    if (!adapter) {
      throw new Error(
        `Render mode "${request.renderMode}" is not available yet. Choose markdown or tool-ui.`,
      );
    }

    recorder.record("DOMAIN_ANALYSIS_STARTED");
    const domainResult: TelemetryAnalysis = analyzeTelemetry(options.fixture, {
      generatedAt: options.generatedAt,
    });
    recorder.record("DOMAIN_ANALYSIS_FINISHED", {
      data: { analysisId: domainResult.id, status: domainResult.status },
    });

    recorder.record("REPRESENTATION_STARTED", { data: { mode: adapter.id } });
    const payload = await adapter.createRepresentation(domainResult);
    const representation: RepresentationEnvelope = {
      mode: adapter.id,
      payload,
      inspectable: toInspectable(adapter.id, payload),
    };
    recorder.record("REPRESENTATION_FINISHED", {
      data: {
        mode: adapter.id,
        payloadType: typeof payload,
      },
    });

    recorder.record("RUN_COMPLETED");
    const finishedAt = new Date().toISOString();

    return {
      id: runId,
      request,
      status: "completed",
      startedAt,
      finishedAt,
      durationMs: recorder.elapsedMs(),
      domainResult,
      representation,
      events: [...recorder.getEvents()],
      metrics: recorder.deriveMetrics(),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    recorder.record("ERROR", { message });
    return {
      id: runId,
      request,
      status: "error",
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: recorder.elapsedMs(),
      events: [...recorder.getEvents()],
      metrics: recorder.deriveMetrics(),
      error: message,
    };
  }
}

export function getAvailableAdapters(): RepresentationAdapter[] {
  return Object.values(adapters);
}
