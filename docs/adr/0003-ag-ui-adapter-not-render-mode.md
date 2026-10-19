# ADR-0003 — AG-UI via adapter + fixture agent; never a render mode

## Status

Accepted

## Context

M1 proved representation comparison (Markdown vs tool-bound UI) with a fixture-first domain. M2 needs the **agent ↔ application protocol** layer visible without conflating it with UI representation formats (A2UI, json-render, OpenUI, etc.).

AG-UI 1.0 defines typed lifecycle, tool, state, and interrupt/resume semantics. Inventing event types or treating AG-UI as a third “render mode” would teach the wrong architecture and fail AG-UI-literate review.

## Decision

Integrate AG-UI through `@genui-lab/ag-ui-adapter` using official `@ag-ui/client` / `@ag-ui/core`:

- In-process `AbstractAgent` fixture for M2 (deterministic; no LLM)
- HITL via `RUN_FINISHED` interrupt outcome + a **new** run with `resume` entries
- Inspector surfaces **Protocol** and **Shared state** separately from **Lab lifecycle** and Representation modes
- Live `HttpAgent` / OpenRouter deferred to M2.1 (ADR-0002)

AG-UI must not appear in the Representation mode list.

## Consequences

Positive:

- Protocol fidelity is reviewable against the AG-UI 1.0 schema
- Representation comparison (Markdown / Tool UI) stays intact
- Lab lifecycle vs protocol streams remain distinguishable despite name collisions (`RUN_STARTED`)

Trade-offs:

- Fixture agent is simulated — demos must be labeled clearly
- Live agents require a follow-up milestone (M2.1)

## Alternatives rejected

- Adding “AG-UI” as a Representation mode
- Translating lab lifecycle events into AG-UI events as the primary path
- Inventing a mid-stream pause / custom `INTERRUPT` event type
- Shipping HttpAgent + LLM in the same change set as the first protocol surface
