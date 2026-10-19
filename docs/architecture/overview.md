# Architecture overview

## Problem

Traditional AI product surfaces often collapse into a single path:

```text
user
→ chat
→ LLM
→ Markdown
```

That path is useful, but it hides architectural choices that matter for reliability, latency, safety, and task success.

GenUI Lab studies a broader research space:

```text
intent
→ intelligence / agent
→ tools + authoritative state
→ representation
→ renderer
→ interaction
→ updated state / agent
```

The same domain task is executed through multiple UI architectures so control, latency, state behavior, safety, observability, and UX can be compared empirically.

GenUI Lab does not ask which framework is “best.” It asks which architectural boundary and UI-generation strategy works best for a given interaction.

## Layer model

```text
Domain / authoritative state
        ↓
Intelligence / agent runtime
        ↓
Agent ↔ application protocol
        ↓
UI representation
        ↓
Renderer + component catalog
        ↓
Product UI
```

Not every experiment uses every layer.

| Layer | Role in GenUI Lab | Notes |
| --- | --- | --- |
| Domain / authoritative state | Deterministic telemetry analysis | Source of truth; never the generated UI |
| Intelligence / agent runtime | Future AG-UI / model integrations | Absent in M1 on purpose |
| Agent ↔ application protocol | AG-UI-style event/state sync | Not a UI representation format |
| UI representation | Markdown, tool UI tree, later A2UI / json-render / OpenUI | Architecture-specific payloads |
| Renderer + component catalog | React shell + controlled vocabulary | Stable component IDs |
| Product UI | Experiment shell + inspector | Developer-tool surface |

## Control spectrum

```text
fixed UI
    ↓
tool-bound UI
    ↓
catalog-constrained declarative UI
    ↓
sandboxed custom application
    ↓
arbitrary generated code
```

The project primarily researches the middle of this spectrum: tool-bound UI and catalog-constrained declarative UI, with sandboxed apps (MCP Apps) as a deliberate comparison point.

## First vertical slice (M1)

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

Working modes today:

1. Markdown
2. Tool-bound React UI

Planned modes (visible, explicitly incomplete):

3. Generative component tree
4. json-render
5. A2UI
6. OpenUI
7. MCP App

## Protocol placement (future)

These technologies are not interchangeable:

| Technology | Architectural layer |
| --- | --- |
| AG-UI | Agent ↔ application event/state protocol |
| A2UI | Declarative generated UI representation |
| json-render | Library/spec/renderer ecosystem |
| OpenUI Lang | Compact streaming UI language |
| assistant-ui | AI application UI/runtime framework |
| MCP Apps | Sandboxed portable interactive application UI |

Adapters preserve differences instead of inventing a fake universal AST.

## Observability

Every run records lifecycle events with offsets from `performance.now()` (or a Node-compatible fallback):

```text
RUN_STARTED
DOMAIN_ANALYSIS_STARTED
DOMAIN_ANALYSIS_FINISHED
REPRESENTATION_STARTED
REPRESENTATION_FINISHED
RUN_COMPLETED
```

Honest metrics in M1:

- `domainAnalysisMs`
- `representationMs`
- `totalRunMs`

Host UI may also record best-effort render paint timing. LLM metrics (TTFT, tokens, cost) remain explicit null placeholders until model integration exists.

## Further reading

| Doc | Topic |
| --- | --- |
| [m1-foundation.md](../design/m1-foundation.md) | Bootstrap / M1 design capture |
| [packages.md](packages.md) | Workspace ownership and dependency direction |
| [representations.md](representations.md) | Adapter pattern and render modes |
| [ui-contract.md](ui-contract.md) | Controlled vocabulary and stable IDs |
| [observability.md](observability.md) | Events and honest metrics |
| [protocols.md](protocols.md) | AG-UI vs A2UI vs json-render vs OpenUI vs MCP Apps vs assistant-ui |
| [../../GLOSSARY.md](../../GLOSSARY.md) | Controlled vocabulary |
| [../../AGENTS.md](../../AGENTS.md) | Agent handoff notes |
