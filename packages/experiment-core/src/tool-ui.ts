import type { TelemetryAnalysis } from "@genui-lab/domain";
import {
  type ToolUiRepresentation,
  ToolUiRepresentationSchema,
  type UiNode,
} from "@genui-lab/ui-contract";
import type { RepresentationAdapter } from "./types.js";

/**
 * Build a serializable tool-bound UI tree from the normalized domain result.
 * React rendering stays in apps/web; this package only produces the contract tree.
 */
export function telemetryAnalysisToToolUi(analysis: TelemetryAnalysis): ToolUiRepresentation {
  const metricNodes: UiNode[] = analysis.metrics.map((metric) => ({
    kind: "Metric",
    id: metric.id,
    label: metric.label,
    value: metric.value,
    unit: metric.unit,
    tone: metric.status,
  }));

  const alertNodes: UiNode[] = analysis.anomalies.map((anomaly) => ({
    kind: "Alert",
    id: anomaly.id,
    title: `${anomaly.severity.toUpperCase()}: ${anomaly.signal}`,
    body: `${anomaly.description} Interval ${anomaly.start} → ${anomaly.end}. Peak ${anomaly.peakValue} ${anomaly.unit}.`,
    tone: anomaly.severity,
  }));

  const primaryAnomaly = analysis.anomalies[0];

  const root: UiNode = {
    kind: "Stack",
    id: "stack:tool-ui-root",
    gap: "md",
    children: [
      {
        kind: "Heading",
        id: "heading:analysis-title",
        level: 2,
        text: analysis.title,
      },
      {
        kind: "Status",
        id: "status:analysis",
        label: analysis.status,
        tone: analysis.status,
      },
      {
        kind: "Text",
        id: "text:summary",
        text: analysis.summary,
      },
      {
        kind: "Grid",
        id: "grid:metrics",
        columns: 3,
        children: metricNodes,
      },
      ...alertNodes,
      {
        kind: "TimeSeriesChart",
        id: "chart:battery-temperature",
        title: "Battery vs ambient temperature",
        summary: primaryAnomaly
          ? `Battery temperature rises above the normal band during ${primaryAnomaly.start} to ${primaryAnomaly.end}, peaking at ${primaryAnomaly.peakValue} °C. Ambient temperature stays comparatively flat.`
          : "Battery and ambient temperatures remain within expected ranges.",
        series: analysis.series.map((series) => ({
          id: series.id,
          label: series.label,
          unit: series.unit,
          points: series.points,
        })),
        highlight: primaryAnomaly
          ? {
              start: primaryAnomaly.start,
              end: primaryAnomaly.end,
              label: `Anomaly ${primaryAnomaly.id}`,
            }
          : undefined,
      },
      {
        kind: "SourceList",
        id: "sources:analysis",
        items: analysis.sources.map((source) => ({
          id: source.id,
          label: source.label,
          detail: source.detail,
        })),
      },
    ],
  };

  return ToolUiRepresentationSchema.parse({
    kind: "tool-ui",
    root,
  });
}

export const toolUiAdapter: RepresentationAdapter<ToolUiRepresentation> = {
  id: "tool-ui",
  name: "Tool UI",
  description: "Fixed React components bound to the same normalized domain result.",
  createRepresentation: (input) => telemetryAnalysisToToolUi(input),
};
