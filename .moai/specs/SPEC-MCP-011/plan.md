---
id: SPEC-MCP-011
version: "1.0.0"
status: "in_progress"
created: "2026-03-11"
updated: "2026-03-11"
author: "Codex"
---

# Plan

## Phase 1

1. Add a dedicated PR command for MCP contract checks.
2. Wire that command into `quality-gate.yml`.
3. Split heavier browser E2E into a scheduled/manual lane.
4. Keep current smoke browser coverage, but stop requiring it on every PR.

## Phase 2

1. Add fixture-based pristine app runtime smoke.
2. Add fixture-based existing CSS runtime smoke.
3. Add generated-output compile checks inside those fixtures.

## Phase 3

1. Promote the most stable fixture checks into PR gating if runtime cost is acceptable.
2. Add artifact/reporting for pipeline failures with explicit stage labels.

