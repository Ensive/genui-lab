# Design specs (roadmap)

These documents capture milestone intent so **new agent sessions can continue without the original founding prompt or prior chat history**.

Full table + ordering: **[roadmap.md](./roadmap.md)**.

| Milestone | Status | Design doc | GitHub |
| --- | --- | --- | --- |
| M1 — Foundation | Done on `main` | [m1-foundation.md](./m1-foundation.md) | [#17](https://github.com/Ensive/genui-lab/issues/17) (closed) |
| M2 — AG-UI fixture | Done on `main` | [m2-ag-ui.md](./m2-ag-ui.md) | [#3](https://github.com/Ensive/genui-lab/issues/3) (closed) |
| M2.1 — Live agent | Planned (optional) | [m2.1-live-agent.md](./m2.1-live-agent.md) | [#10](https://github.com/Ensive/genui-lab/issues/10) |
| M3 — Declarative GenUI | Planned | [m3-declarative-genui.md](./m3-declarative-genui.md) | [#11](https://github.com/Ensive/genui-lab/issues/11) |
| M4 — assistant-ui | Planned | [m4-assistant-ui.md](./m4-assistant-ui.md) | [#12](https://github.com/Ensive/genui-lab/issues/12) |
| M5 — MCP App | Planned | [m5-mcp-app.md](./m5-mcp-app.md) | [#13](https://github.com/Ensive/genui-lab/issues/13) |
| M6 — Intelligent routing | Planned | [m6-intelligent-routing.md](./m6-intelligent-routing.md) | [#14](https://github.com/Ensive/genui-lab/issues/14) |
| M7 — Reliability / evals | Planned | [m7-reliability-evals.md](./m7-reliability-evals.md) | [#15](https://github.com/Ensive/genui-lab/issues/15) |

## How a new agent should start

1. Read root [`AGENTS.md`](../../AGENTS.md)
2. Read [`GLOSSARY.md`](../../GLOSSARY.md) + ADRs in [`docs/adr/`](../adr/)
3. Read [roadmap.md](./roadmap.md) + the design doc for the **next open milestone issue**
4. `/grill-with-docs` only if the milestone design still has open decisions; otherwise `/to-spec` → `/to-tickets` → `/implement`

## Invariants (all milestones)

- Same canonical task: Telemetry 001 (`DEMO-001`) unless a milestone explicitly adds a second experiment.
- Authoritative state stays in `@genui-lab/domain` fixtures/analysis.
- Protocols ≠ representations (see [`../architecture/protocols.md`](../architecture/protocols.md)).
- Core paths remain useful offline after `pnpm install` unless the milestone is explicitly model-backed (M2.1, parts of M6/M7).
- Never invent LLM metrics; never use proprietary data.
