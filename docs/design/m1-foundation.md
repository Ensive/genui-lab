# Design: M1 Foundation

This document captures the **bootstrap / M1** design intent so later sessions do not need the original founding prompt.

## Goal

Prove one vertical architecture slice end-to-end:

```text
same domain task
        ↓
normalized deterministic result
        ↓
representation adapter
        ↓
different renderer
        ↓
inspector
```

M1 is a **vertical architecture proof**, not infrastructure theater. No auth, database, Docker, OpenTelemetry backend, model providers, or deployment pipelines beyond CI.

## Domain: synthetic automotive telemetry

Canonical task:

> Analyze vehicle telemetry for VIN DEMO-001 and show when battery temperature deviated from normal.

Fixture: `packages/fixtures` → `TELEMETRY_DEMO_001`.

Example signals: `timestamp`, `batteryTemperatureC`, `ambientTemperatureC`, `stateOfChargePct`, `chargingState`, `vehicleSpeedKph`.

- Normal battery band: **28–42 °C**
- Obvious anomaly: ~**54–59 °C** for several minutes
- No unseeded randomness; fixture must be reproducible in tests

Normalized result shape (conceptual): `TelemetryAnalysis` with `metrics`, `anomalies`, `series`, `status`, `sources`, stable IDs, Zod validation. Domain package has **no** UI framework imports.

## Working representation modes (exactly two)

1. **Markdown** — deterministic prose from `TelemetryAnalysis` (no LLM)
2. **Tool-bound React UI** — same analysis rendered with Status, Metric cards, Alert, TimeSeriesChart (battery + ambient), Sources

Planned (visible in UI, explicitly incomplete — do not install frameworks in M1):

3. Generative component tree  
4. json-render  
5. A2UI  
6. OpenUI  
7. MCP App  

## Representation abstraction

Lightweight adapter registry is enough:

```ts
interface RepresentationAdapter<TRepresentation = unknown> {
  id: RenderMode;
  name: string;
  description: string;
  createRepresentation(
    input: TelemetryAnalysis,
  ): Promise<TRepresentation> | TRepresentation;
}
```

Renderers may remain architecture-specific. Inspector shows **raw** representation payloads. Do not invent a universal AST merely to make frameworks look identical (ADR-0001).

## Inspector (first-class)

Tabs/sections:

| Section | Shows |
| --- | --- |
| Run | run ID, mode, status, started, duration |
| Domain result | pretty-printed `TelemetryAnalysis` |
| Representation | Markdown source or serializable tool-UI tree |
| Events (M1 name) | chronological **lab lifecycle** offsets (`+0.0ms RUN_STARTED`, …) — later renamed **Lab lifecycle** in the UI (M2) |
| Timing | honest `domainAnalysisMs`, `representationMs`, `totalRunMs`; placeholders for future LLM metrics |

Do not fake render-completion timing if React makes it ambiguous — document what was measured.

## Product UI tone

Developer-tool / protocol playground (Linear / Vercel-adjacent), not a marketing landing page or consumer chatbot. Dense but readable; desktop-first; Markdown and Tool UI share the lab shell.

## Engineering principles (M1 checklist)

1. Authoritative domain state is deterministic.  
2. Generated UI is a representation of state, not the source of truth.  
3. Component schemas form a controlled UI vocabulary.  
4. Stable component identities matter.  
5. Generated UI should be patchable rather than constantly regenerated (direction for later).  
6. Every representation should eventually be inspectable.  
7. Every experiment should eventually be measurable.  
8. Provider/framework-specific code lives behind adapters.  
9. The core must work without an LLM or API key.  
10. Synthetic data only.

## ADRs locked in M1

- **ADR-0001** — Stable core, framework adapters  
- **ADR-0002** — Fixture-first before model integration  

## Explicit non-goals for M1

Giant generic hooks, premature DI, Redux-by-default, backend services, authentication, databases, arbitrary HTML generation, model provider SDKs, inventing evaluation scores.

## Exit criteria (historical)

Repository initialized; fixtures + domain + Markdown + tool UI + chart + inspector + events + honest timing + docs + unit/e2e + CI + first git commit — without API keys or proprietary data.

See also: [telemetry-001 experiment](../experiments/telemetry-001.md), [architecture overview](../architecture/overview.md).
