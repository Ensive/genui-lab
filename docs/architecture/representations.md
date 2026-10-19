# Representation modes & adapters

## Intent

Compare how the **same** `TelemetryAnalysis` is presented through different UI architectures without forcing those architectures into one fake universal AST.

## Adapter contract

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

The runner (`runExperiment`) selects an adapter by `renderMode`, records lifecycle events, and returns a `RepresentationEnvelope`:

- `mode` — which render mode produced the payload
- `payload` — native representation (string, contract tree, later protocol messages, …)
- `inspectable` — JSON-serializable view for the inspector

Host renderers in `apps/web` remain free to be architecture-specific.

## Modes

| ID | Status | Representation shape (M1) | Renderer |
| --- | --- | --- | --- |
| `markdown` | Available | Deterministic Markdown string | `MarkdownRenderer` |
| `tool-ui` | Available | `ToolUiRepresentation` (`ui-contract` tree) | `ToolUiRenderer` |
| `generated-tree` | Planned | Catalog-constrained generative tree | — |
| `json-render` | Planned | json-render document/stream | — |
| `a2ui` | Planned | A2UI declarative UI | — |
| `openui` | Planned | OpenUI language stream | — |
| `mcp-app` | Planned | Sandboxed app surface | — |

Planned modes must stay **explicitly incomplete** in the product UI until their milestone ships.

## Markdown (M1)

Transform analysis into summary, metrics, anomalies, sources. Pure function. No LLM. Byte-stable for a fixed analysis.

## Tool UI (M1)

Map analysis fields onto the controlled vocabulary (Status, Metric, Alert, TimeSeriesChart, SourceList) with stable IDs retained from the domain layer where possible (`metric:*`, `alert:*`, `chart:*`, `source:*`).

Chart must plot `batteryTemperatureC` and `ambientTemperatureC` and make the anomaly interval identifiable **without color as the only cue** (text summary + labeled highlight).

## Future modes

Add a new adapter + renderer + inspector view. Prefer measuring:

- schema / structural validity
- representation size
- time to first meaningful paint/component (when streaming exists)
- failure recovery

Do not collapse AG-UI into this table as a “render mode” — see [protocols.md](protocols.md).
