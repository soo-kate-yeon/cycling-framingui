import { describe, expect, it } from 'vitest';
import { evaluateQuotaPolicy, getQuotaEnforcementMode } from '../../src/billing/quota-policy.js';

describe('quota policy', () => {
  it('returns shadow mode by default', () => {
    delete process.env.FRAMINGUI_QUOTA_ENFORCEMENT;
    expect(getQuotaEnforcementMode()).toBe('shadow');
  });

  it('allows billable tools in soft cap mode but returns a warning after quota is exceeded', () => {
    process.env.FRAMINGUI_QUOTA_ENFORCEMENT = 'soft_cap';

    const decision = evaluateQuotaPolicy({
      toolName: 'validate-screen-definition',
      snapshot: {
        enabled: true,
        billingPhase: 'shadow',
        unitModel: 'weighted_tool_units',
        monthlyIncludedUnits: 10,
        usedUnits: 8,
        remainingUnits: 2,
        usagePercent: 80,
        warningThresholds: [50, 80, 100],
        warningsTriggered: [50, 80],
        currentPeriodStart: '2026-04-01T00:00:00.000Z',
        currentPeriodEnd: '2026-05-01T00:00:00.000Z',
      },
    });

    expect(decision.allowed).toBe(true);
    expect(decision.warning).toContain('soft cap');
  });

  it('blocks billable tools in hard cap mode when projected usage exceeds quota', () => {
    process.env.FRAMINGUI_QUOTA_ENFORCEMENT = 'hard_cap';

    const decision = evaluateQuotaPolicy({
      toolName: 'validate-screen-definition',
      snapshot: {
        enabled: true,
        billingPhase: 'shadow',
        unitModel: 'weighted_tool_units',
        monthlyIncludedUnits: 10,
        usedUnits: 8,
        remainingUnits: 2,
        usagePercent: 80,
        warningThresholds: [50, 80, 100],
        warningsTriggered: [50, 80],
        currentPeriodStart: '2026-04-01T00:00:00.000Z',
        currentPeriodEnd: '2026-05-01T00:00:00.000Z',
      },
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe('quota_exceeded');
  });
});
