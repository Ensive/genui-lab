# ADR-0003 — AG-UI via adapter + fixture agent; never a render mode

AG-UI is the agent ↔ application protocol layer. GenUI Lab integrates it through `@genui-lab/ag-ui-adapter` using official `@ag-ui/client` / `@ag-ui/core`, with an in-process `AbstractAgent` fixture for M2. AG-UI is not a representation / render mode; HITL uses official interrupt outcomes and resume runs (no invented INTERRUPT event). Live HTTP/OpenRouter agents are deferred to M2.1 so protocol behavior stays distinguishable from model nondeterminism (ADR-0002).

## Status

Accepted

## Alternatives rejected

- Adding “AG-UI” as a third item in the Representation mode list
- Translating lab lifecycle events into AG-UI events as the primary adapter path
- Inventing a mid-stream pause / custom INTERRUPT event type
- Shipping HttpAgent + LLM in the same commit as the first protocol surface
