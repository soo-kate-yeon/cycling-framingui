# Core Examples

Use these examples as contributor-level reference points.

## Theme Loading

```ts
import { loadTheme } from '@framingui/core';

const theme = loadTheme('minimal-workspace');
```

## Screen Validation

```ts
import { validateScreenDefinition } from '@framingui/core';

const result = validateScreenDefinition(definition);
```

## Screen Resolution

```ts
import { resolveScreen } from '@framingui/core';

const resolved = await resolveScreen(definition);
```

## Code Generation

```ts
import { generateReactComponent } from '@framingui/core';

const output = generateReactComponent(resolved, { format: 'typescript' });
```

## Note

For production agent workflows, prefer `@framingui/mcp-server` over direct manual assembly.
