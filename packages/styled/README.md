# @framingui/styled

styled-components helpers for token-aware FramingUI usage.

Use this package when your app already relies on `styled-components` and you want FramingUI token access in that styling model.

## Install

```bash
pnpm add @framingui/styled styled-components
```

## Example

```ts
import { styled, tokens } from '@framingui/styled';

export const Panel = styled.div`
  background: ${tokens.bg.surface.elevated};
  padding: ${tokens.spacing[6]};
  border-radius: ${tokens.radius.lg};
`;
```

## License

MIT
