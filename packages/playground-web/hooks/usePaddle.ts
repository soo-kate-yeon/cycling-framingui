/**
 * usePaddle Hook
 * SPEC-DEPLOY-001 Phase 3: Paddle Checkout 초기화 및 열기
 *
 * WHY: @paddle/paddle-js 공식 패턴으로 Paddle.js를 초기화하고 checkout overlay 제공
 * IMPACT: PricingCard에서 Buy Now 클릭 시 Paddle Checkout Overlay 표시
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { initializePaddle, type Paddle, type PaddleEventData } from '@paddle/paddle-js';
import { PADDLE_CONFIG, isPaymentsEnabled } from '@/lib/paddle/config';
import { getPaddleCheckoutErrorMessage } from '@/lib/paddle/errors';
import { buildCheckoutSuccessUrl } from '@/lib/paddle/urls';
import type { LicenseTier } from '@/lib/db/types';
import {
  buildLegacyTemplateCheckoutData,
  buildQuotaPlanCheckoutData,
  buildQuotaTopUpCheckoutData,
  type QuotaPlanId,
} from '@/lib/paddle/contracts';

type LegacyCheckoutParams = {
  priceId: string;
  userId: string;
  userEmail?: string | null;
  successPath?: string;
  purchaseKind: 'legacy_template';
  tier: LicenseTier;
  themeId?: string;
};

type QuotaPlanCheckoutParams = {
  priceId: string;
  userId: string;
  userEmail?: string | null;
  successPath?: string;
  purchaseKind: 'plan';
  planId: QuotaPlanId;
};

type QuotaTopUpCheckoutParams = {
  priceId: string;
  userId: string;
  userEmail?: string | null;
  successPath?: string;
  purchaseKind: 'top_up';
  topUpUnits: number;
};

export type OpenCheckoutParams =
  | LegacyCheckoutParams
  | QuotaPlanCheckoutParams
  | QuotaTopUpCheckoutParams;

export function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notReadyReason, setNotReadyReason] = useState<string | null>(null);

  useEffect(() => {
    // Feature flag: 명시적으로 비활성화된 경우만 중단
    if (!isPaymentsEnabled()) {
      setNotReadyReason('Payments are disabled by NEXT_PUBLIC_ENABLE_PAYMENTS.');
      setIsLoading(false);
      return;
    }

    const isLocalHost =
      typeof window !== 'undefined' &&
      ['localhost', '127.0.0.1', '::1', '[::1]'].includes(window.location.hostname);

    if (isLocalHost && PADDLE_CONFIG.environment === 'production') {
      setNotReadyReason(
        'Paddle live checkout is blocked on local hosts. Use sandbox locally or run on an allowed domain.'
      );
      setIsLoading(false);
      return;
    }

    if (!PADDLE_CONFIG.clientToken) {
      console.warn('[Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN이 설정되지 않았습니다');
      setNotReadyReason('NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is missing.');
      setIsLoading(false);
      return;
    }

    initializePaddle({
      environment: PADDLE_CONFIG.environment,
      token: PADDLE_CONFIG.clientToken,
      checkout: {
        settings: {
          successUrl: buildCheckoutSuccessUrl(window.location.origin),
        },
      },
      // checkout-service 400 등 Paddle 내부 오류 관측을 위해 이벤트를 남긴다.
      eventCallback: (event: PaddleEventData) => {
        if (event?.name === 'checkout.error') {
          console.error('[Paddle] checkout.error event:', event);

          const message = getPaddleCheckoutErrorMessage(event);
          if (message) {
            setNotReadyReason(message);
            window.alert(message);
          }
        }
      },
    })
      .then((paddleInstance) => {
        if (paddleInstance) {
          setPaddle(paddleInstance);
        }
      })
      .catch((error) => {
        console.error('[Paddle] 초기화 실패:', error);
        setNotReadyReason(error instanceof Error ? error.message : 'Paddle initialization failed.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openCheckout = useCallback(
    (params: OpenCheckoutParams) => {
      if (!paddle) {
        console.error('[Paddle] Paddle이 초기화되지 않았습니다');
        return;
      }

      const trimmedEmail = params.userEmail?.trim();

      const customData =
        params.purchaseKind === 'legacy_template'
          ? buildLegacyTemplateCheckoutData({
              userId: params.userId,
              tier: params.tier,
              themeId: params.themeId?.trim(),
            })
          : params.purchaseKind === 'plan'
            ? buildQuotaPlanCheckoutData({
                userId: params.userId,
                planId: params.planId,
              })
            : buildQuotaTopUpCheckoutData({
                userId: params.userId,
                topUpUnits: params.topUpUnits,
              });

      // NOTE:
      // - 빈 email/theme_id를 전달하면 Paddle checkout-service에서 400이 발생할 수 있어
      //   유효한 값만 조건부로 포함한다.
      const checkoutOptions: Parameters<typeof paddle.Checkout.open>[0] = {
        items: [{ priceId: params.priceId, quantity: 1 }],
        customData: customData as unknown as Record<string, unknown>,
        ...(trimmedEmail ? { customer: { email: trimmedEmail } } : {}),
        settings: {
          // 결제 완료 후 사용자가 앱으로 복귀할 수 있도록 명시
          successUrl: buildCheckoutSuccessUrl(window.location.origin, params.successPath),
        },
      };

      try {
        paddle.Checkout.open(checkoutOptions);
      } catch (error) {
        console.error('[Paddle] Checkout.open failed:', {
          purchaseKind: params.purchaseKind,
          priceId: params.priceId,
          hasEmail: Boolean(trimmedEmail),
          hasThemeId:
            params.purchaseKind === 'legacy_template' ? Boolean(params.themeId?.trim()) : false,
          error,
        });
      }
    },
    [paddle]
  );

  return {
    paddle,
    isLoading,
    isReady: !!paddle,
    notReadyReason,
    openCheckout,
  };
}
