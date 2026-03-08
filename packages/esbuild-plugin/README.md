# @framingui/esbuild-plugin

esbuild plugin for FramingUI token compliance checks.

Use this package when you want build-time enforcement against styling that escapes your token rules.

## Install

```bash
pnpm add -D @framingui/esbuild-plugin
```

## Example

```ts
import { build } from 'esbuild';
import { framinguiPlugin } from '@framingui/esbuild-plugin';

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  plugins: [framinguiPlugin()],
});
```

## License

MIT
