# ADR-0002 — Fixture-first before model integration

## Status

Accepted

## Context

LLM-backed UI generation mixes at least two sources of variance:

1. renderer / representation behavior
2. model nondeterminism (sampling, latency, schema drift, cost)

If both land in the first commit, failures are hard to attribute and demos require API keys.

## Decision

The first commit uses deterministic synthetic telemetry and deterministic representations (Markdown + tool-bound UI).

No model provider integration is required for the core vertical slice.

## Consequences

Positive:

- reproducible unit and e2e tests
- no API key required
- reliable screenshots/demos
- honest baseline timing for domain + representation work
- easier future evaluation when models are introduced

Trade-offs:

- M1 does not yet exercise streaming model output or prompt injection surfaces
- representation adapters for LLM-native formats arrive later

## Alternatives rejected

1. Shipping a chatbot-first demo that regenerates Markdown via an LLM.
2. Mocking model responses with invented token/cost metrics.
