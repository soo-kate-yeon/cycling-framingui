import { describe, expect, it } from 'vitest';

import { getCliGuideText } from '../../src/cli/help.ts';

describe('cli help', () => {
  it('contains first-run onboarding guidance', () => {
    const guide = getCliGuideText();

    expect(guide).toContain('FramingUI MCP Server');
    expect(guide).toContain('framingui-mcp init');
    expect(guide).toContain('framingui-mcp login');
    expect(guide).toContain('framingui-mcp server');
  });
});
