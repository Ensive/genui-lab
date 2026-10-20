# Package architecture

pnpm workspace. Packages stay small and boundary-explicit.

```text
genui-lab/
├── apps/web/                 React lab shell
└── packages/
    ├── domain/               authoritative analysis
    ├── fixtures/             synthetic deterministic data
    ├── ui-contract/          controlled UI vocabulary
    ├── experiment-core/      runs, modes, adapters
    ├── observability/        lab lifecycle events + honest metrics
    └── ag-ui-adapter/        AG-UI protocol + fixture agent
```

## Dependency direction (imports)

```text
fixtures ──► domain
experiment-core ──► domain, observability, ui-contract
ag-ui-adapter ──► domain, @ag-ui/client, @ag-ui/core
apps/web ──► domain, fixtures, experiment-core, ui-contract, observability, ag-ui-adapter
```

`domain` and `observability` must not depend on `apps/web` or React.
`ag-ui-adapter` must not depend on React or become a representation / render mode.

**Data flow** for a run (not the same as import arrows):

```text
fixture samples → analyzeTelemetry → representation adapters → renderers/inspector
                              ↘ TelemetryFixtureAgent → Protocol / Shared state / HITL
```

## Ownership detail

### `packages/domain`

- Telemetry sample / fixture types (shared shapes; fixtures package owns concrete data)
- Anomaly detection
- `analyzeTelemetry` → `TelemetryAnalysis`
- Zod schemas at the analysis boundary

### `packages/fixtures`

- `TELEMETRY_DEMO_001` and canonical task strings
- Expected reproducibility for tests
- No UI imports

### `packages/ui-contract`

- Component kind schemas: Stack, Grid, Heading, Text, Metric, Status, Alert, DataTable, TimeSeriesChart, Timeline, SourceList
- Stable ID helpers / conventions
- Serializable tool-UI representation envelope
- Prefer schemas over premature “generic UI framework” machinery

### `packages/experiment-core`

- `RenderMode`, `RENDER_MODES` (available vs planned)
- `ExperimentRequest` / `ExperimentRun`
- `RepresentationAdapter` + Markdown / Tool UI adapters
- `runExperiment` lifecycle orchestration
- **Not** the place for telemetry math or AG-UI events

### `packages/observability`

- Lab `ExperimentEvent` types and `ExperimentRecorder`
- `deriveMetrics()` from started/finished pairs
- Designed so OpenTelemetry can map later — **no OTel dependency in M1/M2**
- Distinct from AG-UI protocol events (name collisions like `RUN_STARTED` are expected)

### `packages/ag-ui-adapter`

- `TelemetryFixtureAgent` (`AbstractAgent`) emitting schema-validated AG-UI 1.0 events
- Compact shared-state helpers (`analysisId`, `vehicleId`, `status`, `anomalyIds`, …)
- Official interrupt outcome + resume runs (ADR-0003)
- **Must not** appear as a Representation mode

### `apps/web`

- Vite + React 19 + Tailwind lab UI
- Mode selector, result panel, inspector (incl. Protocol / Shared state / Lab lifecycle)
- Markdown + Tool UI renderers (incl. chart)
- HITL approve/reject for AG-UI interrupts
- Theme and design tokens

## Testing ownership

| Concern | Prefer |
| --- | --- |
| Fixture determinism, anomalies, schemas | `packages/domain`, `packages/fixtures` |
| Markdown / runner lifecycle | `packages/experiment-core` |
| AG-UI event streams / interrupt–resume | `packages/ag-ui-adapter` |
| Stable IDs | `packages/domain` (analysis entities) + `packages/ui-contract` (UI nodes) |
| App wiring / e2e | `apps/web` |
