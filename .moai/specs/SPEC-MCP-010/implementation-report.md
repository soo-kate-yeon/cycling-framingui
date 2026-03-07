# Implementation Report

## Summary

`@framingui/core` now carries an in-memory bundled theme catalog generated from `.moai/themes/generated`. Theme APIs continue to prefer filesystem overrides when present, but no longer collapse to an empty catalog in serverless runtimes where `.moai` and `dist/bundled` are unavailable.

## Changed

- Added `packages/core/scripts/generate-bundled-theme-module.mjs`
- Added generated module `packages/core/src/generated/bundled-themes.ts`
- Updated `packages/core/src/theme-v2.ts` to use filesystem-first, bundled-second fallback
- Added runtime fallback regressions in `packages/core/__tests__/theme-runtime-fallback.test.ts`

## Validation

- `pnpm --filter @framingui/core exec vitest run __tests__/theme-runtime-fallback.test.ts`
- `pnpm --filter @framingui/playground-web exec vitest run __tests__/api/mcp-verify-canonicalization.test.ts __tests__/api/mcp/themes-css.test.ts`
- `pnpm --filter @framingui/tokens build && pnpm --filter @framingui/core build && pnpm --filter @framingui/ui build && pnpm --filter @framingui/mcp-server build && pnpm --filter @framingui/playground-web build`

## Outcome

The MCP auth/theme routes can now derive canonical theme ids even when deployed serverless bundles cannot access `.moai` on disk.
