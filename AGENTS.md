# GenUI Lab — agent notes

Experimental research lab for generative, agentic, and intelligent user interfaces.

Core loop: deterministic domain analysis → representation adapter → renderer → inspector.

Read `docs/architecture/overview.md` and `docs/adr/` before changing architectural boundaries.
Prefer synthetic fixtures; do not require API keys for core experiments.

## Agent skills

### Issue tracker

GitHub Issues on [Ensive/genui-lab](https://github.com/Ensive/genui-lab) via `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-role vocabulary (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
