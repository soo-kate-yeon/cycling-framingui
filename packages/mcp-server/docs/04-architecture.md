# Architecture

`@framingui/mcp-server` is a stdio MCP server with three main surfaces:

- CLI commands such as `init`, `login`, and `status`
- MCP tools for discovery, validation, and generation
- MCP prompts for guided workflows

## Runtime Model

### CLI

Handles:

- `init`
- `login`
- `logout`
- `status`
- stdio server startup

### MCP Server

Registers tools and prompts and routes tool calls through input validation and auth checks.

### Auth Layer

Resolves credentials from `framingui-mcp login` or `FRAMINGUI_API_KEY`.

## Current Screen Architecture

The production path is no longer “prompt -> codegen only”.

It is:

1. style-contract decision
2. discovery (`preview-theme`, `preview-component`, icon inspection when needed)
3. context gathering (`get-screen-generation-context`)
4. structure validation (`validate-screen-definition`)
5. direct code writing from the validated definition
6. environment and source-file validation (`validate-environment`)

## Installed Project Artifacts

`init` may create or update:

- `.mcp.json`
- `FRAMINGUI-GUIDE.md`
- `CLAUDE.md`
- `AGENTS.md`
- global stylesheet imports for `@framingui/ui/styles`
- Tailwind content paths and plugins
