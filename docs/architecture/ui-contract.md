# UI contract & stable IDs

## Purpose

Establish a **controlled UI vocabulary** for catalog-constrained GenUI experiments without building a mega-framework in M1.

Owned by `packages/ui-contract`. No React required in the contract package.

## Initial vocabulary

| Kind | Role |
| --- | --- |
| `Stack` | Vertical composition |
| `Grid` | Responsive metric/card layout |
| `Heading` | Section titles |
| `Text` | Prose |
| `Metric` | Labeled numeric/text KPI |
| `Status` | Overall tone badge |
| `Alert` | Anomaly / warning callout |
| `DataTable` | Tabular rows (schema ready; optional in M1 UI) |
| `TimeSeriesChart` | Multi-series chart + accessible summary + highlight window |
| `Timeline` | Ordered events (schema ready) |
| `SourceList` | Provenance / fixture references |

Implement only what Tool UI needs in the React host; keep schemas broad enough to show direction.

## Stable semantic IDs

Every renderable entity should carry a namespaced ID:

```text
metric:battery-temp-max
chart:battery-temperature
alert:temperature-anomaly-001
source:telemetry-demo-001
stack:tool-ui-root
heading:analysis-title
```

Rules:

- Include a namespace prefix (`kind:slug`)
- Prefer domain-originated IDs when the node mirrors a domain object
- **Never** use bare array indexes as semantic identities (`metric:0` is invalid)

## Why this matters later

Catalog-constrained generation, patchable UI, evals for “UI stability,” and cross-mode inspector diffs all depend on stable identities and a bounded component set. Unbounded arbitrary HTML/code is a later comparison point (MCP Apps / sandboxes), not the default path.
