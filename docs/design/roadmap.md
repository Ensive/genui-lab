# GenUI Lab — full roadmap

Captured from the founding project brief so cold-start agents can implement **all** milestones without the original prompt.

## Thesis (do not lose this)

> GenUI Lab does not ask which framework is “best.” It asks which architectural boundary and UI-generation strategy works best for a given interaction.

> The same task is executed through multiple UI architectures so control, latency, state behavior, safety, observability, and UX can be compared empirically.

Research path:

```text
intent → intelligence/agent → tools + authoritative state → representation → renderer → interaction → updated state
```

## Canonical experiment

**Telemetry 001** — VIN `DEMO-001`, battery temperature anomaly. See [../experiments/telemetry-001.md](../experiments/telemetry-001.md).

## Milestone track

| ID | Name | Status | Design | Issue |
| --- | --- | --- | --- | --- |
| M1 | Foundation | **Done** | [m1-foundation.md](./m1-foundation.md) | [#17](https://github.com/Ensive/genui-lab/issues/17) closed |
| M2 | AG-UI fixture agent | **Done** | [m2-ag-ui.md](./m2-ag-ui.md) | [#3](https://github.com/Ensive/genui-lab/issues/3) closed |
| M2.1 | Live AG-UI + OpenRouter | Open | [m2.1-live-agent.md](./m2.1-live-agent.md) | [#10](https://github.com/Ensive/genui-lab/issues/10) |
| M3 | Declarative GenUI | Open | [m3-declarative-genui.md](./m3-declarative-genui.md) | [#11](https://github.com/Ensive/genui-lab/issues/11) |
| M4 | assistant-ui | Open | [m4-assistant-ui.md](./m4-assistant-ui.md) | [#12](https://github.com/Ensive/genui-lab/issues/12) |
| M5 | MCP App | Open | [m5-mcp-app.md](./m5-mcp-app.md) | [#13](https://github.com/Ensive/genui-lab/issues/13) |
| M6 | Intelligent routing | Open | [m6-intelligent-routing.md](./m6-intelligent-routing.md) | [#14](https://github.com/Ensive/genui-lab/issues/14) |
| M7 | Reliability / evals | Open | [m7-reliability-evals.md](./m7-reliability-evals.md) | [#15](https://github.com/Ensive/genui-lab/issues/15) |

## Recommended order

```text
M2.1 (optional) ─┐
                 ├─► M3 ─► M4 ─► M5 ─► M6 ─► M7
M2 (done) ───────┘
```

- **M3** is the default next representation milestone (original “compare architectures” path).
- **M2.1** is optional if you want a live agent demo before declarative GenUI.
- **M6** needs multiple modes; **M7** needs modes + optional models.

## Protocol placement (never conflate)

| Technology | Layer |
| --- | --- |
| AG-UI | Agent ↔ application event/state protocol |
| A2UI | Declarative generated UI representation |
| json-render | Library/spec/renderer ecosystem |
| OpenUI Lang | Compact streaming UI language |
| assistant-ui | AI application UI/runtime framework |
| MCP Apps | Sandboxed portable interactive application UI |

## Engineering principles (always on)

1. Authoritative domain state is deterministic.  
2. Generated UI is a representation of state, not the source of truth.  
3. Component schemas form a controlled UI vocabulary.  
4. Stable component identities matter.  
5. Generated UI should be patchable rather than constantly regenerated.  
6. Every representation should eventually be inspectable.  
7. Every experiment should eventually be measurable.  
8. Provider/framework-specific code lives behind adapters.  
9. The core must work without an LLM or API key (except explicitly model-backed milestones).  
10. Synthetic data only.

## New agent bootstrap

```text
AGENTS.md → GLOSSARY.md → docs/adr/* → docs/design/roadmap.md → open milestone issue → design doc → implement
```
