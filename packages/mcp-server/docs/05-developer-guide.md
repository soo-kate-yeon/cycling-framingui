# Developer Guide

Use this guide when changing `@framingui/mcp-server` itself.

## Local Setup

```bash
pnpm install
pnpm --filter @framingui/mcp-server build
pnpm --filter @framingui/mcp-server test
pnpm --filter @framingui/mcp-server typecheck
```

## Important Areas

- `src/index.ts`: tool and prompt registration
- `src/tools/`: MCP tool implementations
- `src/prompts/`: prompt contracts used by slash-command help and onboarding
- `src/cli/`: install, auth, and generated markdown templates
- `src/schemas/`: Zod schemas for MCP inputs and outputs

## Rules

- keep slash-command metadata aligned with the prompt contract
- keep docs aligned with the current production workflow
- prefer guarded direct-write workflows over legacy blueprint flows
- treat templates as hints and components as the real contract

## Release Notes

Before release, verify:

- package version and changelog
- lockfile sync
- publish integrity check
- public docs and package README changes when tool behavior changes
