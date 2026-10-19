import type { ExperimentRun } from "@genui-lab/experiment-core";
import type { ToolUiRepresentation } from "@genui-lab/ui-contract";
import { useEffect, useRef } from "react";
import { MarkdownRenderer } from "./renderers/MarkdownRenderer";
import { ToolUiRenderer } from "./renderers/ToolUiRenderer";

interface ResultPanelProps {
  run: ExperimentRun | null;
  onRenderCommitted: (startedAt: number, finishedAt: number) => void;
}

export function ResultPanel({ run, onRenderCommitted }: ResultPanelProps) {
  if (!run) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-sm text-[var(--color-ink-muted)]">
        Result pane waits for a completed run.
      </div>
    );
  }

  if (run.status === "error") {
    return (
      <div className="p-6 text-sm text-[var(--color-critical)]" role="alert">
        {run.error ?? "Experiment failed."}
      </div>
    );
  }

  if (!run.representation) {
    return (
      <div className="p-6 text-sm text-[var(--color-ink-muted)]">No representation produced.</div>
    );
  }

  return (
    <ResultMount
      key={run.id + run.request.renderMode}
      run={run}
      onRenderCommitted={onRenderCommitted}
    />
  );
}

function ResultMount({
  run,
  onRenderCommitted,
}: {
  run: ExperimentRun;
  onRenderCommitted: (startedAt: number, finishedAt: number) => void;
}) {
  const startedAtRef = useRef(performance.now());

  useEffect(() => {
    const startedAt = startedAtRef.current;
    const frame = requestAnimationFrame(() => {
      onRenderCommitted(startedAt, performance.now());
    });
    return () => cancelAnimationFrame(frame);
  }, [onRenderCommitted]);

  if (run.representation?.mode === "markdown" && typeof run.representation.payload === "string") {
    return (
      <div className="p-5">
        <MarkdownRenderer markdown={run.representation.payload} />
      </div>
    );
  }

  if (run.representation?.mode === "tool-ui") {
    return (
      <div className="p-5">
        <ToolUiRenderer representation={run.representation.payload as ToolUiRepresentation} />
      </div>
    );
  }

  return (
    <div className="p-6 text-sm text-[var(--color-ink-muted)]">
      Renderer for mode <code>{run.representation?.mode}</code> is not implemented.
    </div>
  );
}
