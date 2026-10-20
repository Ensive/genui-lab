# Design: M3 — Declarative GenUI

**Status:** Planned.  
**GitHub:** [#11](https://github.com/Ensive/genui-lab/issues/11)  
**Depends on:** M1 representations + M2 protocol (for comparison context); does not require M2.1.

## Goal

Run the **same Telemetry 001 task** through independent declarative UI representation stacks:

1. **json-render**
2. **A2UI**
3. **OpenUI** (OpenUI Lang)

so control, validity, size, latency, and failure recovery can be compared empirically.

Also implement / enable the **generative component tree** mode if it remains the catalog-constrained path distinct from the three above (original planned mode #3) — clarify in grilling whether it is a fourth path or folds into one of the three.

## Architectural rules

- Each stack is a **representation adapter + renderer**, registered like Markdown / Tool UI
- Do **not** force a universal AST (ADR-0001)
- Authoritative state remains `TelemetryAnalysis`
- Prefer catalog-constrained generation against `@genui-lab/ui-contract` where the stack allows
- AG-UI stays in the protocol layer; do not conflate A2UI/json-render/OpenUI with AG-UI ([protocols.md](../architecture/protocols.md))

## Measurements (honest)

| Metric | Meaning |
| --- | --- |
| Validity | Schema / catalog conformance rate |
| Representation size | Bytes / node count of payload |
| Time to first component | First meaningful UI commit when measurable |
| Total render time | Honest host timing when measurable |
| Failure recovery | Behavior on malformed / partial streams |

Do not invent scores. Placeholders stay `null` until instrumented.

## Acceptance criteria

- [ ] Three (or four) representation modes runnable on Telemetry 001 offline or with documented optional model use
- [ ] Inspector shows raw representation per mode
- [ ] Side-by-side comparison notes in docs/experiments or eval sheet
- [ ] Unit tests for adapters; e2e smoke per mode
- [ ] Planned-mode stubs removed once implemented

## Out of scope

assistant-ui product shell (M4), MCP sandbox apps (M5), intelligent routing (M6).
