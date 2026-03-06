---
tracker:
  kind: linear
  api_key: $LINEAR_API_KEY
  project_slug: $LINEAR_PROJECT_SLUG
  active_states:
    - Agent Ready
    - Agent Fast Path
  terminal_states:
    - Done
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
polling:
  interval_ms: 30000
workspace:
  root: $SYMPHONY_WORKSPACE_ROOT
hooks:
  timeout_ms: 60000
agent:
  max_concurrent_agents: 3
  max_turns: 12
  max_retry_backoff_ms: 300000
  max_concurrent_agents_by_state:
    agent ready: 2
    agent fast path: 1
codex:
  command: codex app-server
  turn_timeout_ms: 3600000
  read_timeout_ms: 5000
  stall_timeout_ms: 300000
---

# FramingUI Symphony Workflow

This file defines how Symphony should run Codex against the FramingUI repository.

## Objective

Execute issue-driven development in isolated workspaces while preserving the repository's existing MoAI-style workflow:

- SPEC-first planning
- TDD-oriented implementation
- explicit validation gates
- documentation sync after implementation
- FramingUI-first UI generation

## Execution Model

Each substantial task should move through three stages:

1. Plan
2. Run
3. Sync

Small fixes may skip the formal plan stage only when the task is clearly scoped, low risk, and does not need a new SPEC.

## Tracker-Controlled Routing

Use Linear state and label metadata to decide how the run should behave.

Recommended control signals:

- State `Agent Ready`: full plan, run, and sync flow
- State `Agent Fast Path`: skip formal planning unless the issue expands during execution
- Label `agent:ui`: apply FramingUI MCP-first UI workflow
- Label `agent:spec-required`: force SPEC-first handling even if the issue looks small
- Label `agent:docs`: prioritize documentation sync in the final output
- Label `agent:mcp`: treat MCP server behavior as an affected surface

If a task starts in `Agent Fast Path` but turns out to need architecture work, shared API changes, or a new SPEC, stop the fast path and move it back to a human planning state instead of improvising.

## Workspace Strategy

- Prefer one isolated git worktree per issue or SPEC.
- Use existing Tekton worktree commands when available:
  - `tekton worktree new <SPEC-ID> "<description>"`
  - `tekton worktree status <SPEC-ID>`
  - `tekton worktree sync <SPEC-ID>`
  - `tekton worktree clean --merged-only`
- Keep all build, test, and git operations scoped to the active workspace.

## Stage 1: Plan

Use the highest-capability model available for planning.

Inputs:

- issue description
- existing SPECs in `.moai/specs/`
- repository rules from `AGENTS.md`
- current package layout

Required outputs:

- target SPEC ID, or a statement that a SPEC is not required
- affected packages
- implementation outline
- validation plan
- documentation sync requirements

Rules:

- For non-trivial work, create or update a SPEC before coding.
- Prefer EARS-style requirements for new SPEC content.
- If the task changes architecture, shared APIs, tokens, or MCP behavior, treat it as SPEC-required.
- If the issue is in `Agent Fast Path` and does not carry `agent:spec-required`, the plan stage may be reduced to a short execution note instead of a full SPEC update.

## Stage 2: Run

Use a mid-tier model for implementation by default. Escalate to a stronger model only for blocked debugging, architectural ambiguity, or repeated failure.

Run stage expectations:

- implement against the approved SPEC or plan
- follow TDD where practical
- keep changes minimal and package-aware
- run validation before declaring completion
- if the issue came from `Agent Fast Path`, optimize for the narrowest viable change and minimal verification set before expanding

Implementation order:

1. read the target package and existing tests
2. add or update failing tests when behavior changes
3. implement the minimum code change
4. refactor only with tests green
5. run required validation gates

## Stage 3: Sync

Use a stronger model when needed for review quality, docs synchronization, or release-facing summaries.

Required sync work:

- update affected docs
- update SPEC status when appropriate
- produce a concise change summary
- record verification results
- prepare PR-ready notes when the environment supports it
- move the issue to a handoff state such as `Human Review` or `Done` using agent tools when the workflow permits it

## Validation Policy

The run is not complete until required checks pass or the failure is explicitly reported.

Default checks:

- `pnpm build:all`
- `pnpm typecheck`
- `pnpm ci:test`

Additional checks by change type:

- UI or accessibility change:
  - `pnpm test:a11y`
  - `pnpm --filter @framingui/ui test`
  - `pnpm --filter @framingui/ui test:a11y`
- Core token or generation change:
  - `pnpm --filter @framingui/core test`
  - `pnpm --filter @framingui/tokens test`
- MCP server change:
  - `pnpm --filter @framingui/mcp-server test`

If a full-repo check is too expensive for an exploratory run, start with the narrowest package checks and expand before final delivery.

## UI Task Policy

For any new screen, major UI flow, or structural UI refactor, Codex must use FramingUI-first generation.

Required procedure:

1. Use the `framingui` MCP server from `.mcp.json`.
2. Discover available components and tokens before authoring code:
   - `list-components`
   - `preview-component`
   - `list_tokens`
   - template discovery tools when applicable
3. For screen-level work, use a procedural flow:
   - generate or inspect the blueprint
   - validate the screen definition if supported
   - export screen code
   - integrate the output into the application or package
4. Prefer `@framingui/ui` components and templates over custom JSX structures.
5. If custom UI is necessary, document why FramingUI primitives or templates were not sufficient.
6. When the issue carries label `agent:ui`, treat this UI policy as mandatory even if the requested change looks small.

## Tooling Policy

- Use repository-local scripts and commands instead of ad hoc replacements when they exist.
- Respect `.mcp.json` as the source of truth for MCP server registration.
- Prefer local documentation and package READMEs before external assumptions.

## Stop Conditions

Pause and surface the issue instead of continuing blindly when any of the following is true:

- the task requires a new SPEC but requirements are too ambiguous
- the active workspace contains conflicting user changes
- required credentials or external services are unavailable
- validation fails in a way that suggests a broader regression

## Delivery Format

Each completed run should leave behind:

- code changes in the active branch or worktree
- updated tests where behavior changed
- updated docs when public behavior changed
- a summary containing:
  - affected packages
  - commands run
  - results
  - remaining risk
