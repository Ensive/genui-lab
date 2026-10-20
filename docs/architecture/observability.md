# Observability model (M1 + M2)

## Purpose

Make architectural comparison **measurable** without lying about what we can measure.

`packages/observability` records **lab lifecycle** events with monotonic offsets (`performance.now()` / compatible fallback) and derives metrics only from complete start/finish pairs.

AG-UI protocol events live in a **separate stream** (collected from `TelemetryFixtureAgent` in `apps/web`). Do not merge or translate lab events into AG-UI events.

OpenTelemetry is **not** a dependency in M1/M2; event shapes should map cleanly later.

## Lab lifecycle events emitted by the runner today

`runExperiment` appends these to `ExperimentRun.events` on a successful path:

```text
+0.0ms   RUN_STARTED
+…       DOMAIN_ANALYSIS_STARTED
+…       DOMAIN_ANALYSIS_FINISHED
+…       REPRESENTATION_STARTED
+…       REPRESENTATION_FINISHED
+…       RUN_COMPLETED
```

On failure, `ERROR` is recorded (and the run may not reach `RUN_COMPLETED`).

### Reserved schema types (not emitted in M1/M2 runs)

The lab event enum also includes `RENDER_STARTED`, `RENDER_FINISHED`, and `INTERACTION`.

These are **schema placeholders only**. The experiment recorder does **not** append them to `run.events`.

## AG-UI protocol events (M2)

Emitted by `@genui-lab/ag-ui-adapter` (fixture agent), validated against `@ag-ui/core` schemas. Typical Run A:

```text
RUN_STARTED
TOOL_CALL_START / TOOL_CALL_ARGS / TOOL_CALL_END
STATE_SNAPSHOT
RUN_FINISHED (outcome.type = "interrupt")
```

Typical Run B (after resume):

```text
RUN_STARTED
TOOL_CALL_RESULT
STATE_DELTA / STATE_SNAPSHOT
RUN_FINISHED (outcome.type = "success")
```

Both lab and protocol streams may contain `RUN_STARTED` — inspector labels keep them distinct.

## Host paint timing (out-of-band)

`apps/web` may measure best-effort time around React commit/paint of the result panel and show it in the Timing tab as separate host UI state.

That measurement is **not** a lifecycle event on the run today.

## Honest metrics (M1/M2)

| Field | Source |
| --- | --- |
| `domainAnalysisMs` | Finished − started domain events |
| `representationMs` | Finished − started representation events |
| `totalRunMs` | Offset at `RUN_COMPLETED` (or elapsed if missing) |

## Placeholders (must stay null until real)

```text
ttftMs      time to first token (LLM)
ttfcMs      time to first component (streaming UI)
ttiMs       time to interactive
ttcMs       time to complete / task success
inputTokens
outputTokens
costUsd
```

Inventing these values pollutes future evals. The Timing tab should show these as explicit `null` placeholders.

## Inspector expectations

| Tab | Shows |
| --- | --- |
| **Lab lifecycle** | Chronological `run.events` with `+X.Xms` offsets (runner-emitted only) |
| **Protocol** | Raw AG-UI events from the fixture (or later live) agent |
| **Shared state** | Latest AG-UI `agent.state` (compact; not full `TelemetryAnalysis`) |
| **Timing** | Derived runner metrics; optional host paint delta; null LLM placeholders |
