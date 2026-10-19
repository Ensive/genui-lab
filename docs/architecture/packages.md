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
    └── observability/        events + honest metrics
```

## Dependency direction

```text
fixtures ──► domain
experiment-core ──► domain, observability, ui-contract
apps/web ──► domain, fixtures, experiment-core, ui-contract, observability
```

`domain` and `observability` must not depend on `apps/web` or React.

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
- **Not** the place for telemetry math

### `packages/observability`

- `ExperimentEvent` types and `ExperimentRecorder`
- `deriveMetrics()` from started/finished pairs
- Designed so OpenTelemetry can map later — **no OTel dependency in M1**

### `apps/web`

- Vite + React 19 + Tailwind lab UI
- Mode selector, result panel, inspector
- Markdown + Tool UI renderers (incl. chart)
- Theme and design tokens

## Testing ownership

| Concern | Prefer |
| --- | --- |
| Fixture determinism, anomalies, schemas | `packages/domain`, `packages/fixtures` |
| Markdown / runner lifecycle | `packages/experiment-core` |
| Stable IDs | `packages/ui-contract` |
| App wiring / e2e | `apps/web` |
