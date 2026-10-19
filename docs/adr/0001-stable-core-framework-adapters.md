# ADR-0001 — Stable core, framework adapters

## Status

Accepted

## Context

The GenUI ecosystem includes multiple protocols and frameworks that evolve independently, solve different layers, and are often pre-1.0:

- AG-UI (agent ↔ application protocol)
- A2UI, json-render, OpenUI (declarative / streaming UI representations)
- assistant-ui (application UI/runtime)
- MCP Apps (sandboxed applications)

Building the entire laboratory around any one of them would make comparison impossible and couple research velocity to a single external roadmap.

## Decision

The domain model, experiment runner, and observability contracts remain framework-independent.

AG-UI, A2UI, json-render, OpenUI, assistant-ui, and MCP Apps will be integrated through explicit adapters/implementations that preserve their native semantics.

Renderers may remain architecture-specific. The inspector displays raw representation payloads rather than forcing a universal internal AST.

## Consequences

Positive:

- protocols can be added, upgraded, or retired independently
- architectural differences stay visible and measurable
- core packages work offline without any GenUI framework installed

Trade-offs:

- some duplication across adapters
- no single “write once, render everywhere” abstraction for all modes

## Alternatives rejected

1. Building the entire project directly around one GenUI framework.
2. Inventing one universal internal protocol before experiments prove it useful.
