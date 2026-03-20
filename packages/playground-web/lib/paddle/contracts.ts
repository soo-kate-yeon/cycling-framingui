import type { LicenseTier } from '@/lib/db/types';

export type PaddlePurchaseKind = 'legacy_template' | 'plan' | 'top_up';
export type PaddleBillingModel = 'template_license' | 'quota';
export type QuotaPlanId = 'developer' | 'team' | 'enterprise';

export interface PaddleCheckoutCustomData {
  user_id: string;
  purchase_kind: PaddlePurchaseKind;
  billing_model: PaddleBillingModel;
  tier?: LicenseTier;
  theme_id?: string;
  plan_id?: QuotaPlanId;
  top_up_units?: number;
}

export function buildLegacyTemplateCheckoutData(options: {
  userId: string;
  tier: LicenseTier;
  themeId?: string;
}): PaddleCheckoutCustomData {
  return {
    user_id: options.userId,
    purchase_kind: 'legacy_template',
    billing_model: 'template_license',
    tier: options.tier,
    ...(options.themeId ? { theme_id: options.themeId } : {}),
  };
}

export function buildQuotaPlanCheckoutData(options: {
  userId: string;
  planId: QuotaPlanId;
}): PaddleCheckoutCustomData {
  return {
    user_id: options.userId,
    purchase_kind: 'plan',
    billing_model: 'quota',
    plan_id: options.planId,
  };
}

export function buildQuotaTopUpCheckoutData(options: {
  userId: string;
  topUpUnits: number;
}): PaddleCheckoutCustomData {
  return {
    user_id: options.userId,
    purchase_kind: 'top_up',
    billing_model: 'quota',
    top_up_units: options.topUpUnits,
  };
}

function isQuotaPlanId(value: unknown): value is QuotaPlanId {
  return value === 'developer' || value === 'team' || value === 'enterprise';
}

function isLicenseTier(value: unknown): value is LicenseTier {
  return value === 'single' || value === 'double' || value === 'creator';
}

function isPurchaseKind(value: unknown): value is PaddlePurchaseKind {
  return value === 'legacy_template' || value === 'plan' || value === 'top_up';
}

function isBillingModel(value: unknown): value is PaddleBillingModel {
  return value === 'template_license' || value === 'quota';
}

export function parsePaddleCustomData(customData: unknown): PaddleCheckoutCustomData | null {
  if (!customData || typeof customData !== 'object') {
    return null;
  }

  const data = customData as Record<string, unknown>;
  const userId = data.user_id;
  if (typeof userId !== 'string' || !userId.trim()) {
    return null;
  }

  const purchaseKind = isPurchaseKind(data.purchase_kind) ? data.purchase_kind : undefined;
  const billingModel = isBillingModel(data.billing_model) ? data.billing_model : undefined;
  const tier = isLicenseTier(data.tier) ? data.tier : undefined;
  const planId = isQuotaPlanId(data.plan_id) ? data.plan_id : undefined;
  const topUpUnits =
    typeof data.top_up_units === 'number' && Number.isFinite(data.top_up_units)
      ? data.top_up_units
      : undefined;
  const themeId = typeof data.theme_id === 'string' ? data.theme_id.trim() || undefined : undefined;

  return {
    user_id: userId.trim(),
    purchase_kind:
      purchaseKind ??
      (tier ? 'legacy_template' : planId ? 'plan' : topUpUnits ? 'top_up' : 'legacy_template'),
    billing_model: billingModel ?? (planId || topUpUnits ? 'quota' : 'template_license'),
    ...(tier ? { tier } : {}),
    ...(themeId ? { theme_id: themeId } : {}),
    ...(planId ? { plan_id: planId } : {}),
    ...(topUpUnits ? { top_up_units: topUpUnits } : {}),
  };
}
