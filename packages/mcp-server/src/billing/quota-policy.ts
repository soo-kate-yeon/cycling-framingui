import { getToolMeteringRule } from './tool-metering.js';
import type { UsageQuotaSnapshot } from './usage-ledger.js';

export type QuotaEnforcementMode = 'shadow' | 'soft_cap' | 'hard_cap';

export interface QuotaPolicyDecision {
  allowed: boolean;
  reason: 'ok' | 'quota_exceeded';
  warning?: string;
}

export function getQuotaEnforcementMode(): QuotaEnforcementMode {
  const raw = process.env.FRAMINGUI_QUOTA_ENFORCEMENT?.trim().toLowerCase();
  if (raw === 'soft_cap' || raw === 'hard_cap') {
    return raw;
  }
  return 'shadow';
}

export function evaluateQuotaPolicy(options: {
  toolName: string;
  snapshot: UsageQuotaSnapshot;
}): QuotaPolicyDecision {
  const rule = getToolMeteringRule(options.toolName);
  const mode = getQuotaEnforcementMode();

  if (mode === 'shadow' || !rule.billable || options.snapshot.monthlyIncludedUnits === null) {
    return { allowed: true, reason: 'ok' };
  }

  const projectedUnits = options.snapshot.usedUnits + rule.units;

  if (projectedUnits <= options.snapshot.monthlyIncludedUnits) {
    return { allowed: true, reason: 'ok' };
  }

  if (mode === 'soft_cap') {
    return {
      allowed: true,
      reason: 'ok',
      warning:
        'Projected usage exceeds the included quota in soft cap mode. This call is allowed, but additional usage would be billable in an enforced rollout.',
    };
  }

  return {
    allowed: false,
    reason: 'quota_exceeded',
    warning:
      'Projected usage exceeds the included quota and hard cap mode is enabled. Upgrade or add quota before retrying this tool.',
  };
}
