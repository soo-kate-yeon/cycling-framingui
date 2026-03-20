/**
 * Paddle 결제 설정
 * SPEC-DEPLOY-001 Phase 3: Paddle 결제 연동
 *
 * WHY: 모든 Paddle 관련 설정을 한 곳에서 관리하여 Sandbox/Production 전환 용이
 * IMPACT: 환경변수만 변경하면 결제 환경 전환 가능
 */

const legacyPrices = {
  single: process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE!,
  double: process.env.NEXT_PUBLIC_PADDLE_PRICE_DOUBLE!,
  creator: process.env.NEXT_PUBLIC_PADDLE_PRICE_CREATOR!,
} as const;

const quotaPrices = {
  developerMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_DEVELOPER_MONTHLY ?? '',
  developerYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_DEVELOPER_YEARLY ?? '',
  teamMonthly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_MONTHLY ?? '',
  teamYearly: process.env.NEXT_PUBLIC_PADDLE_PRICE_TEAM_YEARLY ?? '',
  topUp1000: process.env.NEXT_PUBLIC_PADDLE_PRICE_TOPUP_1000 ?? '',
} as const;

export const PADDLE_CONFIG = {
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT ?? 'sandbox') as
    | 'sandbox'
    | 'production',
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  legacyPrices,
  quotaPrices,
  // Backward-compatible alias while legacy template flows remain active.
  prices: legacyPrices,
} as const;

export type PaddlePriceTier = keyof typeof PADDLE_CONFIG.prices;
export type LegacyPaddlePriceTier = keyof typeof PADDLE_CONFIG.legacyPrices;
export type QuotaPaddlePriceKey = keyof typeof PADDLE_CONFIG.quotaPrices;

export type ResolvedPaddlePriceTarget =
  | {
      purchaseKind: 'legacy_template';
      billingModel: 'template_license';
      legacyTier: LegacyPaddlePriceTier;
    }
  | {
      purchaseKind: 'plan';
      billingModel: 'quota';
      planId: 'developer' | 'team';
    }
  | {
      purchaseKind: 'top_up';
      billingModel: 'quota';
      topUpUnits: number;
    };

/**
 * 결제 기능 활성화 여부
 * - 명시적으로 false/0/off 일 때만 비활성화
 * - 미설정 시 Paddle 설정이 있으면 동작하도록 기본 허용
 */
export function isPaymentsEnabled(): boolean {
  const rawFlag = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS?.trim().toLowerCase();
  return rawFlag !== 'false' && rawFlag !== '0' && rawFlag !== 'off';
}

/**
 * PricingTier 문자열을 Paddle Price tier로 매핑
 */
export function toPaddlePriceTier(tier: string): PaddlePriceTier | null {
  const mapping: Record<string, PaddlePriceTier> = {
    Single: 'single',
    'Legacy Single Access': 'single',
    Double: 'double',
    'Legacy Double Access': 'double',
    'Creator Pass': 'creator',
    'Legacy All Access': 'creator',
  };
  return mapping[tier] ?? null;
}

export function resolvePaddlePriceTarget(priceId: string): ResolvedPaddlePriceTarget | null {
  if (priceId === legacyPrices.single) {
    return {
      purchaseKind: 'legacy_template',
      billingModel: 'template_license',
      legacyTier: 'single',
    };
  }
  if (priceId === legacyPrices.double) {
    return {
      purchaseKind: 'legacy_template',
      billingModel: 'template_license',
      legacyTier: 'double',
    };
  }
  if (priceId === legacyPrices.creator) {
    return {
      purchaseKind: 'legacy_template',
      billingModel: 'template_license',
      legacyTier: 'creator',
    };
  }
  if (quotaPrices.developerMonthly && priceId === quotaPrices.developerMonthly) {
    return {
      purchaseKind: 'plan',
      billingModel: 'quota',
      planId: 'developer',
    };
  }
  if (quotaPrices.teamMonthly && priceId === quotaPrices.teamMonthly) {
    return {
      purchaseKind: 'plan',
      billingModel: 'quota',
      planId: 'team',
    };
  }
  if (quotaPrices.topUp1000 && priceId === quotaPrices.topUp1000) {
    return {
      purchaseKind: 'top_up',
      billingModel: 'quota',
      topUpUnits: 1000,
    };
  }

  return null;
}
