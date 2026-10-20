# Design: M2 — AG-UI fixture agent

**Status:** Done on `main` (PR #8).  
**GitHub:** [#3](https://github.com/Ensive/genui-lab/issues/3) (closed)  
**ADR:** [ADR-0003](../adr/0003-ag-ui-adapter-not-render-mode.md)

## Goal

Make the **agent ↔ application protocol** layer observable for Telemetry 001 without conflating AG-UI with UI representation modes.

## What shipped

- Package `@genui-lab/ag-ui-adapter` with `TelemetryFixtureAgent extends AbstractAgent`
- Official AG-UI 1.0 events (schema-validated): tool calls, `STATE_SNAPSHOT` / `STATE_DELTA`, `RUN_FINISHED` interrupt outcome + resume run
- Inspector tabs: **Protocol**, **Shared state**, **Lab lifecycle** (renamed from Events)
- HITL approve/reject in the experiment shell
- Badge: “Simulated AG-UI agent (fixture)”
- No API key; fixture-first (ADR-0002)

## Explicit non-goals (deferred)

- Live HTTP agent / OpenRouter → **M2.1**
- AG-UI as a Representation mode → **never**
- Invented `INTERRUPT` event or mid-stream pause → **rejected**

## Shared state (compact)

```text
{ analysisId, vehicleId, status, anomalyIds, classificationApproved? }
```

Not full `TelemetryAnalysis`; not `selectedRenderMode`.

## Exit criteria (met)

Unit tests vs `@ag-ui/core` schemas; Playwright approve + reject; docs/glossary/ADR-0003; CI green.
