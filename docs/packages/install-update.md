# FramingUI Install And Update Guide

This page is the shortest safe path for installing or updating FramingUI packages in a consumer project.

## Install

Install only the packages you actually use.

### React UI

```bash
pnpm add @framingui/ui @framingui/core @framingui/tokens tailwindcss-animate
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

For app bootstrap, prefer:

```bash
npx -y @framingui/mcp-server@latest init
```

`init` is the recommended path because it wires the runtime contract, not just package install.

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

If the project uses the FramingUI-native contract, also verify:

- the global stylesheet imports `@framingui/ui/styles` exactly once
- the app root mounts `FramingUIProvider` exactly once
- a local `framingui-theme` module still exists
- `tailwindcss-animate` is installed

For Tailwind v4 projects, do not add manual `@source` entries for `@framingui/ui` unless you are debugging a package-level issue. The published `@framingui/ui/styles` import already carries the runtime scanning contract.

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

### Tailwind v4 project인데 버튼 패딩이나 Dialog 애니메이션이 이상합니다

먼저 설치가 아니라 런타임 계약부터 확인하세요.

- `globals.css`에 `@import '@framingui/ui/styles';`가 있는지
- 앱 루트에 `FramingUIProvider`가 정확히 한 번만 mount 되어 있는지
- `framingui-theme` 모듈을 provider에 전달하는지
- `tailwindcss-animate`가 설치되어 있는지

이 네 가지가 맞다면, 소비 앱에서 별도로 `@source "../../../node_modules/@framingui/ui/dist"`를 추가할 필요는 없습니다.

### Why does MCP now show different `licensedThemes` than old stored licenses?

`licensedThemes` is now the canonical current theme-id set exposed to MCP tools.

This matters because some older licenses were stored with placeholder ids such as `default` or all-access sentinels. The MCP APIs now normalize those stored values before returning access, so `list-themes`, `preview-theme`, and `whoami` stay in sync.

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
