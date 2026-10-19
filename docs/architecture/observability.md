# Observability model (M1)

## Purpose

Make architectural comparison **measurable** without lying about what we can measure.

`packages/observability` records lifecycle events with monotonic offsets (`performance.now()` / compatible fallback) and derives metrics only from complete start/finish pairs.

OpenTelemetry is **not** a dependency in M1; event shapes should map cleanly later.

## Lifecycle events

Typical successful run:

```text
+0.0ms   RUN_STARTED
+…       DOMAIN_ANALYSIS_STARTED
+…       DOMAIN_ANALYSIS_FINISHED
+…       REPRESENTATION_STARTED
+…       REPRESENTATION_FINISHED
+…       RUN_COMPLETED
```

Also defined: `RENDER_STARTED`, `RENDER_FINISHED`, `INTERACTION`, `ERROR`.

### Measurement ownership

| Event pair | Owner | Notes |
| --- | --- | --- |
| Domain analysis | `runExperiment` / recorder | Deterministic local CPU work |
| Representation | `runExperiment` / recorder | Adapter `createRepresentation` |
| Render | Host UI (`apps/web`) | Best-effort around React commit/paint; document limitations |
| Interaction | Future | User events against a representation |

Do not invent render completion times if the runtime cannot honestly observe them.

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

Chronological event list with `+X.Xms` offsets; timing tab explains what each number means; placeholders called out as unimplemented.
