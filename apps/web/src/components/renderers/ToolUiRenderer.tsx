import type { ToolUiRepresentation, UiNode } from "@genui-lab/ui-contract";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { TelemetryChart } from "./TelemetryChart";

interface ToolUiRendererProps {
  representation: ToolUiRepresentation;
}

function toneFrom(value: string | undefined): "normal" | "warning" | "critical" | "info" {
  if (value === "warning" || value === "critical" || value === "normal") {
    return value;
  }
  return "info";
}

function renderNode(node: UiNode): ReactNode {
  switch (node.kind) {
    case "Stack":
      return (
        <div key={node.id} id={node.id} className="flex flex-col gap-4" data-component-id={node.id}>
          {node.children.map((child) => renderNode(child))}
        </div>
      );
    case "Grid":
      return (
        <div
          key={node.id}
          id={node.id}
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          data-component-id={node.id}
        >
          {node.children.map((child) => renderNode(child))}
        </div>
      );
    case "Heading":
      return (
        <h2
          key={node.id}
          id={node.id}
          className="text-lg font-semibold tracking-tight"
          data-component-id={node.id}
        >
          {node.text}
        </h2>
      );
    case "Text":
      return (
        <p
          key={node.id}
          id={node.id}
          className="text-sm leading-relaxed text-[var(--color-ink-muted)]"
          data-component-id={node.id}
        >
          {node.text}
        </p>
      );
    case "Status":
      return (
        <div
          key={node.id}
          id={node.id}
          className="flex items-center gap-2"
          data-component-id={node.id}
        >
          <span className="text-xs uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Status
          </span>
          <Badge tone={toneFrom(node.tone)}>{node.label}</Badge>
        </div>
      );
    case "Metric":
      return (
        <div
          key={node.id}
          id={node.id}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] p-3"
          data-component-id={node.id}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-[var(--color-ink-muted)]">{node.label}</p>
            {node.tone ? <Badge tone={toneFrom(node.tone)}>{node.tone}</Badge> : null}
          </div>
          <p className="mt-2 font-mono text-2xl font-medium tracking-tight">
            {node.value}
            {node.unit ? (
              <span className="ml-1 text-sm text-[var(--color-ink-muted)]">{node.unit}</span>
            ) : null}
          </p>
          <p className="mt-1 font-mono text-[10px] text-[var(--color-ink-muted)]">{node.id}</p>
        </div>
      );
    case "Alert":
      return (
        <aside
          key={node.id}
          id={node.id}
          role="status"
          className="rounded-md border border-[var(--color-critical)]/40 bg-[var(--color-critical-soft)] p-3"
          data-component-id={node.id}
          data-testid="tool-ui-alert"
        >
          <div className="flex items-center gap-2">
            <Badge tone={toneFrom(node.tone)}>{node.tone}</Badge>
            <p className="text-sm font-semibold">{node.title}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed">{node.body}</p>
          <p className="mt-2 font-mono text-[10px] text-[var(--color-ink-muted)]">{node.id}</p>
        </aside>
      );
    case "TimeSeriesChart":
      return <TelemetryChart key={node.id} node={node} />;
    case "SourceList":
      return (
        <section key={node.id} id={node.id} className="space-y-2" data-component-id={node.id}>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Sources
          </h3>
          <ul className="space-y-2">
            {node.items.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] px-3 py-2 text-sm"
              >
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-[var(--color-ink-muted)]">{item.detail}</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--color-ink-muted)]">
                  {item.id}
                </p>
              </li>
            ))}
          </ul>
        </section>
      );
    default:
      return null;
  }
}

export function ToolUiRenderer({ representation }: ToolUiRendererProps) {
  return (
    <div data-testid="tool-ui-result" className="space-y-4">
      {renderNode(representation.root)}
    </div>
  );
}
