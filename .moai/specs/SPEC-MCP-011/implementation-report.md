# SPEC-MCP-011 Implementation Report

## Delivered

- Added a canonical slash command registry under `packages/mcp-server/src/commands/slash-command-registry.ts`.
- Added command adapter renderers for:
  - `json`
  - `markdown`
  - `text`
- Added client-oriented adapter metadata for:
  - Codex
  - Claude Code
  - Cursor
- Added new MCP prompts:
  - `responsive-workflow`
  - `a11y-workflow`
  - `theme-swap-workflow`
  - `doctor-workflow`
  - `slash-commands`
  - `command-help`
  - `update-workflow`
- Centralized prompt registration through `packages/mcp-server/src/prompts/prompt-catalog.ts`.
- Added CLI commands:
  - `help`
  - `guide`
  - `commands`
  - `update`
  - `server`
- Updated default CLI startup behavior:
  - interactive TTY: print onboarding guide
  - non-interactive stdio: start MCP server
- Added `/update` to the command catalog and wired it to package-manager aware update planning.
- Synced MCP docs and README for prompts, adapter export, and CLI maintenance flows.

## Validation

- `pnpm --filter @framingui/mcp-server build`
- `pnpm --filter @framingui/mcp-server exec vitest run __tests__/commands/slash-command-registry.test.ts __tests__/commands/slash-command-adapters.test.ts __tests__/prompts/prompt-catalog.test.ts __tests__/cli/help.test.ts __tests__/cli/update.test.ts`
- `node packages/mcp-server/dist/cli/index.js help`
- `node packages/mcp-server/dist/cli/index.js commands --client codex --format json`
- `node packages/mcp-server/dist/cli/index.js commands --client claude-code --command /update --format text`
- `node packages/mcp-server/dist/cli/index.js commands --client cursor --command /responsive --format markdown`

## Remaining Risk

- Client-specific adapter output is now available, but no external client repository has yet been updated to consume it directly.
- Full `pnpm --filter @framingui/mcp-server test` remains noisy and partially unstable due to older network-dependent and stdio timeout tests unrelated to this SPEC.
