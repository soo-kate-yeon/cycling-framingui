import { readFileSync } from 'fs';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearAuthData, setAuthData } from '../../src/auth/state.js';
import { whoamiTool } from '../../src/tools/whoami.js';
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

const TRANSITION_ACCESS_FIXTURE = {
  ...AUTH_FIXTURE,
  quotaEntitlement: {
    planId: 'developer',
    status: 'active',
    includedUnits: 2000,
    currentPeriodStart: '2026-04-01T00:00:00.000Z',
    currentPeriodEnd: '2026-05-01T00:00:00.000Z',
    totalAllocatedUnits: 3000,
    topUpAllocatedUnits: 1000,
  },
  licenses: [
    ...AUTH_FIXTURE.licenses,
    {
      themeId: 'trial-all-access',
      tier: 'pro',
      type: 'trial' as const,
      isActive: true,
      expiresAt: '2099-12-31T00:00:00.000Z',
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
    expect(text).toContain('Shadow quota usage snapshot');
    expect(text).toContain('theme access and account-scoped quota visibility will be unavailable');
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

  it('returns transition access fields while preserving legacy trial aliases', async () => {
    setAuthData(TRANSITION_ACCESS_FIXTURE);

    const result = await whoamiTool();

    expect(result.success).toBe(true);
    expect(result.has_transition_access).toBe(true);
    expect(result.access_expires_at).toBe('2099-12-31T00:00:00.000Z');
    expect(result.access_days_left).toBeTypeOf('number');
    expect(result.access_days_left).toBeGreaterThan(0);
    expect(result.is_trial).toBe(true);
    expect(result.trial_expires_at).toBe(result.access_expires_at);
    expect(result.trial_days_left).toBe(result.access_days_left);
    expect(result.paid_quota_entitlement).toEqual(TRANSITION_ACCESS_FIXTURE.quotaEntitlement);
  });
});
