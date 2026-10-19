# Observability model (M1)

## Purpose

Make architectural comparison **measurable** without lying about what we can measure.

`packages/observability` records lifecycle events with monotonic offsets (`performance.now()` / compatible fallback) and derives metrics only from complete start/finish pairs.

OpenTelemetry is **not** a dependency in M1; event shapes should map cleanly later.

## Lifecycle events emitted by the runner today

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

### Reserved schema types (not emitted in M1 runs)

The event enum also includes `RENDER_STARTED`, `RENDER_FINISHED`, and `INTERACTION`.

In M1 these are **schema placeholders only**. The experiment recorder does **not** append them to `run.events`. Do not document or implement as if they already appear in the inspector event list.

## Host paint timing (out-of-band)

`apps/web` may measure best-effort time around React commit/paint of the result panel and show it in the Timing tab as separate host UI state.

That measurement is **not** a lifecycle event on the run today. Wire `RENDER_*` into the recorder only when the host can honestly emit them.

Do not invent render completion times if the runtime cannot honestly observe them.

### Measurement ownership

| Concern | Owner | M1 reality |
| --- | --- | --- |
| Domain analysis | `runExperiment` / recorder | Emitted event pair |
| Representation | `runExperiment` / recorder | Emitted event pair |
| Render / paint | Host UI (`apps/web`) | Out-of-band best-effort; not in `run.events` |
| Interaction | Future | Reserved type; not emitted |

## Honest metrics (M1)

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

Inventing these values pollutes future evals.

## Inspector expectations

- **Events** tab: chronological list from `run.events` with `+X.Xms` offsets (runner-emitted only).
- **Timing** tab: derived runner metrics; optional host paint delta; placeholders called out as unimplemented.
