# @framingui/mcp-server

MCP server for building production UI through FramingUI.

`@framingui/mcp-server` gives AI coding agents a real UI contract: components, themes, layout tokens, templates, validation, and environment checks.

## Install

Use the CLI without a local install:

```bash
npx -y @framingui/mcp-server@latest
```

Recommended project setup:

```bash
npx -y @framingui/mcp-server@latest init
```

Authenticate:

```bash
npx -y @framingui/mcp-server@latest login
```

## CLI Commands

```bash
npx -y @framingui/mcp-server@latest init
npx -y @framingui/mcp-server@latest login
npx -y @framingui/mcp-server@latest logout
npx -y @framingui/mcp-server@latest status
npx -y @framingui/mcp-server@latest
```

## MCP Config

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

## Production Screen Workflow

Use the guarded workflow for production work:

1. `preview-theme` when theme recipes or defaults matter
2. `get-screen-generation-context`
3. `preview-component` for component ambiguity
4. `list-icon-libraries` before adding icons
5. `validate-screen-definition`
6. write React code directly from the validated definition
7. `validate-environment` with `sourceFiles` for dependency, style-contract, and code-audit checks

### Style Contract Rule

Choose one contract before relying on FramingUI defaults:

- `host-utility`: keep explicit utility styling
- `framingui-native`: import `@framingui/ui/styles`, mount `FramingUIProvider`, and use the generated `framingui-theme`
- `migrate`: stop and decide the migration path first

## Slash Commands

FramingUI exposes guidance for:

- `/screen`
- `/draft`
- `/section`
- `/responsive`
- `/a11y`
- `/theme-swap`
- `/doctor`
- `/install-check`
- `/export`
- `/update`

## Main MCP Tools

### Discovery

- `list-themes`
- `preview-theme`
- `list-components`
- `preview-component`
- `list-screen-templates`
- `preview-screen-template`
- `list_tokens`
- `list-icon-libraries`
- `preview-icon-library`

### Production Workflow

- `get-screen-generation-context`
- `validate-screen-definition`
- `validate-environment`
- `generate_screen` (optional helper)

### Legacy Helpers

- `generate-blueprint`
- `export-screen`
- `validate_screen`

## What `init` Updates

`init` can:

- install the FramingUI screen-generation runtime and peer dependencies in one pass
- configure Tailwind content paths and `tailwindcss-animate`
- add `@import '@framingui/ui/styles';` to a detected global stylesheet
- generate a local `framingui-theme` module
- wire `FramingUIProvider` into `app/layout.tsx` or `src/main.tsx`
- verify the package install, Tailwind config, and stylesheet import before finishing
- create `.mcp.json`
- generate `FRAMINGUI-GUIDE.md`
- append FramingUI sections to `CLAUDE.md` and `AGENTS.md`

## Package Docs

- [docs/README.md](./docs/README.md)
- [docs/01-quickstart.md](./docs/01-quickstart.md)
- [docs/02-user-guide.md](./docs/02-user-guide.md)
- [docs/03-api-reference.md](./docs/03-api-reference.md)
- [docs/04-architecture.md](./docs/04-architecture.md)
- [docs/05-developer-guide.md](./docs/05-developer-guide.md)
- [docs/06-integration-guide.md](./docs/06-integration-guide.md)

## License

MIT
