# Acceptance

## TASK-001

- `packages/react-native` exists and is wired into the workspace.
- The package has a valid exports map, build command, and test command.
- The package can be built independently.

## TASK-002

- The package exposes typed token consumption helpers.
- The helper surface is based on `@framingui/tokens`.
- Helper tests pass.

## TASK-003

- The package exposes generic RN primitives.
- The primitives are token-backed and `StyleSheet.create`-friendly.
- The package does not introduce web-only runtime dependencies.

## TASK-004

- RN documentation references the runtime package where appropriate.
- MCP guidance clearly distinguishes runtime package support from code generation.
- Package usage guidance exists in docs or README form.

## Final Acceptance

- All task-level validations pass.
- `pnpm --filter @framingui/react-native test` passes.
- `pnpm --filter @framingui/react-native build` passes.
- `pnpm --filter @framingui/mcp-server test` passes.
- `pnpm --filter @framingui/mcp-server typecheck` passes.

## Validation Record

- TASK-001 validation passed:
  - `pnpm --filter @framingui/react-native build`
  - `pnpm --filter @framingui/react-native test`
- TASK-002 validation passed:
  - `pnpm --filter @framingui/react-native build`
  - `pnpm --filter @framingui/react-native test`
- TASK-003 validation passed:
  - `pnpm --filter @framingui/react-native build`
  - `pnpm --filter @framingui/react-native test`
