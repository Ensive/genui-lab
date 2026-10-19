# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root (required vocabulary for this lab)
- **`docs/adr/`**: read ADRs that touch the area you're about to work in
- **`docs/architecture/overview.md`**: layer model and control spectrum for GenUI Lab
- **`docs/design/m1-foundation.md`**: M1 vertical-slice design intent
- **`AGENTS.md`**: current milestone, boundaries, and validation commands

If a referenced skill doc is missing in a fork, **proceed silently** rather than blocking exploration. Prefer extending `GLOSSARY.md` / ADRs via `/domain-modeling` when new terms or decisions are actually resolved.

## File structure

Single-context repo (this project — one product vocabulary across the pnpm workspace):

```
/
├── AGENTS.md
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-stable-core-framework-adapters.md
│   └── 0002-fixture-first-before-model-integration.md
├── docs/architecture/
├── docs/design/
├── docs/agents/
├── apps/
└── packages/
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (stable core, framework adapters), but worth reopening because…_
