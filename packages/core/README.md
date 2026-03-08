# @framingui/core

Core theme, token, and screen-generation utilities for FramingUI.

Use this package when you need the lower-level building blocks behind the MCP workflow or want to integrate FramingUI data structures into custom tooling.

## Install

```bash
pnpm add @framingui/core
```

## Example

```ts
import { loadTheme } from '@framingui/core';

const theme = loadTheme('minimal-workspace');
console.log(theme.id);
```

## Use Cases

- loading FramingUI themes and tokens
- resolving screen definitions
- building internal tools on top of FramingUI contracts
- sharing the same theme and layout primitives used by `@framingui/mcp-server`

## Recommended Path

If your goal is to build production UI with an AI agent, start with `@framingui/mcp-server` rather than using `@framingui/core` directly.

## Docs

- [framingui.com/docs/api/core](https://framingui.com/docs/api/core)
- [framingui.com/docs/layout](https://framingui.com/docs/layout)

## License

MIT
