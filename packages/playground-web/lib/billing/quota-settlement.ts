import type { ResolvedPaddlePriceTarget } from '@/lib/paddle/config';
import type { PaddleCheckoutCustomData, QuotaPlanId } from '@/lib/paddle/contracts';

const PLAN_INCLUDED_UNITS: Partial<Record<QuotaPlanId, number>> = {
  developer: 2000,
  team: 10000,
};

interface SubscriptionPeriodPayload {
  currentBillingPeriod?: {
    startsAt?: string | null;
    endsAt?: string | null;
  } | null;
  current_billing_period?: {
    starts_at?: string | null;
    ends_at?: string | null;
  } | null;
}

export interface QuotaSettlementPreview {
  source: 'paddle_transaction';
  transactionId: string;
  userId: string;
  purchaseKind: 'plan' | 'top_up';
  planId?: QuotaPlanId;
  grantedUnits: number;
}

export function getQuotaPlanIncludedUnits(planId: QuotaPlanId): number | null {
  return PLAN_INCLUDED_UNITS[planId] ?? null;
}

export function extractSubscriptionPeriod(payload: SubscriptionPeriodPayload): {
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
} {
  const camel = payload.currentBillingPeriod;
  if (camel) {
    return {
      currentPeriodStart: camel.startsAt ?? null,
      currentPeriodEnd: camel.endsAt ?? null,
    };
  }

  const snake = payload.current_billing_period;
  return {
    currentPeriodStart: snake?.starts_at ?? null,
    currentPeriodEnd: snake?.ends_at ?? null,
  };
}

export function buildQuotaSettlementPreview(options: {
  transactionId: string;
  customData: PaddleCheckoutCustomData;
  priceTarget: ResolvedPaddlePriceTarget | null;
}): QuotaSettlementPreview | null {
  const { transactionId, customData, priceTarget } = options;

  if (customData.purchase_kind === 'plan') {
    const planId =
      customData.plan_id ?? (priceTarget?.purchaseKind === 'plan' ? priceTarget.planId : undefined);
    const grantedUnits = planId ? getQuotaPlanIncludedUnits(planId) : undefined;

    if (!planId || !grantedUnits) {
      return null;
    }

    return {
      source: 'paddle_transaction',
      transactionId,
      userId: customData.user_id,
      purchaseKind: 'plan',
      planId,
      grantedUnits,
    };
  }

  if (customData.purchase_kind === 'top_up') {
    const grantedUnits =
      customData.top_up_units ??
      (priceTarget?.purchaseKind === 'top_up' ? priceTarget.topUpUnits : undefined);

    if (!grantedUnits || grantedUnits <= 0) {
      return null;
    }

    return {
      source: 'paddle_transaction',
      transactionId,
      userId: customData.user_id,
      purchaseKind: 'top_up',
      grantedUnits,
    };
  }

  return null;
}
