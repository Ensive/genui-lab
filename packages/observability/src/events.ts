import { z } from "zod";

/**
 * Lifecycle events for an experiment run.
 * Designed so OpenTelemetry spans/events can be mapped later without changing callers.
 */
export const ExperimentEventTypeSchema = z.enum([
  "RUN_STARTED",
  "DOMAIN_ANALYSIS_STARTED",
  "DOMAIN_ANALYSIS_FINISHED",
  "REPRESENTATION_STARTED",
  "REPRESENTATION_FINISHED",
  "RENDER_STARTED",
  "RENDER_FINISHED",
  "INTERACTION",
  "RUN_COMPLETED",
  "ERROR",
]);

export type ExperimentEventType = z.infer<typeof ExperimentEventTypeSchema>;

export const ExperimentEventSchema = z.object({
  id: z.string().min(1),
  type: ExperimentEventTypeSchema,
  /** Milliseconds since run start (performance.now()-based). */
  offsetMs: z.number().nonnegative(),
  /** Absolute wall-clock time when the event was recorded. */
  at: z.string().datetime(),
  message: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export type ExperimentEvent = z.infer<typeof ExperimentEventSchema>;

export const ExperimentMetricsSchema = z.object({
  domainAnalysisMs: z.number().nonnegative().optional(),
  representationMs: z.number().nonnegative().optional(),
  /** Honest total wall time for analysis + representation. Render timing is UI-owned. */
  totalRunMs: z.number().nonnegative().optional(),
  /**
   * Placeholders for future instrumentation — never invent values.
   * TTFT: time to first token (LLM)
   * TTFC: time to first component (streaming UI)
   * TTI: time to interactive
   * TTC: time to complete / task success
   */
  ttftMs: z.null().optional(),
  ttfcMs: z.null().optional(),
  ttiMs: z.null().optional(),
  ttcMs: z.null().optional(),
  inputTokens: z.null().optional(),
  outputTokens: z.null().optional(),
  costUsd: z.null().optional(),
});

export type ExperimentMetrics = z.infer<typeof ExperimentMetricsSchema>;
