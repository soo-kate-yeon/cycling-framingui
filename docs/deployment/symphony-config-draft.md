# Symphony Config Draft

This document describes the recommended first-pass Symphony setup for FramingUI.

## Source of Truth

The primary Symphony configuration lives in [`WORKFLOW.md`](/Users/sooyeon/Developer/framingui/WORKFLOW.md).

That file now contains:

- tracker configuration for Linear
- polling cadence
- workspace root indirection
- Codex command and timeouts
- state-based concurrency limits
- prompt rules for plan, run, sync, and UI routing

## Required Environment Variables

Set these before starting Symphony:

- `LINEAR_API_KEY`
- `LINEAR_PROJECT_SLUG`
- `SYMPHONY_WORKSPACE_ROOT`

Recommended example values:

```bash
export LINEAR_API_KEY="lin_api_xxx"
export LINEAR_PROJECT_SLUG="framingui"
export SYMPHONY_WORKSPACE_ROOT="$HOME/.symphony/workspaces/framingui"
```

## Recommended Runtime Shape

- Run Symphony with the repository root as the working directory.
- Let Symphony load `WORKFLOW.md` from the repo root.
- Keep workspaces outside the main checkout to avoid accidental overlap with local work.

## Recommended Initial Runtime Settings

Current draft values in `WORKFLOW.md`:

- Poll interval: `30000ms`
- Active states: `Agent Ready`, `Agent Fast Path`
- Terminal states: `Done`, `Closed`, `Cancelled`, `Canceled`, `Duplicate`
- Global concurrency: `3`
- State-specific concurrency:
  - `Agent Ready`: `2`
  - `Agent Fast Path`: `1`
- Codex command: `codex app-server`

These defaults bias toward safe early adoption.

## Why State-Specific Concurrency Matters

`Agent Fast Path` is intended for small changes. Keeping it at a lower concurrency reduces the chance that many tiny issues starve higher-value feature work or create noisy review churn.

## Suggested Startup Checklist

1. Install and authenticate Linear access for the host running Symphony.
2. Install and authenticate Codex on the same host.
3. Export the required environment variables.
4. Start Symphony from the repository root.
5. Verify that only issues in the configured active states are being picked up.

## Recommended Future Extensions

After the first rollout is stable, consider adding:

- an agent-facing tool for Linear comments and state transitions
- PR link posting from the agent
- a status surface or dashboard for active runs
- branch naming and workspace bootstrap hooks
