import { analyzeTelemetry } from "@genui-lab/domain";
import { telemetryAnalysisToMarkdown } from "@genui-lab/experiment-core";
import { CANONICAL_GENERATED_AT, TELEMETRY_DEMO_001 } from "@genui-lab/fixtures";
import { describe, expect, it } from "vitest";

describe("web workspace wiring", () => {
  it("can analyze the shared fixture and produce markdown", () => {
    const analysis = analyzeTelemetry(TELEMETRY_DEMO_001, {
      generatedAt: CANONICAL_GENERATED_AT,
    });
    const markdown = telemetryAnalysisToMarkdown(analysis);
    expect(markdown).toContain("DEMO-001");
    expect(markdown).toContain("alert:temperature-anomaly-001");
  });
});
