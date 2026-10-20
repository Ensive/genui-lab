# Design: M6 — Intelligent representation routing

**Status:** Planned.  
**GitHub:** [#14](https://github.com/Ensive/genui-lab/issues/14)  
**Depends on:** Multiple working representation modes (M1 + M3 at minimum).

## Goal

Choose **how** to present the same intent/task using bounded strategies:

```text
rules → semantic routing → bounded decision model → general LLM
```

Candidate representations (examples from founding thesis):

```text
prose | table | chart | timeline | form | dashboard | workspace
```

Mapped onto GenUI Lab modes available at that time (Markdown, Tool UI, declarative stacks, etc.).

## Measurements

| Metric | Notes |
| --- | --- |
| Selection accuracy | Vs labeled fixture scenarios |
| Confidence calibration | When the router exposes confidence |
| Latency | Honest end-to-end |
| Cost | Only when real provider billing is available |
| Task success | Human or scripted task completion |

## Constraints

- Router must not bypass authoritative domain state
- Offline/rules path should remain usable without API keys
- Log decisions into inspector / lab metrics for comparison

## Acceptance criteria

- [ ] At least rules + one model-backed strategy implemented
- [ ] Fixture scenarios with expected representation choices
- [ ] Eval sheet or tests for accuracy on fixtures
- [ ] Documented failure modes (ambiguous intent, unavailable mode)

## Out of scope

Full adversarial eval suite (M7) beyond routing-specific tests.
