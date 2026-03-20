import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearAuthData, setAuthData } from '../../src/auth/state.js';
import {
  resetUsageLedger,
  recordToolUsage,
  getUsageQuotaSnapshot,
} from '../../src/billing/usage-ledger.js';
import { getToolMeteringRule } from '../../src/billing/tool-metering.js';

const AUTH_FIXTURE = {
  valid: true,
  user: {
    id: 'quota-user',
    email: 'quota-user@example.com',
    plan: 'free',
  },
  themes: {
    licensed: ['pebble'],
  },
  licenses: [
    {
      themeId: 'pebble',
      tier: 'free',
      type: 'trial' as const,
      isActive: true,
      expiresAt: '2026-12-31T00:00:00.000Z',
    },
  ],
};

describe('Phase 0 usage ledger', () => {
  beforeEach(() => {
    resetUsageLedger();
    clearAuthData();
  });

  afterEach(() => {
    resetUsageLedger();
    clearAuthData();
  });

  it('defines weighted units for low-cost and high-cost tool classes', () => {
    expect(getToolMeteringRule('list-components')).toMatchObject({
      billable: true,
      toolClass: 'discovery',
      units: 1,
    });
    expect(getToolMeteringRule('validate-environment')).toMatchObject({
      billable: true,
      toolClass: 'guarded',
      units: 6,
    });
    expect(getToolMeteringRule('export-screen')).toMatchObject({
      billable: true,
      toolClass: 'execution',
      units: 10,
    });
    expect(getToolMeteringRule('whoami')).toMatchObject({
      billable: false,
      units: 0,
    });
  });

  it('aggregates monthly usage into a shadow quota snapshot', () => {
    recordToolUsage({
      toolName: 'list-components',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'free',
      timestamp: new Date('2026-03-10T00:00:00.000Z'),
    });
    recordToolUsage({
      toolName: 'get-screen-generation-context',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'free',
      timestamp: new Date('2026-03-11T00:00:00.000Z'),
    });
    recordToolUsage({
      toolName: 'validate-screen-definition',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'free',
      timestamp: new Date('2026-03-12T00:00:00.000Z'),
    });

    const snapshot = getUsageQuotaSnapshot({
      userId: 'quota-user',
      plan: 'free',
      now: new Date('2026-03-15T00:00:00.000Z'),
    });

    expect(snapshot.billingPhase).toBe('shadow');
    expect(snapshot.unitModel).toBe('weighted_tool_units');
    expect(snapshot.monthlyIncludedUnits).toBe(100);
    expect(snapshot.usedUnits).toBe(9);
    expect(snapshot.remainingUnits).toBe(91);
    expect(snapshot.warningThresholds).toEqual([50, 80, 100]);
  });

  it('returns account-scoped quota snapshots for authenticated users', () => {
    setAuthData(AUTH_FIXTURE);

    recordToolUsage({
      toolName: 'list-components',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'free',
      timestamp: new Date('2026-03-10T00:00:00.000Z'),
    });
    recordToolUsage({
      toolName: 'preview-theme',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'free',
      timestamp: new Date(),
    });

    const snapshot = getUsageQuotaSnapshot({
      userId: AUTH_FIXTURE.user.id,
      plan: AUTH_FIXTURE.user.plan,
    });

    expect(snapshot.enabled).toBe(true);
    expect(snapshot.billingPhase).toBe('shadow');
    expect(snapshot.usedUnits).toBe(3);
    expect(snapshot.remainingUnits).toBe(97);
  });

  it('prefers active paid quota entitlement limits and billing periods over plan defaults', () => {
    recordToolUsage({
      toolName: 'validate-screen-definition',
      outcome: 'success',
      userId: 'quota-user',
      plan: 'pro',
      timestamp: new Date('2026-04-02T00:00:00.000Z'),
    });

    const snapshot = getUsageQuotaSnapshot({
      userId: 'quota-user',
      plan: 'pro',
      paidQuotaEntitlement: {
        planId: 'developer',
        status: 'active',
        includedUnits: 2000,
        currentPeriodStart: '2026-04-01T00:00:00.000Z',
        currentPeriodEnd: '2026-05-01T00:00:00.000Z',
        totalAllocatedUnits: 3000,
        topUpAllocatedUnits: 1000,
      },
      now: new Date('2026-04-10T00:00:00.000Z'),
    });

    expect(snapshot.monthlyIncludedUnits).toBe(3000);
    expect(snapshot.usedUnits).toBe(6);
    expect(snapshot.remainingUnits).toBe(2994);
    expect(snapshot.currentPeriodStart).toBe('2026-04-01T00:00:00.000Z');
    expect(snapshot.currentPeriodEnd).toBe('2026-05-01T00:00:00.000Z');
  });
});
