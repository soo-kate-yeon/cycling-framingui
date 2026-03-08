# Integration Guide

Use this guide when integrating FramingUI into an app or MCP client.

## MCP Client Setup

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

## Project Setup

Recommended:

```bash
npx -y @framingui/mcp-server@latest init
```

## Integration Checklist

- authenticate with `login`
- confirm the target style contract
- import `@framingui/ui/styles` for FramingUI-native apps
- verify Tailwind content paths and `tailwindcss-animate`
- use the validated screen workflow before writing production code

## Client Behavior

A client integration should:

- expose slash-command help when possible
- call discovery tools when ambiguity remains
- avoid claiming that a component is unavailable without checking the catalog
- treat templates as hints
- use `validate-environment` before final delivery when project context is available
