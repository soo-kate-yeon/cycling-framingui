# Acceptance

## TASK-001

- A project-context detection tool exists.
- The tool can detect `web`, `expo`, and `react-native` from a project path.
- The response includes `platform`, `runtime`, and `packageManager`.

## TASK-002

- `get-screen-generation-context` uses detected session defaults when `platform` is omitted.
- `list-components` uses detected session defaults when `platform` is omitted.
- `preview-component` uses detected session defaults when `platform` is omitted.
- Explicit platform inputs override detected defaults.
- No-session behavior remains backward compatible.

## TASK-003

- Generated guidance recommends project-context detection when a project path is available.
- RN/Expo guidance no longer depends on repeated manual platform flags.
- README and bootstrap guidance describe the new detection-first path.

## Final Acceptance

- All task-level validations pass.
- `pnpm --filter @framingui/mcp-server test` passes.
- `pnpm --filter @framingui/mcp-server typecheck` passes.
- `pnpm --filter @framingui/mcp-server build` passes.
