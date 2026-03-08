# @framingui/tokens

Token types and token references for FramingUI.

This package is for codebases and tools that want typed access to FramingUI token concepts without pulling in the full UI layer.

## Install

```bash
pnpm add @framingui/tokens
```

## Example

```ts
import type { TokenReference } from '@framingui/tokens';

const background: TokenReference = 'var(--framingui-bg-surface-default)';
```

## Use Cases

- token-aware utility libraries
- typed design-token references
- custom validation and build tooling

## License

MIT
