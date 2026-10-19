import type { TelemetryAnalysis } from "@genui-lab/domain";
import type { ExperimentEvent, ExperimentMetrics } from "@genui-lab/observability";
import { z } from "zod";
import { type RenderMode, RenderModeSchema } from "./modes.js";

export const ExperimentRequestSchema = z.object({
  experimentId: z.string().min(1),
  task: z.string().min(1),
  renderMode: RenderModeSchema,
  vehicleId: z.string().min(1).optional(),
});

export type ExperimentRequest = z.infer<typeof ExperimentRequestSchema>;

export type ExperimentRunStatus = "idle" | "running" | "completed" | "error";

export interface RepresentationAdapter<TRepresentation = unknown> {
  id: RenderMode;
  name: string;
  description: string;
  createRepresentation(input: TelemetryAnalysis): Promise<TRepresentation> | TRepresentation;
}

export interface RepresentationEnvelope<TRepresentation = unknown> {
  mode: RenderMode;
  /** Architecture-specific payload. Inspectors should display this raw. */
  payload: TRepresentation;
  /** Compact JSON-serializable view for the inspector. */
  inspectable: unknown;
}

export interface ExperimentRun<TRepresentation = unknown> {
  id: string;
  request: ExperimentRequest;
  status: ExperimentRunStatus;
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  domainResult?: TelemetryAnalysis;
  representation?: RepresentationEnvelope<TRepresentation>;
  events: ExperimentEvent[];
  metrics: ExperimentMetrics;
  error?: string;
}
