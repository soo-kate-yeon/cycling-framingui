import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

describe('@framingui/mcp-server package manifest', () => {
  it('declares zod as a runtime dependency', () => {
    expect(packageJson.dependencies?.zod).toBeDefined();
  });
});
