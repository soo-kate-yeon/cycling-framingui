# E2E Follow-up

Date: 2026-03-09
Owner: repository maintainers

## Current State

- CI E2E now runs a smoke-only Playwright suite against `@framingui/playground-web`.
- Smoke coverage is intentionally limited to routes that do not require Supabase admin access or manual OAuth steps.
- Supabase-backed integration tests remain in the repository, but they auto-skip when the required test environment variables are not present.

## Intentional Deferrals

The following work is intentionally deferred for now:

1. unify root Playwright config and `packages/playground-web/playwright.config.ts`
2. split CI workflows into separate `smoke` and `integration` jobs
3. replace real Supabase admin dependencies with mocks or isolated test infrastructure
4. move manual OAuth scenarios out of the default E2E suite

## Why Deferred

- The current app is still small enough that smoke coverage gives acceptable signal.
- Adding a second CI workflow and test infrastructure would increase maintenance cost faster than product value right now.
- The immediate goal was to make E2E deterministic enough for routine CI use, not to finish long-term test architecture.

## Revisit Trigger

Revisit this follow-up when one of these becomes true:

- CI smoke coverage stops catching meaningful regressions
- the playground gains more authenticated user flows
- Supabase-backed flows become part of the release gate
- Playwright maintenance overhead starts showing up repeatedly in PRs

## Recommended Next Step When Revisited

1. keep `e2e-smoke` as the default PR gate
2. add `e2e-integration` behind real test secrets
3. classify tests by tags instead of mixing smoke, manual, and integration cases in the same default suite
