# Acceptance

## PR Gate

- `pnpm ci:mcp:pr` exists and passes locally.
- `quality-gate.yml` includes an MCP-specific job that runs on pull requests.
- MCP-specific regressions in theme authority, screen contract parity, generation quality, or CSS variable contract fail the PR lane.

## Nightly Lane

- `ci:mcp:nightly` exists.
- `e2e-tests.yml` no longer runs as a required PR workflow.
- `e2e-tests.yml` no longer runs on every push to `main`/`master`.
- `e2e-tests.yml` runs on schedule or manual dispatch and executes browser E2E against the built app.
- The nightly smoke lane asserts route health, visible primary content, and CSS/runtime sanity without depending on fragile copy or exact card counts.

## Known Deferred

- No fixture-based pristine/existing-CSS project matrix yet.
- No visual diff or screenshot assertion for generated MCP screens yet.
