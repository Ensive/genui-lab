import type { ExperimentRun } from "@genui-lab/experiment-core";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./ui/badge";

type InspectorTab = "run" | "domain" | "representation" | "events" | "metrics";

interface InspectorProps {
  run: ExperimentRun | null;
  renderStartedAt?: number | null;
  renderFinishedAt?: number | null;
}

const TABS: { id: InspectorTab; label: string }[] = [
  { id: "run", label: "Run" },
  { id: "domain", label: "Domain result" },
  { id: "representation", label: "Representation" },
  { id: "events", label: "Events" },
  { id: "metrics", label: "Timing" },
];

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-auto rounded-md border border-[var(--color-line)] bg-[var(--color-panel-muted)] p-3 font-mono text-[11px] leading-relaxed text-[var(--color-ink)]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function Inspector({ run, renderStartedAt, renderFinishedAt }: InspectorProps) {
  const [tab, setTab] = useState<InspectorTab>("run");

  return (
    <section className="flex h-full min-h-0 flex-col" aria-label="Inspector">
      <div className="border-b border-[var(--color-line)] px-3 pt-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
          Inspector
        </p>
        <div role="tablist" aria-label="Inspector sections" className="flex flex-wrap gap-1 pb-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium transition-colors",
                tab === item.id
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                  : "text-[var(--color-ink-muted)] hover:bg-[var(--color-panel-muted)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-3" role="tabpanel">
        {!run ? (
          <p className="text-sm text-[var(--color-ink-muted)]">
            Run an experiment to populate run metadata, domain result, representation, events, and
            timing.
          </p>
        ) : tab === "run" ? (
          <dl className="space-y-3 text-sm" data-testid="inspector-run">
            <div>
              <dt className="text-xs text-[var(--color-ink-muted)]">Run ID</dt>
              <dd className="font-mono">{run.id}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-muted)]">Render mode</dt>
              <dd className="font-mono">{run.request.renderMode}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-muted)]">Status</dt>
              <dd>
                <Badge
                  tone={
                    run.status === "completed"
                      ? "normal"
                      : run.status === "error"
                        ? "critical"
                        : "info"
                  }
                >
                  {run.status}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-muted)]">Started</dt>
              <dd className="font-mono text-xs">{run.startedAt}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--color-ink-muted)]">Duration</dt>
              <dd className="font-mono">{run.durationMs?.toFixed(2) ?? "—"} ms</dd>
            </div>
          </dl>
        ) : tab === "domain" ? (
          <div data-testid="inspector-domain">
            {run.domainResult ? <JsonBlock value={run.domainResult} /> : <p>No domain result.</p>}
          </div>
        ) : tab === "representation" ? (
          <div data-testid="inspector-representation" className="space-y-2">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Raw representation payload for mode{" "}
              <span className="font-mono">{run.representation?.mode ?? "—"}</span>
            </p>
            {run.representation ? (
              typeof run.representation.payload === "string" ? (
                <pre className="overflow-auto rounded-md border border-[var(--color-line)] bg-[var(--color-panel-muted)] p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {run.representation.payload}
                </pre>
              ) : (
                <JsonBlock value={run.representation.inspectable} />
              )
            ) : (
              <p>No representation.</p>
            )}
          </div>
        ) : tab === "events" ? (
          <ol className="space-y-2 font-mono text-[11px]" data-testid="inspector-events">
            {run.events.map((event) => (
              <li
                key={event.id}
                className="grid grid-cols-[4.5rem_1fr] gap-2 rounded border border-[var(--color-line)] px-2 py-1.5"
              >
                <span className="text-[var(--color-ink-muted)]">
                  +{event.offsetMs.toFixed(1)}ms
                </span>
                <span>
                  {event.type}
                  {event.message ? (
                    <span className="block text-[var(--color-ink-muted)]">{event.message}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <div className="space-y-4 text-sm" data-testid="inspector-metrics">
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-[var(--color-ink-muted)]">domainAnalysisMs</dt>
                <dd className="font-mono">{run.metrics.domainAnalysisMs?.toFixed(2) ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-muted)]">representationMs</dt>
                <dd className="font-mono">{run.metrics.representationMs?.toFixed(2) ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-muted)]">totalRunMs</dt>
                <dd className="font-mono">{run.metrics.totalRunMs?.toFixed(2) ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-ink-muted)]">
                  render paint (host UI, best-effort)
                </dt>
                <dd className="font-mono">
                  {renderStartedAt != null && renderFinishedAt != null
                    ? `${(renderFinishedAt - renderStartedAt).toFixed(2)} ms`
                    : "not measured"}
                </dd>
              </div>
            </dl>
            <div className="rounded-md border border-dashed border-[var(--color-line)] p-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              <p className="font-medium text-[var(--color-ink)]">Measurement notes</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>
                  <code>domainAnalysisMs</code> / <code>representationMs</code> come from lifecycle
                  events around deterministic local work.
                </li>
                <li>
                  Host paint timing above is best-effort React commit/paint delta kept in UI state.
                  <code>RENDER_STARTED</code> / <code>RENDER_FINISHED</code> exist on the event
                  schema but are <strong>not</strong> appended to <code>run.events</code> in M1.
                </li>
                <li>
                  Future placeholders (never invented): TTFT, TTFC, TTI, TTC, inputTokens,
                  outputTokens, cost.
                </li>
              </ul>
              <dl className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div>ttftMs: null</div>
                <div>ttfcMs: null</div>
                <div>ttiMs: null</div>
                <div>ttcMs: null</div>
                <div>inputTokens: null</div>
                <div>outputTokens: null</div>
                <div>costUsd: null</div>
              </dl>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
