# Quick Start

Get FramingUI into a project quickly.

## Recommended Setup

```bash
npx -y @framingui/mcp-server@latest init
npx -y @framingui/mcp-server@latest login
```

`init` can:

- install FramingUI UI dependencies
- configure Tailwind content paths and `tailwindcss-animate`
- add `@import '@framingui/ui/styles';` when using the FramingUI-native contract
- create `.mcp.json`
- generate `FRAMINGUI-GUIDE.md`
- update `CLAUDE.md` and `AGENTS.md`

## Manual MCP Config

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

## First Production Workflow

1. `preview-theme` when theme defaults matter
2. `get-screen-generation-context`
3. `preview-component` for ambiguous components
4. `list-icon-libraries` before adding icons
5. `validate-screen-definition`
6. write React code directly from the validated definition
7. `validate-environment` with `sourceFiles` when a project path is known

## Style Contract Rule

Choose one before relying on component defaults:

- `host-utility`
- `framingui-native`
- `migrate`

If you use `framingui-native`, make sure your global stylesheet imports:

```css
@import '@framingui/ui/styles';
```
