# Glossary

Single product vocabulary for GenUI Lab. Prefer these terms in issues, ADRs, code names, and agent output. Avoid drifting to synonyms listed under **Avoid**.

## Core concepts

### Authoritative domain state

The deterministic, validated domain result (today: `TelemetryAnalysis`) produced from fixtures/tools. **Source of truth** for what happened in the domain.

**Avoid:** treating Markdown, component trees, or chart pixels as ground truth.

### Representation

An architecture-specific encoding of authoritative state for a renderer (e.g. Markdown string, tool-UI contract tree). Representations are **derived**, not authoritative.

**Avoid:** “the UI state,” “the AST” (unless naming one framework’s native tree).

### Representation adapter

A function/object that maps `TelemetryAnalysis` → a mode-specific payload (`RepresentationAdapter`). Adapters preserve native semantics; they do not normalize every framework into one fake universal tree.

### Renderer

Host code that turns a representation into pixels/DOM (e.g. `MarkdownRenderer`, `ToolUiRenderer` in `apps/web`).

### Render mode

One comparable path through the lab (`markdown`, `tool-ui`, planned: `generated-tree`, `json-render`, `a2ui`, `openui`, `mcp-app`).

### Inspector

First-class product surface that shows run metadata, domain JSON, raw representation, **AG-UI Protocol** events, **Shared state**, **Lab lifecycle** events, and honest timing — so architectures stay **observable**.

### Stable semantic ID

Namespaced identity for metrics, alerts, charts, sources, and UI nodes (e.g. `metric:battery-temp-max`, `alert:temperature-anomaly-001`). Never use array indexes as semantic identities.

### Controlled UI vocabulary / UI contract

The bounded set of component kinds (`Stack`, `Grid`, `Metric`, `Alert`, `TimeSeriesChart`, …) from which catalog-constrained GenUI experiments may eventually generate UI. Owned by `packages/ui-contract`.

### Fixture-first

M1 policy: deterministic synthetic data and deterministic representations before LLM integration, so renderer behavior is separable from model nondeterminism (ADR-0002).

### Experiment run

One execution of a canonical task through a chosen render mode (`ExperimentRun`), including domain result, representation envelope, events, and metrics.

### Agent protocol

The bidirectional event/state channel between an agent runtime and the application. In this lab, **AG-UI** occupies this layer. It is **not** a render mode.

**Avoid:** representation, chat UI, GenUI format.

### Shared state

The AG-UI agent↔application sync value updated via `STATE_SNAPSHOT` / `STATE_DELTA`. Compact and protocol-owned; not authoritative domain analysis and not a UI representation.

**Avoid:** `TelemetryAnalysis`, representation payload, `selectedRenderMode`.

### Interrupt

An AG-UI run that ends with `RUN_FINISHED` outcome `type: "interrupt"`. Continuation is a **new run** on the same thread with `resume` entries for every interrupt — not a mid-stream pause and not an invented `INTERRUPT` event.

**Avoid:** error, cancel, browser alert.

### Lab lifecycle event

An experiment-core observability event (`DOMAIN_ANALYSIS_*`, lab `RUN_STARTED` / `RUN_COMPLETED`, etc.). Distinct from AG-UI protocol events even when names collide (both may emit `RUN_STARTED`).

**Avoid:** AG-UI event, protocol event (when you mean lab instrumentation).

## Protocols vs representations (do not conflate)

| Term | Means in this repo |
| --- | --- |
| **AG-UI** | Agent ↔ application **event/state protocol** (lifecycle, tools, HITL). Not a UI markup format. |
| **A2UI** | Declarative **generated UI representation** protocol. |
| **json-render** | Library/spec/renderer ecosystem for declarative UI trees. |
| **OpenUI (Lang)** | Compact **streaming UI language**. |
| **assistant-ui** | AI application **UI/runtime framework** (shell), not a wire protocol. |
| **MCP Apps** | **Sandboxed portable** interactive application UI. |

**Avoid:** calling all of the above “GenUI frameworks” interchangeably.

## Control spectrum (short)

From more fixed to more free:

```text
fixed UI → tool-bound UI → catalog-constrained declarative UI → sandboxed app → arbitrary generated code
```

GenUI Lab primarily researches the **middle** of this spectrum.

## Metrics honesty

| Metric | Meaning in M1 |
| --- | --- |
| `domainAnalysisMs` | Time between domain analysis started/finished events |
| `representationMs` | Time between representation started/finished events |
| `totalRunMs` | Honest runner elapsed time through `RUN_COMPLETED` |
| `ttftMs` / `ttfcMs` / `ttiMs` / `ttcMs` / tokens / cost | **Placeholders (`null`)** until real instrumentation exists |

**Avoid:** inventing or approximating LLM metrics.

## Data policy

**Synthetic data only.** Fixtures must be reproducible in tests. No employer, customer, or proprietary datasets.
