import { readFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearAuthData, setAuthData } from '../../src/auth/state.ts';
import { whoamiTool } from '../../src/tools/whoami.ts';
import { getGettingStartedPrompt } from '../../src/prompts/getting-started.ts';

const AUTH_FIXTURE = {
  valid: true,
  user: {
    id: 'user-phase0',
    email: 'phase0@example.com',
    plan: 'pro',
  },
  themes: {
    licensed: ['pebble'],
  },
  licenses: [
    {
      themeId: 'pebble',
      tier: 'pro',
      type: 'individual' as const,
      isActive: true,
      expiresAt: '2026-12-31T00:00:00.000Z',
    },
  ],
};

describe('Phase 0 baseline: auth bootstrap', () => {
  beforeEach(() => {
    clearAuthData();
  });

  afterEach(() => {
    clearAuthData();
  });

  it('removes the server-side requireWhoami gate from the MCP entrypoint', () => {
    const source = readFileSync(join(process.cwd(), 'src/index.ts'), 'utf8');

    expect(source).not.toContain('requireWhoami()');
    expect(source).not.toContain('WhoamiRequiredError');
  });

  it('describes whoami as optional session inspection in the getting-started prompt', () => {
    const prompt = getGettingStartedPrompt();
    const text = prompt.messages[0]?.content.type === 'text' ? prompt.messages[0].content.text : '';

    expect(text).toContain('Recommended Session Check');
    expect(text).toContain('no longer a required first step');
    expect(text).toContain('includeExamples: false');
    expect(text).toContain('Parsing MCP transcript text with shell/python/json tools');
    expect(text).not.toContain('MUST call the `whoami` tool before using any other tool');
  });

  it('still allows whoami to inspect the current session without unlocking any extra gate', async () => {
    setAuthData(AUTH_FIXTURE);

    const result = await whoamiTool();

    expect(result.success).toBe(true);
    expect(result.licensedThemes).toContain('pebble');
  });
});
