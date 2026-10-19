import type { TelemetryAnalysis } from "@genui-lab/domain";
import type { RepresentationAdapter } from "./types.js";

/**
 * Deterministic Markdown representation — no LLM involved.
 */
export function telemetryAnalysisToMarkdown(analysis: TelemetryAnalysis): string {
  const lines: string[] = [
    `# ${analysis.title}`,
    "",
    `**Status:** ${analysis.status}`,
    "",
    analysis.summary,
    "",
    "## Metrics",
    "",
  ];

  for (const metric of analysis.metrics) {
    const tone = metric.status ? ` (${metric.status})` : "";
    lines.push(`- **${metric.label}** (\`${metric.id}\`): ${metric.value} ${metric.unit}${tone}`);
  }

  lines.push("", "## Anomalies", "");

  if (analysis.anomalies.length === 0) {
    lines.push("No anomalies detected.");
  } else {
    for (const anomaly of analysis.anomalies) {
      lines.push(
        `### ${anomaly.id}`,
        "",
        `- Signal: \`${anomaly.signal}\``,
        `- Severity: **${anomaly.severity}**`,
        `- Interval: ${anomaly.start} → ${anomaly.end}`,
        `- Peak: ${anomaly.peakValue} ${anomaly.unit}`,
        `- ${anomaly.description}`,
        "",
      );
    }
  }

  lines.push("## Sources", "");
  for (const source of analysis.sources) {
    lines.push(`- **${source.label}** (\`${source.id}\`): ${source.detail}`);
  }

  lines.push("", `_Generated at ${analysis.generatedAt}_`, "");
  return lines.join("\n");
}

export const markdownAdapter: RepresentationAdapter<string> = {
  id: "markdown",
  name: "Markdown",
  description: "Deterministic prose representation of the normalized domain result.",
  createRepresentation: (input) => telemetryAnalysisToMarkdown(input),
};
