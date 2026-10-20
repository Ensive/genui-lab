# Design: M7 — Reliability / evals

**Status:** Planned.  
**GitHub:** [#15](https://github.com/Ensive/genui-lab/issues/15)  
**Depends on:** Multiple modes + optional model paths (M2.1 / M3 / M6).

## Goal

Make architecture differences **testable** at scale:

- Schema validity
- Semantic assertions on `TelemetryAnalysis` and representations
- UI stability tests (non-brittle)
- Catalog-size experiments
- Prompt injection tests (where models exist)
- Replay of recorded runs / streams
- Malformed stream recovery
- Model comparison (when multiple providers/models are wired)
- Accessibility evaluation

## Constraints

- Prefer deterministic fixtures for CI; gate flaky/model tests behind explicit flags
- Never invent quality scores — report measured pass/fail and honest timings
- Keep eval harness separate from product UI where possible

## Acceptance criteria

- [ ] Documented eval runner command(s) from repo root
- [ ] CI job for deterministic subset
- [ ] Optional nightly / manual job for model-backed evals
- [ ] Accessibility baseline automated where trivial; manual checklist documented
- [ ] Replay format documented and versioned

## Out of scope

Becoming a general LLM benchmark platform unrelated to GenUI architectures.
