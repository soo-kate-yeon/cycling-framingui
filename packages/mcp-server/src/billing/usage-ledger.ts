import { getToolMeteringRule, type ToolMeteringClass } from './tool-metering.js';

export type UsageOutcome =
  | 'success'
  | 'tool_error'
  | 'validation_error'
  | 'auth_error'
  | 'runtime_error';

export type BillingPlan = 'free' | 'pro' | 'enterprise' | 'master';

export interface UsageLedgerEntry {
  id: string;
  timestamp: string;
  toolName: string;
  toolClass: ToolMeteringClass;
  billable: boolean;
  units: number;
  outcome: UsageOutcome;
  userId: string | null;
  plan: BillingPlan | null;
}

export interface UsageQuotaSnapshot {
  enabled: boolean;
  billingPhase: 'shadow';
  unitModel: 'weighted_tool_units';
  monthlyIncludedUnits: number | null;
  usedUnits: number;
  remainingUnits: number | null;
  usagePercent: number | null;
  warningThresholds: number[];
  warningsTriggered: number[];
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface PaidQuotaEntitlementSnapshot {
  planId: string;
  status: string;
  includedUnits: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  totalAllocatedUnits: number;
  topUpAllocatedUnits: number;
}

const PLAN_MONTHLY_QUOTAS: Record<BillingPlan, number | null> = {
  free: 100,
  pro: 2_000,
  enterprise: 10_000,
  master: null,
};

interface FraminguiUsageLedgerState {
  usageLedger: UsageLedgerEntry[];
  sequence: number;
}

declare global {
  var __framinguiUsageLedgerState: FraminguiUsageLedgerState | undefined;
}

function getUsageLedgerState(): FraminguiUsageLedgerState {
  globalThis.__framinguiUsageLedgerState ??= {
    usageLedger: [],
    sequence: 0,
  };

  return globalThis.__framinguiUsageLedgerState;
}

function getCurrentPeriod(now: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  return { start, end };
}

export function recordToolUsage(options: {
  toolName: string;
  outcome: UsageOutcome;
  userId?: string | null;
  plan?: string | null;
  timestamp?: Date;
}): UsageLedgerEntry {
  const state = getUsageLedgerState();
  const timestamp = options.timestamp ?? new Date();
  const rule = getToolMeteringRule(options.toolName);
  const normalizedPlan = normalizeBillingPlan(options.plan);

  state.sequence += 1;

  const entry: UsageLedgerEntry = {
    id: `usage-${state.sequence}`,
    timestamp: timestamp.toISOString(),
    toolName: options.toolName,
    toolClass: rule.toolClass,
    billable: rule.billable,
    units: rule.billable ? rule.units : 0,
    outcome: options.outcome,
    userId: options.userId ?? null,
    plan: normalizedPlan,
  };

  state.usageLedger.push(entry);
  return entry;
}

export function listUsageEntries(): UsageLedgerEntry[] {
  return [...getUsageLedgerState().usageLedger];
}

export function resetUsageLedger(): void {
  const state = getUsageLedgerState();
  state.usageLedger.length = 0;
  state.sequence = 0;
}

export function normalizeBillingPlan(plan: string | null | undefined): BillingPlan | null {
  if (plan === 'free' || plan === 'pro' || plan === 'enterprise' || plan === 'master') {
    return plan;
  }
  return null;
}

export function getUsageQuotaSnapshot(options: {
  userId?: string | null;
  plan?: string | null;
  paidQuotaEntitlement?: PaidQuotaEntitlementSnapshot | null;
  now?: Date;
}): UsageQuotaSnapshot {
  const state = getUsageLedgerState();
  const now = options.now ?? new Date();
  const entitlementPeriod =
    options.paidQuotaEntitlement?.currentPeriodStart &&
    options.paidQuotaEntitlement?.currentPeriodEnd
      ? {
          start: new Date(options.paidQuotaEntitlement.currentPeriodStart),
          end: new Date(options.paidQuotaEntitlement.currentPeriodEnd),
        }
      : null;
  const period = entitlementPeriod ?? getCurrentPeriod(now);
  const normalizedPlan = normalizeBillingPlan(options.plan) ?? 'free';
  const monthlyIncludedUnits =
    options.paidQuotaEntitlement?.status === 'active'
      ? options.paidQuotaEntitlement.includedUnits +
        options.paidQuotaEntitlement.topUpAllocatedUnits
      : PLAN_MONTHLY_QUOTAS[normalizedPlan];

  const usedUnits = state.usageLedger
    .filter(entry => {
      if (!entry.billable) {
        return false;
      }
      if (options.userId && entry.userId !== options.userId) {
        return false;
      }
      const entryTime = new Date(entry.timestamp);
      return entryTime >= period.start && entryTime < period.end;
    })
    .reduce((sum, entry) => sum + entry.units, 0);

  const remainingUnits =
    monthlyIncludedUnits === null ? null : Math.max(0, monthlyIncludedUnits - usedUnits);
  const usagePercent =
    monthlyIncludedUnits === null || monthlyIncludedUnits === 0
      ? null
      : Math.min(100, Math.round((usedUnits / monthlyIncludedUnits) * 100));

  const warningThresholds = [50, 80, 100];
  const warningsTriggered =
    usagePercent === null ? [] : warningThresholds.filter(threshold => usagePercent >= threshold);

  return {
    enabled: true,
    billingPhase: 'shadow',
    unitModel: 'weighted_tool_units',
    monthlyIncludedUnits,
    usedUnits,
    remainingUnits,
    usagePercent,
    warningThresholds,
    warningsTriggered,
    currentPeriodStart: period.start.toISOString(),
    currentPeriodEnd: period.end.toISOString(),
  };
}
