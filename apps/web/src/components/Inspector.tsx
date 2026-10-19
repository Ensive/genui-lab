import type { ExperimentRun } from "@genui-lab/experiment-core";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Badge } from "./ui/badge";

type InspectorTab =
  | "run"
  | "domain"
  | "representation"
  | "protocol"
  | "shared-state"
  | "lab-lifecycle"
  | "metrics";

interface InspectorProps {
  run: ExperimentRun | null;
  protocolEvents?: unknown[];
  sharedState?: unknown;
  renderStartedAt?: number | null;
  renderFinishedAt?: number | null;
}

const TABS: { id: InspectorTab; label: string }[] = [
  { id: "run", label: "Run" },
  { id: "domain", label: "Domain result" },
  { id: "representation", label: "Representation" },
  { id: "protocol", label: "Protocol" },
  { id: "shared-state", label: "Shared state" },
  { id: "lab-lifecycle", label: "Lab lifecycle" },
  { id: "metrics", label: "Timing" },
];

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="overflow-auto rounded-md border border-[var(--color-line)] bg-[var(--color-panel-muted)] p-3 font-mono text-[11px] leading-relaxed text-[var(--color-ink)]">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export function Inspector({
  run,
  protocolEvents = [],
  sharedState = null,
  renderStartedAt,
  renderFinishedAt,
}: InspectorProps) {
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
        {!run && tab !== "protocol" && tab !== "shared-state" ? (
          <p className="text-sm text-[var(--color-ink-muted)]">
            Run an experiment to populate run metadata, domain result, representation, lab
            lifecycle, and timing. Protocol tabs fill when the simulated AG-UI agent runs.
          </p>
        ) : tab === "run" && run ? (
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
        ) : tab === "domain" && run ? (
          <div data-testid="inspector-domain">
            {run.domainResult ? <JsonBlock value={run.domainResult} /> : <p>No domain result.</p>}
          </div>
        ) : tab === "representation" && run ? (
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
        ) : tab === "protocol" ? (
          <div className="space-y-2" data-testid="inspector-protocol">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Raw AG-UI protocol events. Distinct from lab lifecycle — both may include{" "}
              <code>RUN_STARTED</code>.
            </p>
            {protocolEvents.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-muted)]">No protocol events yet.</p>
            ) : (
              <ol className="space-y-2 font-mono text-[11px]">
                {protocolEvents.map((event, index) => {
                  const type =
                    typeof event === "object" && event !== null && "type" in event
                      ? String((event as { type: unknown }).type)
                      : "unknown";
                  return (
                    <li
                      key={`${type}-${String(index)}`}
                      className="rounded border border-[var(--color-line)] px-2 py-1.5"
                    >
                      <span className="text-[var(--color-accent)]">{type}</span>
                      <pre className="mt-1 overflow-auto whitespace-pre-wrap text-[10px] text-[var(--color-ink-muted)]">
                        {JSON.stringify(event, null, 2)}
                      </pre>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        ) : tab === "shared-state" ? (
          <div data-testid="inspector-shared-state" className="space-y-2">
            <p className="text-xs text-[var(--color-ink-muted)]">
              AG-UI shared state (snapshot/delta). Not authoritative domain analysis.
            </p>
            {sharedState ? (
              <JsonBlock value={sharedState} />
            ) : (
              <p className="text-sm text-[var(--color-ink-muted)]">No shared state yet.</p>
            )}
          </div>
        ) : tab === "lab-lifecycle" && run ? (
          <div className="space-y-2">
            <p className="text-xs text-[var(--color-ink-muted)]">
              Lab lifecycle events from experiment-core (not AG-UI).
            </p>
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
          </div>
        ) : tab === "metrics" && run ? (
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
                  Lab timing metrics are honest local work only. AG-UI fixture does not invent TTFT
                  or token counts.
                </li>
                <li>
                  Future placeholders (never invented): TTFT, TTFC, TTI, TTC, inputTokens,
                  outputTokens, cost.
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--color-ink-muted)]">Nothing to show for this tab yet.</p>
        )}
      </div>
    </section>
  );
}
