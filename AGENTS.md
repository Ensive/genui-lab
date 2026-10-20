# GenUI Lab — agent notes

Experimental research lab for generative, agentic, and intelligent user interfaces.

**Thesis:** GenUI Lab does not ask which framework is “best.” It asks which architectural boundary and UI-generation strategy works best for a given interaction.

**Core loop:**

```text
deterministic domain analysis → representation adapter → renderer → inspector
```

Same task, multiple architectures — so control, latency, state behavior, safety, observability, and UX can be compared empirically.

## Current state

| Item | Status |
| --- | --- |
| Milestone | **M2 — AG-UI fixture agent** complete on this PR / after merge on `main` |
| Working modes | Markdown, Tool-bound React UI |
| Agent protocol | Simulated AG-UI 1.0 fixture agent (interrupt → resume); not a render mode |
| Planned modes (UI stubs only) | Generated tree, json-render, A2UI, OpenUI, MCP App |
| Offline / API key | Core experiments + fixture agent run offline — **no API key** |
| Repo | [Ensive/genui-lab](https://github.com/Ensive/genui-lab) |
| Spec / tickets | [#3](https://github.com/Ensive/genui-lab/issues/3) · [#4](https://github.com/Ensive/genui-lab/issues/4)–[#7](https://github.com/Ensive/genui-lab/issues/7) |

## Next milestone (do this next)

**M2.1 — Live agent (optional)** or **M3 — Declarative GenUI**

- **M2.1:** `HttpAgent` + OpenRouter behind the same Protocol / Shared state inspector (`.env.local`; never invent token/cost metrics)
- **M3:** same telemetry task through json-render / A2UI / OpenUI as **representation** modes
- Do **not** conflate AG-UI with UI representation formats (ADR-0001 / ADR-0003)

## Before you change code

1. Read [docs/architecture/overview.md](docs/architecture/overview.md)
2. Read ADRs in [docs/adr/](docs/adr/) — especially ADR-0001, ADR-0002, and ADR-0003
3. Use vocabulary from [GLOSSARY.md](GLOSSARY.md)
4. Skim the design notes under [docs/architecture/](docs/architecture/) and [docs/design/m1-foundation.md](docs/design/m1-foundation.md) if touching boundaries

## Package boundaries

| Package / app | Owns | Must not |
| --- | --- | --- |
| `packages/domain` | Telemetry types, anomaly analysis, normalized `TelemetryAnalysis` | Import React / Markdown / UI frameworks |
| `packages/fixtures` | Deterministic synthetic telemetry + canonical task | Non-reproducible randomness, proprietary data |
| `packages/ui-contract` | Controlled component vocabulary, stable IDs, Zod schemas | React implementations (unless strongly justified) |
| `packages/experiment-core` | `ExperimentRequest` / `ExperimentRun`, render modes, representation adapters, runner | Domain-specific analysis logic |
| `packages/observability` | Lab lifecycle events + honest timing metrics | Invented LLM/cost/TTFT values; AG-UI event types |
| `packages/ag-ui-adapter` | AG-UI protocol + fixture `AbstractAgent`; shared-state helpers | Become a render mode; own authoritative domain state |
| `apps/web` | React shell, design system, renderers, inspector, HITL controls | Becoming the source of truth for domain state |

Vertical **data** flow today (not package import arrows — see [packages.md](docs/architecture/packages.md)):

```text
fixture samples → analyzeTelemetry → representation adapters → renderers + inspector
                              ↘ ag-ui-adapter (protocol events / shared state / HITL)
```


## Hard constraints

- **Authoritative state is deterministic.** Generated UI is a representation, not the source of truth.
- **Stable semantic IDs** (`metric:battery-temp-max`, `alert:temperature-anomaly-001`) — never array indexes as identities.
- **No fake universal AST** that erases protocol differences (ADR-0001).
- **Fixture-first before models** (ADR-0002). Do not require an LLM or API key for core paths.
- **Do not invent metrics:** TTFT / TTFC / TTI / TTC / tokens / cost stay `null` until honestly instrumented.
- **Planned render modes** may appear in the UI as planned; do not install or stub-implement those frameworks until their milestone.
- **Synthetic data only.** Never employer / customer / proprietary data.
- Prefer small modules and explicit boundaries over premature abstraction.

## Validation

```bash
pnpm install
pnpm check          # lint + typecheck + unit tests + build
pnpm test           # unit tests
pnpm test:e2e       # Playwright
pnpm dev            # apps/web
```

Definition of done for a change: `pnpm check` green; e2e green if UI behavior changed; no secrets; lockfile committed when deps change.

## Design & roadmap pointers

| Doc | Purpose |
| --- | --- |
| [docs/design/m1-foundation.md](docs/design/m1-foundation.md) | M1 vertical-slice design captured from the bootstrap spec |
| [docs/architecture/overview.md](docs/architecture/overview.md) | Problem, layers, control spectrum |
| [docs/architecture/packages.md](docs/architecture/packages.md) | Workspace ownership |
| [docs/architecture/representations.md](docs/architecture/representations.md) | Adapter pattern + modes |
| [docs/architecture/ui-contract.md](docs/architecture/ui-contract.md) | Controlled vocabulary + stable IDs |
| [docs/architecture/observability.md](docs/architecture/observability.md) | Events and honest timing |
| [docs/architecture/protocols.md](docs/architecture/protocols.md) | Why AG-UI / A2UI / json-render / OpenUI / MCP Apps / assistant-ui differ |
| [docs/experiments/telemetry-001.md](docs/experiments/telemetry-001.md) | First experiment |
| [README.md](README.md) | Public roadmap M1–M7 |

## Agent skills

### Issue tracker

GitHub Issues on [Ensive/genui-lab](https://github.com/Ensive/genui-lab) via `gh`. See [docs/agents/issue-tracker.md](docs/agents/issue-tracker.md).

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See [docs/agents/triage-labels.md](docs/agents/triage-labels.md).

### Domain docs

Single-context: root [GLOSSARY.md](GLOSSARY.md) + [docs/adr/](docs/adr/). See [docs/agents/domain.md](docs/agents/domain.md).
