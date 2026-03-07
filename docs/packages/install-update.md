# FramingUI Install And Update Guide

This page is the shortest safe path for installing or updating FramingUI packages in a consumer project.

## Install

Install only the packages you actually use.

### React UI

```bash
pnpm add @framingui/ui @framingui/core @framingui/tokens
```

### MCP Server

Run without installing:

```bash
npx @framingui/mcp-server
```

Or install into a project:

```bash
pnpm add -D @framingui/mcp-server
```

### Styled Components

```bash
pnpm add @framingui/styled @framingui/tokens styled-components
```

## Update

Update the FramingUI packages you use in one command:

```bash
pnpm up @framingui/core @framingui/ui @framingui/mcp-server @framingui/tokens @framingui/styled @framingui/esbuild-plugin --latest
```

If your project only uses a subset, update only that subset.

Examples:

```bash
pnpm up @framingui/ui @framingui/core @framingui/tokens --latest
pnpm up @framingui/mcp-server @framingui/ui @framingui/core --latest
```

## After Updating

Run your normal verification steps:

```bash
pnpm install
pnpm build
pnpm test
```

If the project uses TypeScript or linting:

```bash
pnpm typecheck
pnpm lint
```

## Common Confusions

### Why does `pnpm` only show one FramingUI package in warnings?

`pnpm` usually prints only the dependency path that has the warning. It does not print every package that updated successfully.

Example:

```text
@framingui/mcp-server
  -> @framingui/ui
    -> unmet peer ...
```

This does not mean only `@framingui/mcp-server` was updated. It means the warning was found on that path.

### `npx @framingui/mcp-server` still looks old after update

Check the published version first:

```bash
npm view @framingui/mcp-server version
```

Then force `npx` to use the latest package:

```bash
npx -y @framingui/mcp-server@latest
```

If you installed it globally before, update the global install too:

```bash
npm install -g @framingui/mcp-server@latest
```

### I use Claude Code with `.mcp.json`

Use the explicit latest tag in the server entry when debugging updates:

```json
{
  "mcpServers": {
    "framingui": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@framingui/mcp-server@latest"]
    }
  }
}
```

This removes ambiguity when a machine has old caches or an older global install.

If you rerun `framingui-mcp init` in a project that already has a `framingui` MCP entry, the current CLI now rewrites that entry to the canonical latest form above instead of leaving an older pinned version behind.

### How do I check the installed CLI version?

```bash
framingui-mcp --version
```

## Package Roles

- `@framingui/tokens`: token types and shared token contract
- `@framingui/core`: theme, blueprint, and generation pipeline
- `@framingui/ui`: React components and templates
- `@framingui/styled`: styled-components integration
- `@framingui/mcp-server`: MCP server for AI tools
- `@framingui/esbuild-plugin`: build-time token checks
