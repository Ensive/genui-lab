# GenUI Lab — agent notes

Experimental research lab for generative, agentic, and intelligent user interfaces.

**Thesis:** GenUI Lab does not ask which framework is “best.” It asks which architectural boundary and UI-generation strategy works best for a given interaction.

**Core loop:**

```text
deterministic domain analysis → representation adapter → renderer → inspector
                         ↘ AG-UI protocol (fixture now; live agent in M2.1)
```

Same task, multiple architectures — so control, latency, state behavior, safety, observability, and UX can be compared empirically.

## Cold-start (new conversation)

You do **not** need the founding chat prompt. Read in order:

1. This file  
2. [`GLOSSARY.md`](GLOSSARY.md)  
3. [`docs/adr/`](docs/adr/) (0001–0003)  
4. [`docs/design/roadmap.md`](docs/design/roadmap.md)  
5. The open GitHub issue + design doc for the milestone you will implement  

Then: `/grill-with-docs` (only if decisions remain) → `/to-spec` → `/to-tickets` → `/tdd` / `/implement`.

## Current state

| Item | Status |
| --- | --- |
| Milestone | **M2 — AG-UI fixture agent** complete on `main` |
| Working modes | Markdown, Tool-bound React UI |
| Agent protocol | Simulated AG-UI 1.0 fixture agent (interrupt → resume); not a render mode |
| Planned modes (UI stubs) | Generated tree, json-render, A2UI, OpenUI, MCP App |
| Offline / API key | Core + fixture agent offline — **no API key** |
| Env template | [`.env.example`](.env.example) for M2.1+ |
| Repo | [Ensive/genui-lab](https://github.com/Ensive/genui-lab) |

## Roadmap issues (implement these)

| Milestone | Issue | Design |
| --- | --- | --- |
| M2.1 Live agent (optional) | [#10](https://github.com/Ensive/genui-lab/issues/10) | [m2.1-live-agent.md](docs/design/m2.1-live-agent.md) |
| M3 Declarative GenUI | [#11](https://github.com/Ensive/genui-lab/issues/11) | [m3-declarative-genui.md](docs/design/m3-declarative-genui.md) |
| M4 assistant-ui | [#12](https://github.com/Ensive/genui-lab/issues/12) | [m4-assistant-ui.md](docs/design/m4-assistant-ui.md) |
| M5 MCP App | [#13](https://github.com/Ensive/genui-lab/issues/13) | [m5-mcp-app.md](docs/design/m5-mcp-app.md) |
| M6 Intelligent routing | [#14](https://github.com/Ensive/genui-lab/issues/14) | [m6-intelligent-routing.md](docs/design/m6-intelligent-routing.md) |
| M7 Reliability / evals | [#15](https://github.com/Ensive/genui-lab/issues/15) | [m7-reliability-evals.md](docs/design/m7-reliability-evals.md) |

Done: M1 ([#17](https://github.com/Ensive/genui-lab/issues/17)) · M2 ([#3](https://github.com/Ensive/genui-lab/issues/3)). Human: [#9](https://github.com/Ensive/genui-lab/issues/9) (repo home decision).

## Next milestone (default)

**M3 — Declarative GenUI** ([#11](https://github.com/Ensive/genui-lab/issues/11)) unless the user asks for **M2.1** first.

- Do **not** conflate AG-UI with A2UI / json-render / OpenUI (ADR-0001 / ADR-0003)
- Keep Telemetry 001 as the canonical task

## Before you change code

1. Read [docs/architecture/overview.md](docs/architecture/overview.md)  
2. Read ADRs — especially ADR-0001, ADR-0002, ADR-0003  
3. Use vocabulary from [GLOSSARY.md](GLOSSARY.md)  
4. Read the milestone design under [docs/design/](docs/design/)  

## Package boundaries

| Package / app | Owns | Must not |
| --- | --- | --- |
| `packages/domain` | Telemetry types, anomaly analysis, `TelemetryAnalysis` | Import React / UI frameworks |
| `packages/fixtures` | Deterministic synthetic telemetry + canonical task | Proprietary data, unseeded randomness |
| `packages/ui-contract` | Controlled component vocabulary, stable IDs | Premature mega-framework |
| `packages/experiment-core` | Runs, render modes, representation adapters | Domain math; AG-UI event ownership |
| `packages/observability` | Lab lifecycle events + honest timing | Invented LLM metrics; AG-UI types |
| `packages/ag-ui-adapter` | AG-UI protocol + fixture agent | Become a render mode; own domain truth |
| `apps/web` | Shell, renderers, inspector, HITL | Be domain source of truth |

## Hard constraints

- Authoritative domain state is deterministic; UI is a representation.  
- Stable semantic IDs — never array indexes as identities.  
- No fake universal AST (ADR-0001).  
- Fixture-first before models (ADR-0002); core works without API keys.  
- Do not invent TTFT / tokens / cost.  
- Planned modes stay stubs until their milestone.  
- Synthetic data only.  

## Validation

```bash
pnpm install
pnpm check
pnpm test
pnpm test:e2e
pnpm dev
```

## Design & architecture index

| Doc | Purpose |
| --- | --- |
| [docs/design/roadmap.md](docs/design/roadmap.md) | Full M1–M7 track + issue links |
| [docs/design/README.md](docs/design/README.md) | Design doc index |
| [docs/architecture/overview.md](docs/architecture/overview.md) | Layers + control spectrum |
| [docs/architecture/packages.md](docs/architecture/packages.md) | Workspace ownership |
| [docs/architecture/protocols.md](docs/architecture/protocols.md) | Why protocols ≠ representations |
| [docs/architecture/observability.md](docs/architecture/observability.md) | Lab vs protocol observability |
| [docs/experiments/telemetry-001.md](docs/experiments/telemetry-001.md) | First experiment |
| [README.md](README.md) | Public overview |

## Agent skills

### Issue tracker

GitHub Issues on [Ensive/genui-lab](https://github.com/Ensive/genui-lab) via `gh`. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

### Triage labels

`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context: [GLOSSARY.md](GLOSSARY.md) + [docs/adr/](docs/adr/). See [docs/agents/domain.md](docs/agents/domain.md).

### Parallel work

Independent tasks use a git worktree at `.worktrees/<branch>`. Follow the `using-git-worktrees` skill. Do not commit worktree contents.
