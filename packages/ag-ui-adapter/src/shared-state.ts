import type { TelemetryAnalysis } from "@genui-lab/domain";
import { z } from "zod";

export const TelemetrySharedStateSchema = z.object({
  analysisId: z.string().min(1),
  vehicleId: z.string().min(1),
  status: z.enum(["normal", "warning", "critical"]),
  anomalyIds: z.array(z.string()),
  /** Present after HITL resume when the human answered the classification interrupt. */
  classificationApproved: z.boolean().optional(),
});

export type TelemetrySharedState = z.infer<typeof TelemetrySharedStateSchema>;

export function sharedStateFromAnalysis(analysis: TelemetryAnalysis): TelemetrySharedState {
  return TelemetrySharedStateSchema.parse({
    analysisId: analysis.id,
    vehicleId: analysis.vehicleId,
    status: analysis.status,
    anomalyIds: analysis.anomalies.map((anomaly) => anomaly.id),
  });
}

export const CLASSIFY_ANOMALY_TOOL = "classify_anomaly";
export const INTERRUPT_ID_CLASSIFY = "interrupt:classify-anomaly-001";
export const TOOL_CALL_ID_CLASSIFY = "toolcall:classify-anomaly-001";
