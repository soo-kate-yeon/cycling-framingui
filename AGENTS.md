# FramingUI Agent Contract

This file defines the default operating rules for coding agents working in this repository.

## Scope

- Repository: FramingUI monorepo
- Package manager: `pnpm`
- Node version: `>=20`
- Primary packages:
  - `packages/core`
  - `packages/ui`
  - `packages/tokens`
  - `packages/mcp-server`
  - `packages/playground-web`

## Core Principles

- Follow SPEC-first development. Do not start implementation for non-trivial work until the relevant SPEC exists in `.moai/specs/` or the task explicitly states that no SPEC is needed.
- Prefer TDD for behavior changes: write or update tests first, implement the minimum change, then refactor with tests still green.
- Keep changes scoped. Prefer package-local fixes over cross-repo edits unless the task requires a public API or shared token change.
- Preserve existing behavior unless the SPEC or issue explicitly changes it.
- Use worktree-based isolation for substantial feature work when available.

## Planning Rules

- For substantial work, start by identifying:
  - target SPEC or missing SPEC
  - affected packages
  - validation commands
  - documentation impact
- If the task is ambiguous, clarify requirements before implementation.
- If a task is large enough to need phased delivery, break it into plan, run, and sync stages.

## Implementation Rules

- Use `pnpm` commands from the repository root unless package-local execution is more precise.
- Prefer existing package boundaries and exports. Do not introduce duplicate abstractions that overlap with `@framingui/core`, `@framingui/ui`, or `@framingui/tokens`.
- When changing public APIs, update the relevant README, docs, or generated references in the same change when feasible.
- Never hardcode design values when a FramingUI token, theme value, or component prop already exists.
- For UI work, prefer `@framingui/ui` primitives and templates over custom primitives.

## UI Workflow Rules

For any new screen, major UI addition, or structural UI refactor:

1. Use the `framingui` MCP server configured in `.mcp.json`.
2. Discover available building blocks before writing JSX:
   - `list-components`
   - `preview-component`
   - `list_tokens`
   - `list-screen-templates` or equivalent template discovery tools when relevant
3. For screen-level work, prefer this sequence:
   - discover components and layout tokens
   - generate a blueprint
   - validate the screen definition if applicable
   - export screen code
   - integrate the generated output into the target package
4. If custom UI is still required, explain why FramingUI primitives, templates, or tokens were insufficient.
5. Do not introduce raw styling values when token-backed values are available.

## Validation Gates

Run the smallest useful set of checks for the change, then expand when shared packages are affected.

Default repository checks:

- `pnpm build:all`
- `pnpm typecheck`
- `pnpm ci:test`

UI-specific checks:

- `pnpm test:a11y` for cross-package or app-level accessibility changes when feasible
- `pnpm --filter @framingui/ui test`
- `pnpm --filter @framingui/ui test:a11y`

Package-specific examples:

- `pnpm --filter @framingui/core test`
- `pnpm --filter @framingui/tokens test`
- `pnpm --filter @framingui/mcp-server test`

## Documentation Sync

Update docs when the change affects any of the following:

- public package API
- component behavior or props
- MCP tool behavior
- workflow or developer-facing commands
- SPEC completion state

Relevant locations include:

- `README.md`
- package-level `README.md`
- `docs/`
- `.moai/specs/`
- `.moai/reports/` when a sync report is required by the workflow

## Git and Delivery

- Do not push directly to `main`.
- Prefer issue- or SPEC-scoped branches.
- Keep commits scoped and reviewable.
- Summaries should state:
  - what changed
  - which packages were affected
  - which checks ran
  - any remaining risk or follow-up

## When In Doubt

- Prefer existing FramingUI systems over inventing parallel ones.
- Prefer documented SPEC and workflow rules over ad hoc reasoning.
- Prefer explicit validation over confidence.
