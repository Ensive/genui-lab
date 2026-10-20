# Design: M4 — assistant-ui

**Status:** Planned.  
**GitHub:** [#12](https://github.com/Ensive/genui-lab/issues/12)  
**Depends on:** M1 tool UI + M2 AG-UI surfaces; ideally M3 for “generated trees” comparison.

## Goal

Study where **assistant-ui** (AI application UI/runtime framework) adds value versus GenUI Lab’s own shell:

- Tool UI presentation
- Presenting generated component trees
- Spec Mode
- AG-UI runtime integration

## Research questions

1. Does assistant-ui replace our mode selector / result panel / inspector, or wrap them?
2. Where does it help HITL / tool rendering vs our native Tool UI renderer?
3. How does its AG-UI integration compare to `@genui-lab/ag-ui-adapter`?

## Constraints

- assistant-ui is a **shell/runtime**, not a wire UI language ([protocols.md](../architecture/protocols.md))
- Keep lab comparison surfaces (inspector, representation payloads) available
- Adapter boundary: do not rewrite `@genui-lab/domain` around assistant-ui

## Acceptance criteria

- [ ] Documented integration path (adapter or embed)
- [ ] At least one Telemetry 001 path rendered through assistant-ui
- [ ] Written comparison: GenUI Lab shell vs assistant-ui (strengths / costs)
- [ ] Tests covering the integration seam

## Out of scope

MCP Apps (M5), routing (M6), full eval harness (M7).
