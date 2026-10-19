# Protocol & framework placement

These systems are **not interchangeable**. GenUI Lab exists partly to demonstrate why.

| Technology | Architectural layer | Research role |
| --- | --- | --- |
| **AG-UI** | Agent ↔ application event/state protocol | M2: lifecycle, snapshots/deltas, tools, HITL — **not** a render mode |
| **A2UI** | Declarative generated UI representation | M3: same task through A2UI |
| **json-render** | Declarative UI library/spec/renderer ecosystem | M3: same task through json-render |
| **OpenUI Lang** | Compact streaming UI language | M3: same task through OpenUI |
| **assistant-ui** | AI application UI/runtime framework | M4: compare shell value vs our lab shell |
| **MCP Apps** | Sandboxed portable interactive application UI | M5: catalog UI vs sandboxed app |

## Implications

1. **Do not** model AG-UI as another entry in the representation-mode radio list that “renders telemetry.”
2. **Do** keep domain + experiment-core + observability framework-independent (ADR-0001).
3. Integrate each system through an **explicit adapter** that preserves native semantics.
4. Reject inventing one universal internal protocol before experiments prove it useful.

## Control spectrum reminder

```text
fixed UI
  → tool-bound UI          ← M1 Tool UI
  → catalog-constrained    ← M3 declarative GenUI
  → sandboxed app          ← M5 MCP Apps
  → arbitrary generated code
```

Primary research focus: the **middle** of this spectrum.

## Roadmap pointer

Public milestone list: [README.md](../../README.md#roadmap). Design intent for shipped M1: [m1-foundation.md](../design/m1-foundation.md).
