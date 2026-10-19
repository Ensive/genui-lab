import type { ExperimentRun, RenderMode } from "@genui-lab/experiment-core";
import { runExperiment } from "@genui-lab/experiment-core";
import {
  CANONICAL_EXPERIMENT_ID,
  CANONICAL_GENERATED_AT,
  CANONICAL_TASK,
  TELEMETRY_DEMO_001,
} from "@genui-lab/fixtures";
import { useCallback, useEffect, useState } from "react";
import { Inspector } from "@/components/Inspector";
import { ModeSelector } from "@/components/ModeSelector";
import { ResultPanel } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { applyTheme, getInitialTheme, type ThemeMode } from "@/lib/theme";

export function App() {
  const [mode, setMode] = useState<RenderMode>("markdown");
  const [run, setRun] = useState<ExperimentRun | null>(null);
  const [busy, setBusy] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme());
  const [renderStartedAt, setRenderStartedAt] = useState<number | null>(null);
  const [renderFinishedAt, setRenderFinishedAt] = useState<number | null>(null);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const onRenderCommitted = useCallback((startedAt: number, finishedAt: number) => {
    setRenderStartedAt(startedAt);
    setRenderFinishedAt(finishedAt);
  }, []);

  async function handleRun() {
    setBusy(true);
    setRenderStartedAt(null);
    setRenderFinishedAt(null);
    try {
      const next = await runExperiment(
        {
          experimentId: CANONICAL_EXPERIMENT_ID,
          task: CANONICAL_TASK,
          renderMode: mode,
          vehicleId: TELEMETRY_DEMO_001.vehicleId,
        },
        {
          fixture: TELEMETRY_DEMO_001,
          generatedAt: CANONICAL_GENERATED_AT,
        },
      );
      setRun(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-4 md:px-6 md:py-5">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-line)] pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            GenUI Lab
          </p>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Instrumented UI architecture lab
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden font-mono text-xs text-[var(--color-ink-muted)] sm:block">
            Experiment: Telemetry 001
          </p>
          <Button
            variant="outline"
            size="sm"
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </header>

      <section className="mt-4 rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90 p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-ink)]">
          {CANONICAL_TASK}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button onClick={handleRun} disabled={busy} data-testid="run-experiment">
            {busy ? "Running…" : "Run experiment"}
          </Button>
          <p className="font-mono text-[11px] text-[var(--color-ink-muted)]">
            Offline · deterministic fixtures · no API key
          </p>
        </div>
      </section>

      <div className="mt-4 grid min-h-[70vh] flex-1 grid-cols-1 gap-3 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <aside className="rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90 p-3">
          <ModeSelector value={mode} onChange={setMode} />
        </aside>

        <main className="min-h-[28rem] overflow-auto rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90">
          <div className="border-b border-[var(--color-line)] px-4 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
              Result
            </p>
          </div>
          <ResultPanel run={run} onRenderCommitted={onRenderCommitted} />
        </main>

        <aside className="min-h-[28rem] overflow-hidden rounded-lg border border-[var(--color-line)] bg-[var(--color-panel)]/90">
          <Inspector
            run={run}
            renderStartedAt={renderStartedAt}
            renderFinishedAt={renderFinishedAt}
          />
        </aside>
      </div>
    </div>
  );
}
