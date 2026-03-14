# @framingui/react-native

React Native runtime primitives and token consumption helpers for FramingUI.

This package is intentionally minimal in its first phase. It is designed to support Expo and React Native direct-write workflows with:

- typed token access
- `StyleSheet.create`-friendly helpers
- a small set of generic runtime primitives

Current exports:

- token helpers: `tokens`, `colors`, `spacing`, `radius`, `typography`, `shadows`
- styling helpers: `getTextStyle`, `getShadowStyle`, `pxToRem`
- primitives: `Button`, `TextField`, `InlineMessage`, `Screen`, `Stack`

Install:

```bash
pnpm add @framingui/react-native
```

Use helpers inside `StyleSheet.create`:

```tsx
import { StyleSheet } from 'react-native';
import { colors, getTextStyle, spacing } from '@framingui/react-native';

export const styles = StyleSheet.create({
  body: {
    color: colors.text.primary,
    ...getTextStyle('body'),
    padding: spacing[4],
  },
});
```

Use runtime primitives where the surface exists:

```tsx
import { Button, Screen, Stack, TextField } from '@framingui/react-native';

export function SignupScreen() {
  return (
    <Screen width="narrow">
      <Stack gap={4}>
        <TextField label="Email" placeholder="name@example.com" />
        <Button label="Continue" />
      </Stack>
    </Screen>
  );
}
```

This package is not intended to mirror `@framingui/ui` feature-for-feature.
