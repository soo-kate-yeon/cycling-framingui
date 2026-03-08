# FramingUI

Production UI through an MCP-installed design system.

FramingUI is a design system for AI-assisted product teams. Instead of asking an agent to invent UI from scratch, you install FramingUI as an MCP server and give the agent a real component catalog, theme system, layout tokens, and validated screen workflow.

The goal is simple: use MCP to build production UI with stronger contracts, fewer hallucinated components, and clearer integration steps.

## What FramingUI Includes

- `@framingui/mcp-server`: MCP server for discovery, screen workflows, validation, and project setup
- `@framingui/ui`: React UI components and styles
- `@framingui/core`: theme, token, and screen-generation utilities
- `@framingui/tokens`: token types and references
- `@framingui/styled`: token-aware styled-components helpers
- `@framingui/esbuild-plugin`: build-time token compliance checks

## Recommended Start

Install the MCP server in your project and let it wire up the design system:

```bash
npx -y @framingui/mcp-server@latest init
```

Then authenticate:

```bash
npx @framingui/mcp-server@latest login
```

This setup flow can:

- install `@framingui/ui`
- configure Tailwind content paths and `tailwindcss-animate`
- add `@import '@framingui/ui/styles';` when using the FramingUI-native style contract
- register the MCP server in `.mcp.json`
- generate project guidance for `FRAMINGUI-GUIDE.md`, `CLAUDE.md`, and `AGENTS.md`

## MCP Workflow

The production screen workflow is component-first and validation-first:

1. `preview-theme` when theme recipes or defaults matter
2. `get-screen-generation-context`
3. `preview-component` for any ambiguous component contract
4. `list-icon-libraries` before introducing icons
5. `validate-screen-definition`
6. write React code directly from the validated definition
7. `validate-environment` for dependency, style-contract, and code-audit checks

FramingUI also provides slash-command guidance for common actions such as:

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

## Example MCP Config

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

## Package Usage

Install packages directly when you need them without the guided MCP setup:

```bash
pnpm add @framingui/ui @framingui/core
```

```tsx
import '@framingui/ui/styles';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@framingui/ui';

export function ExampleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ship product UI</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Open workflow</Button>
      </CardContent>
    </Card>
  );
}
```

## Documentation

- GitHub package docs: `packages/*/README.md`
- MCP server docs: `packages/mcp-server/docs`
- Product docs: [framingui.com/docs](https://framingui.com/docs)

## Status

FramingUI is actively evolving around:

- MCP-native UI generation
- guarded direct-write workflows
- theme-aware component discovery
- production integration checks

## License

MIT
