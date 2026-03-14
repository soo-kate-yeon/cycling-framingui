---
id: SPEC-RN-002
document: acceptance
version: "1.0.0"
created: "2026-03-14"
updated: "2026-03-14"
author: Codex
---

# SPEC-RN-002: Acceptance Criteria

## TASK-001

- theme values are resolved at runtime rather than read only from fixed constants
- `ThemeProvider` and `useTheme` exist and are covered by tests
- existing RN primitives consume theme-derived values

## TASK-002

- layout tokens cover more than raw spacing primitives
- layout helpers express screen inset, section rhythm, and width decisions
- token-backed layout tests pass

## TASK-003

- higher-level layout primitives exist and compile
- auth-like and settings-like screen structures can be composed without app-local shells
- primitives remain theme-aware and layout-token-aware

## TASK-004

- the core interaction and form surface exists
- disabled, invalid, selected, and focused states are test-covered
- the package can express common forms without app-local wrappers

## TASK-005

- the package reaches the planned 80/20 component surface
- list/detail, settings, and paywall-style composition is possible from package exports
- data and overlay components have explicit usage guidance

## TASK-006

- MCP discovery points at the RN runtime where exports exist
- MCP context/guidance matches the expanded runtime surface
- validation catches token, layout, and web-only drift

## Final Acceptance

- all task-level validation gates pass
- task issues record their validation results before closure
- the RN parity roadmap is traceable through a GitHub umbrella issue and child issues
- `pnpm --filter @framingui/react-native test` passes
- `pnpm --filter @framingui/react-native build` passes
- `pnpm --filter @framingui/mcp-server test` passes
- `pnpm --filter @framingui/mcp-server typecheck` passes

## Validation Record

- TASK-001 validation: passed
  - `pnpm --filter @framingui/react-native test -- theme-runtime`
  - `pnpm --filter @framingui/react-native build`
- TASK-002 validation: passed
  - `pnpm --filter @framingui/react-native test -- layout`
  - `pnpm --filter @framingui/react-native build`
- TASK-003 validation: passed
  - `pnpm --filter @framingui/react-native test -- primitives-layout`
  - `pnpm --filter @framingui/react-native build`
- TASK-004 validation: passed
  - `pnpm --filter @framingui/react-native test -- core-surface`
  - `pnpm --filter @framingui/react-native build`
- TASK-005 validation: passed
  - `pnpm --filter @framingui/react-native test -- data-surface`
  - `pnpm --filter @framingui/react-native build`
- TASK-006 validation: passed
  - `pnpm --filter @framingui/mcp-server test`
  - `pnpm --filter @framingui/mcp-server typecheck`
  - `pnpm --filter @framingui/react-native test`
  - `pnpm --filter @framingui/react-native build`
- Final acceptance validation: passed
  - `pnpm --filter @framingui/mcp-server test`
  - `pnpm --filter @framingui/mcp-server typecheck`
  - `pnpm --filter @framingui/react-native test`
  - `pnpm --filter @framingui/react-native build`
