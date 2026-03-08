# @framingui/ui

React components for FramingUI.

Use this package when you want FramingUI components directly in an app, whether you install them manually or through `@framingui/mcp-server init`.

## Install

```bash
pnpm add @framingui/ui
```

Import the shared styles when your app uses the FramingUI-native style contract:

```tsx
import '@framingui/ui/styles';
```

## Basic Usage

```tsx
import '@framingui/ui/styles';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@framingui/ui';

export function SignupCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent>
        <Input type="email" placeholder="Email" />
        <Button>Create account</Button>
      </CardContent>
    </Card>
  );
}
```

## What You Get

- core components such as `Button`, `Input`, `Card`, `Badge`, `Avatar`, and `Select`
- complex components such as `Dialog`, `Tabs`, `Table`, and `Popover`
- advanced components such as `Sidebar`, `NavigationMenu`, and `Calendar`
- styles designed to work with FramingUI themes and MCP workflows

## MCP Guidance

If you are using FramingUI through MCP, do not guess component APIs.
Use:

- `list-components`
- `preview-component`
- `validate-environment`

## Docs

- [framingui.com/docs/components](https://framingui.com/docs/components)
- [framingui.com/docs/themes](https://framingui.com/docs/themes)

## License

MIT
