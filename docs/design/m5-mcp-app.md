# Design: M5 — MCP App

**Status:** Planned.  
**GitHub:** [#13](https://github.com/Ensive/genui-lab/issues/13)  
**Depends on:** M1 domain + UI; useful after M3 for “catalog vs sandbox” contrast.

## Goal

Render the telemetry explorer as a **sandboxed portable interactive application** (MCP Apps) and compare:

| Path | Character |
| --- | --- |
| Native catalog UI | Controlled vocabulary / tool-bound or declarative catalog |
| MCP App | Sandboxed arbitrary application UI |

Same Telemetry 001 authoritative state.

## Constraints

- MCP Apps ≠ AG-UI ≠ A2UI ([protocols.md](../architecture/protocols.md))
- Sandbox safety: no proprietary data; synthetic fixtures only
- Keep inspector able to show what the host received / mounted

## Acceptance criteria

- [ ] MCP App packaging for telemetry explorer
- [ ] Side-by-side or mode-switch comparison vs native catalog UI
- [ ] Documented trust / sandbox boundary
- [ ] Smoke tests for mount + basic interaction

## Out of scope

Intelligent routing (M6), full reliability matrix (M7).
