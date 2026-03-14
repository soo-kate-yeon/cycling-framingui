# @framingui/ui

React components for FramingUI.

Use this package when you want FramingUI components directly in an app, whether you install them manually or through `@framingui/mcp-server init`.

## Install

```bash
pnpm add @framingui/ui
```

Import the shared styles once at the app root when your app uses the FramingUI-native style contract:

```css
/* app/globals.css */
@import '@framingui/ui/styles';
```

Then mount `FramingUIProvider` near your root layout. Pass a full theme object when you want FramingUI to inject the CSS variables for you.

```tsx
import {
  FramingUIProvider,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@framingui/ui';
import theme from './neutral-workspace.json';

export function App() {
  return (
    <FramingUIProvider theme={theme}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="email" placeholder="Email" />
          <Button>Create account</Button>
        </CardContent>
      </Card>
    </FramingUIProvider>
  );
}
```

If your app already loads theme CSS separately, you can use the provider just to keep `data-theme` in sync:

```tsx
import { FramingUIProvider } from '@framingui/ui';

export function App() {
  return <FramingUIProvider themeId="neutral-workspace">{/* app */}</FramingUIProvider>;
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
