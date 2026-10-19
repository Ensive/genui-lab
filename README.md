# GenUI Lab

**An instrumented laboratory for generative, agentic, and intelligent user interfaces.**

GenUI Lab compares multiple ways an AI system can present the same task: prose, fixed tool UI, catalog-constrained generated UI, declarative UI protocols, sandboxed applications, and eventually intelligently selected representations.

> GenUI Lab does not ask which framework is “best.” It asks which architectural boundary and UI-generation strategy works best for a given interaction.

> The same task is executed through multiple UI architectures so control, latency, state behavior, safety, observability, and UX can be compared empirically.

> **Status:** experimental research project. Public APIs will evolve. Not a production chatbot framework.

## Why this exists

Most AI product demos collapse to:

```text
user → chat → LLM → Markdown
```

Useful — and incomplete. GenUI Lab makes architecture differences **observable, measurable, and testable** across a wider path:

```text
intent
  → intelligence / agent
  → tools + authoritative state
  → representation
  → renderer
  → interaction
  → updated state
```

## Architecture (concise)

```text
packages/domain          authoritative telemetry analysis
packages/fixtures        deterministic synthetic data
packages/ui-contract     controlled UI vocabulary + stable IDs
packages/experiment-core run lifecycle + representation adapters
packages/observability   events + honest timing metrics
apps/web                 React shell, renderers, inspector
```

```text
fixture → TelemetryAnalysis → RepresentationAdapter → Renderer → Inspector
```

Framework-specific systems (AG-UI, A2UI, json-render, OpenUI, assistant-ui, MCP Apps) enter through **adapters**, not a fake universal AST. See [docs/architecture/overview.md](docs/architecture/overview.md).

## What works today (M1)

- Deterministic synthetic automotive telemetry (`DEMO-001`)
- Normalized domain analysis with Zod validation
- **Markdown** representation (no LLM)
- **Tool-bound React UI** with metrics, alerts, time-series chart, sources
- Inspector: run metadata, domain JSON, representation payload, lifecycle events, timing
- Offline after `pnpm install` — **no API key required**

## Planned rendering modes

| Mode | Status |
| --- | --- |
| Markdown | Available |
| Tool UI | Available |
| Generative component tree | Planned |
| json-render | Planned |
| A2UI | Planned |
| OpenUI | Planned |
| MCP App | Planned |

## Quick start

Requirements: **Node.js 22+**, **pnpm 12**.

```bash
pnpm install
pnpm dev
```

Open the printed local URL (default `http://localhost:5173`).

```bash
pnpm check          # lint + typecheck + unit tests + build
pnpm test           # unit tests
pnpm test:e2e       # Playwright (install browsers on first run)
pnpm lint
pnpm typecheck
pnpm build
```

## Repository structure

```text
genui-lab/
├── AGENTS.md                 agent handoff notes
├── GLOSSARY.md               controlled vocabulary
├── apps/web/
├── packages/
│   ├── domain/
│   ├── ui-contract/
│   ├── experiment-core/
│   ├── fixtures/
│   └── observability/
├── docs/
│   ├── architecture/         layers, adapters, protocols, …
│   ├── design/               milestone design captures
│   ├── adr/
│   ├── agents/               issue/triage skill adapters
│   └── experiments/
├── .github/workflows/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Engineering principles

1. Authoritative domain state is deterministic.
2. Generated UI is a representation of state, not the source of truth.
3. Component schemas form a controlled UI vocabulary.
4. Stable component identities matter (`metric:battery-temp-max`, not array indexes).
5. Generated UI should be patchable rather than constantly regenerated.
6. Every representation should eventually be inspectable.
7. Every experiment should eventually be measurable.
8. Provider/framework-specific code lives behind adapters.
9. The core must work without an LLM or API key.
10. Synthetic data only — never employer/customer/proprietary data.

## First experiment

**Telemetry 001** — analyze vehicle telemetry for VIN `DEMO-001` and show when battery temperature left the normal band (28–42 °C). Fixture includes an obvious ~54–59 °C anomaly window.

Details: [docs/experiments/telemetry-001.md](docs/experiments/telemetry-001.md)

## Roadmap

| Milestone | Focus |
| --- | --- |
| **M1 — Foundation** | Fixtures, domain, Markdown, tool UI, inspector, events, tests *(complete on `main`)* |
| **M2 — AG-UI** | Agent lifecycle, state snapshot/delta, tool events, HITL — without conflating AG-UI with UI representation |
| **M3 — Declarative GenUI** | json-render, A2UI, OpenUI on the same task |
| **M4 — assistant-ui** | Compare shell value vs native tool UI / Spec Mode / AG-UI runtime |
| **M5 — MCP App** | Sandboxed telemetry explorer vs catalog UI |
| **M6 — Intelligent routing** | Rules / semantic / bounded / LLM selection of representation |
| **M7 — Reliability/evals** | Schema validity, UI stability, injection tests, replay, a11y |

## License

[MIT](LICENSE)
