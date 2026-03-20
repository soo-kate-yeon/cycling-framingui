/**
 * Paddle Webhook Handler
 * SPEC-DEPLOY-001 Phase 3: Paddle 결제 웹훅 처리
 *
 * POST /api/webhooks/paddle
 *
 * WHY: Paddle 결제 완료/취소/환불 이벤트를 수신하여 라이선스를 관리
 * IMPACT: 결제 성공 시 라이선스 자동 생성, 취소/환불 시 자동 비활성화
 *
 * 처리 이벤트:
 * - transaction.completed → 라이선스 생성
 * - subscription.activated → 구독 활성화 확인 (로그)
 * - subscription.canceled → 라이선스 비활성화
 * - subscription.past_due → 로그 기록 (알림용)
 * - adjustment.created → 환불 시 라이선스 비활성화
 */

import { NextRequest, NextResponse } from 'next/server';
import { Environment, Paddle, EventName } from '@paddle/paddle-node-sdk';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import {
  rateLimitWebhooks,
  getClientIp,
  createRateLimitErrorResponse,
} from '@/lib/security/rate-limit';
import type { LicenseTier } from '@/lib/db/types';
import { CREATOR_ALL_ACCESS_THEME_ID } from '@/lib/access/constants';
import {
  buildQuotaSettlementPreview,
  extractSubscriptionPeriod,
} from '@/lib/billing/quota-settlement';
import { insertQuotaAllocationWithClient } from '@/lib/db/quota-allocations';
import {
  upsertQuotaEntitlementWithClient,
  updateQuotaEntitlementStatusBySubscriptionIdWithClient,
} from '@/lib/db/quota-entitlements';
import { upsertBillingAccountWithClient } from '@/lib/db/billing-accounts';
import { upsertBillingSubscriptionWithClient } from '@/lib/db/billing-subscriptions';
import { parsePaddleCustomData } from '@/lib/paddle/contracts';
import { resolvePaddlePriceTarget } from '@/lib/paddle/config';

// Paddle 서버 SDK 초기화
function getPaddleClient(): Paddle | null {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    console.error('[Paddle Webhook] PADDLE_API_KEY가 설정되지 않았습니다');
    return null;
  }

  const environment =
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
      ? Environment.production
      : Environment.sandbox;

  return new Paddle(apiKey, { environment });
}

// Service Role Supabase 클라이언트 (RLS 우회)
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase 환경변수가 설정되지 않았습니다');
  }

  return createSupabaseAdmin(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function extractCustomerId(payload: Record<string, unknown>): string | null {
  const direct =
    (typeof payload.customerId === 'string' && payload.customerId) ||
    (typeof payload.customer_id === 'string' && payload.customer_id);
  return direct || null;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(request);
  const rateLimitResult = await rateLimitWebhooks(clientIp);
  if (!rateLimitResult.success) {
    return createRateLimitErrorResponse(rateLimitResult);
  }

  // Paddle 클라이언트 확인
  const paddle = getPaddleClient();
  if (!paddle) {
    return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 });
  }

  // 웹훅 서명 검증
  const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Paddle Webhook] PADDLE_WEBHOOK_SECRET이 설정되지 않았습니다');
    return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 });
  }

  const signature = request.headers.get('paddle-signature');
  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 401 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = await paddle.webhooks.unmarshal(rawBody, webhookSecret, signature);
  } catch (err) {
    console.error('[Paddle Webhook] 서명 검증 실패:', err);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 });
  }

  if (!event) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }

  console.log(`[Paddle Webhook] 이벤트 수신: ${event.eventType}`);

  try {
    const adminClient = getAdminClient();

    switch (event.eventType) {
      // 결제 완료 → 라이선스 생성
      case EventName.TransactionCompleted: {
        const transaction = event.data;
        const customData = parsePaddleCustomData(transaction.customData);

        if (!customData) {
          console.error('[Paddle Webhook] custom_data에 user_id가 없습니다');
          return NextResponse.json({ error: 'missing_user_id' }, { status: 400 });
        }

        // 첫 번째 아이템의 Price ID로 티어 결정
        const firstItem = transaction.items?.[0];
        const priceId = firstItem?.price?.id;
        if (!priceId) {
          console.error('[Paddle Webhook] Price ID를 찾을 수 없습니다');
          return NextResponse.json({ error: 'missing_price_id' }, { status: 400 });
        }

        const priceTarget = resolvePaddlePriceTarget(priceId);
        const purchaseKind =
          customData.purchase_kind ?? priceTarget?.purchaseKind ?? 'legacy_template';

        if (purchaseKind === 'plan') {
          const settlement = buildQuotaSettlementPreview({
            transactionId: transaction.id,
            customData: { ...customData, purchase_kind: 'plan' },
            priceTarget,
          });

          if (!settlement) {
            console.error(
              `[Paddle Webhook] Invalid quota plan purchase payload: user=${customData.user_id}`
            );
            return NextResponse.json({ error: 'invalid_quota_purchase' }, { status: 400 });
          }

          const customerId = extractCustomerId(transaction as unknown as Record<string, unknown>);
          if (customerId) {
            await upsertBillingAccountWithClient(adminClient, {
              user_id: settlement.userId,
              paddle_customer_id: customerId,
            });
          }

          try {
            await insertQuotaAllocationWithClient(adminClient, {
              user_id: settlement.userId,
              allocation_type: 'plan',
              units: settlement.grantedUnits,
              source: settlement.source,
              paddle_transaction_id: settlement.transactionId,
              metadata: settlement.planId ? { plan_id: settlement.planId } : null,
            });
          } catch (error) {
            if ((error as { code?: string }).code === '23505') {
              return NextResponse.json({ status: 'already_processed' });
            }
            throw error;
          }

          await upsertQuotaEntitlementWithClient(adminClient, {
            user_id: settlement.userId,
            plan_id: settlement.planId ?? 'developer',
            status: 'active',
            included_units: settlement.grantedUnits,
          });

          console.log(
            `[Paddle Webhook] Quota plan purchase received: user=${settlement.userId}, plan=${settlement.planId}, units=${settlement.grantedUnits}`
          );
          return NextResponse.json({
            status: 'quota_plan_recorded',
            mode: 'transition',
            plan_id: settlement.planId,
            granted_units: settlement.grantedUnits,
          });
        }

        if (purchaseKind === 'top_up') {
          const settlement = buildQuotaSettlementPreview({
            transactionId: transaction.id,
            customData: { ...customData, purchase_kind: 'top_up' },
            priceTarget,
          });

          if (!settlement) {
            console.error(
              `[Paddle Webhook] Invalid quota top-up purchase payload: user=${customData.user_id}`
            );
            return NextResponse.json({ error: 'invalid_quota_purchase' }, { status: 400 });
          }

          const customerId = extractCustomerId(transaction as unknown as Record<string, unknown>);
          if (customerId) {
            await upsertBillingAccountWithClient(adminClient, {
              user_id: settlement.userId,
              paddle_customer_id: customerId,
            });
          }

          try {
            await insertQuotaAllocationWithClient(adminClient, {
              user_id: settlement.userId,
              allocation_type: 'top_up',
              units: settlement.grantedUnits,
              source: settlement.source,
              paddle_transaction_id: settlement.transactionId,
              metadata: { purchase_kind: 'top_up' },
            });
          } catch (error) {
            if ((error as { code?: string }).code === '23505') {
              return NextResponse.json({ status: 'already_processed' });
            }
            throw error;
          }

          console.log(
            `[Paddle Webhook] Quota top-up purchase received: user=${settlement.userId}, units=${settlement.grantedUnits}`
          );
          return NextResponse.json({
            status: 'quota_top_up_recorded',
            mode: 'transition',
            granted_units: settlement.grantedUnits,
          });
        }

        const tier: LicenseTier =
          customData.tier ??
          (priceTarget && 'legacyTier' in priceTarget ? priceTarget.legacyTier : 'single');
        const requestedThemeId = customData.theme_id?.trim();
        const themeId =
          tier === 'creator'
            ? requestedThemeId || CREATOR_ALL_ACCESS_THEME_ID
            : requestedThemeId || null;

        if (!themeId) {
          console.error(
            `[Paddle Webhook] Missing theme_id for scoped purchase: user=${customData.user_id}, tier=${tier}`
          );
          return NextResponse.json({ error: 'missing_theme_id' }, { status: 400 });
        }

        // Idempotency: paddle_subscription_id로 중복 확인
        const transactionId = transaction.id;

        const { data: existingRows } = await adminClient
          .from('user_licenses')
          .select('id')
          .eq('user_id', customData.user_id)
          .eq('paddle_subscription_id', transactionId)
          .limit(1);

        if (existingRows && existingRows.length > 0) {
          console.log(`[Paddle Webhook] 이미 처리된 트랜잭션: ${transactionId}`);
          return NextResponse.json({ status: 'already_processed' });
        }

        // Double 패키지: 쉼표 구분 themeId → 각각 라이선스 생성
        if (tier === 'double' && themeId.includes(',')) {
          const themeIds = themeId
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean);

          const licenseRecords = themeIds.map((tId) => ({
            user_id: customData.user_id,
            theme_id: tId,
            tier,
            paddle_subscription_id: transactionId,
            is_active: true,
          }));

          const { error: insertError } = await adminClient
            .from('user_licenses')
            .insert(licenseRecords);

          if (insertError) {
            console.error('[Paddle Webhook] Double 라이선스 생성 실패:', insertError);
            return NextResponse.json({ error: 'license_creation_failed' }, { status: 500 });
          }

          console.log(
            `[Paddle Webhook] Double 라이선스 생성 완료: user=${customData.user_id}, themes=${themeIds.join(',')}`
          );
        } else {
          // Single / Creator / themeId가 단일인 경우
          const { error: insertError } = await adminClient.from('user_licenses').insert({
            user_id: customData.user_id,
            theme_id: themeId,
            tier,
            paddle_subscription_id: transactionId,
            is_active: true,
          });

          if (insertError) {
            console.error('[Paddle Webhook] 라이선스 생성 실패:', insertError);
            return NextResponse.json({ error: 'license_creation_failed' }, { status: 500 });
          }

          console.log(
            `[Paddle Webhook] 라이선스 생성 완료: user=${customData.user_id}, tier=${tier}`
          );
        }
        break;
      }

      // 구독 활성화
      case EventName.SubscriptionActivated: {
        const subscription = event.data;
        const customData = parsePaddleCustomData(subscription.customData);

        if (customData) {
          if (customData.purchase_kind === 'plan') {
            const settlement = buildQuotaSettlementPreview({
              transactionId: subscription.id,
              customData: { ...customData, purchase_kind: 'plan' },
              priceTarget: null,
            });

            if (settlement?.planId) {
              const { currentPeriodStart, currentPeriodEnd } = extractSubscriptionPeriod(
                subscription as {
                  currentBillingPeriod?: {
                    startsAt?: string | null;
                    endsAt?: string | null;
                  } | null;
                  current_billing_period?: {
                    starts_at?: string | null;
                    ends_at?: string | null;
                  } | null;
                }
              );
              const customerId = extractCustomerId(
                subscription as unknown as Record<string, unknown>
              );
              if (customerId) {
                await upsertBillingAccountWithClient(adminClient, {
                  user_id: settlement.userId,
                  paddle_customer_id: customerId,
                });
              }

              await upsertQuotaEntitlementWithClient(adminClient, {
                user_id: settlement.userId,
                plan_id: settlement.planId,
                status: 'active',
                included_units: settlement.grantedUnits,
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
                paddle_subscription_id: subscription.id,
              });
              await upsertBillingSubscriptionWithClient(adminClient, {
                user_id: settlement.userId,
                paddle_subscription_id: subscription.id,
                plan_id: settlement.planId,
                status: 'active',
                current_period_start: currentPeriodStart,
                current_period_end: currentPeriodEnd,
              });
            }
          }

          console.log(
            `[Paddle Webhook] 구독 활성화: user=${customData.user_id}, kind=${customData.purchase_kind}, sub=${subscription.id}`
          );
        }
        break;
      }

      case 'subscription.updated': {
        const subscription = event.data as {
          id: string;
          customData?: unknown;
          currentBillingPeriod?: { startsAt?: string | null; endsAt?: string | null } | null;
          current_billing_period?: {
            starts_at?: string | null;
            ends_at?: string | null;
          } | null;
        };
        const customData = parsePaddleCustomData(subscription.customData);

        if (customData?.purchase_kind === 'plan') {
          const settlement = buildQuotaSettlementPreview({
            transactionId: subscription.id,
            customData: { ...customData, purchase_kind: 'plan' },
            priceTarget: null,
          });

          if (settlement?.planId) {
            const { currentPeriodStart, currentPeriodEnd } =
              extractSubscriptionPeriod(subscription);
            const customerId = extractCustomerId(
              subscription as unknown as Record<string, unknown>
            );

            if (customerId) {
              await upsertBillingAccountWithClient(adminClient, {
                user_id: settlement.userId,
                paddle_customer_id: customerId,
              });
            }

            await insertQuotaAllocationWithClient(adminClient, {
              user_id: settlement.userId,
              allocation_type: 'plan',
              units: settlement.grantedUnits,
              source: 'subscription_renewal',
              billing_period_start: currentPeriodStart,
              billing_period_end: currentPeriodEnd,
              paddle_transaction_id: `${subscription.id}:${currentPeriodStart ?? 'renewal'}`,
              paddle_subscription_id: subscription.id,
              metadata: { plan_id: settlement.planId, renewal: true },
            });

            await upsertQuotaEntitlementWithClient(adminClient, {
              user_id: settlement.userId,
              plan_id: settlement.planId,
              status: 'active',
              included_units: settlement.grantedUnits,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
              paddle_subscription_id: subscription.id,
            });
            await upsertBillingSubscriptionWithClient(adminClient, {
              user_id: settlement.userId,
              paddle_subscription_id: subscription.id,
              plan_id: settlement.planId,
              status: 'active',
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
            });
          }
        }

        console.log(`[Paddle Webhook] 구독 갱신 처리 완료: sub=${subscription.id}`);
        break;
      }

      // 구독 취소 → 라이선스 비활성화
      case EventName.SubscriptionCanceled: {
        const subscription = event.data;
        const subscriptionId = subscription.id;
        const customData = parsePaddleCustomData(
          (subscription as { customData?: unknown }).customData
        );

        await updateQuotaEntitlementStatusBySubscriptionIdWithClient(
          adminClient,
          subscriptionId,
          'canceled'
        );

        if (customData?.user_id && customData.plan_id) {
          await upsertBillingSubscriptionWithClient(adminClient, {
            user_id: customData.user_id,
            paddle_subscription_id: subscriptionId,
            plan_id: customData.plan_id,
            status: 'canceled',
          });
        }

        const { error: updateError } = await adminClient
          .from('user_licenses')
          .update({ is_active: false })
          .eq('paddle_subscription_id', subscriptionId);

        if (updateError) {
          console.error('[Paddle Webhook] 라이선스 비활성화 실패:', updateError);
          return NextResponse.json({ error: 'license_update_failed' }, { status: 500 });
        }

        console.log(`[Paddle Webhook] 구독 취소 처리 완료: sub=${subscriptionId}`);
        break;
      }

      // 결제 연체
      case EventName.SubscriptionPastDue: {
        const subscription = event.data;
        const customData = parsePaddleCustomData(
          (subscription as { customData?: unknown }).customData
        );
        await updateQuotaEntitlementStatusBySubscriptionIdWithClient(
          adminClient,
          subscription.id,
          'past_due'
        );

        if (customData?.user_id && customData.plan_id) {
          await upsertBillingSubscriptionWithClient(adminClient, {
            user_id: customData.user_id,
            paddle_subscription_id: subscription.id,
            plan_id: customData.plan_id,
            status: 'past_due',
          });
        }
        console.warn(`[Paddle Webhook] 구독 연체: sub=${subscription.id}`);
        break;
      }

      // 환불 (Paddle v3에서는 Adjustment로 환불 처리)
      case EventName.AdjustmentCreated: {
        const adjustment = event.data;
        const action = adjustment.action;

        // 환불(refund) 또는 크레딧(credit)인 경우만 처리
        if (action === 'refund' || action === 'credit') {
          const transactionId = adjustment.transactionId;
          const customData = parsePaddleCustomData(
            (adjustment as { customData?: unknown }).customData
          );

          if (transactionId) {
            if (
              customData &&
              (customData.purchase_kind === 'plan' || customData.purchase_kind === 'top_up')
            ) {
              const settlement = buildQuotaSettlementPreview({
                transactionId,
                customData,
                priceTarget: null,
              });

              if (settlement) {
                await insertQuotaAllocationWithClient(adminClient, {
                  user_id: settlement.userId,
                  allocation_type: 'adjustment',
                  units: settlement.grantedUnits * -1,
                  source: 'paddle_adjustment',
                  paddle_transaction_id: adjustment.id,
                  metadata: {
                    action,
                    purchase_kind: customData.purchase_kind,
                    original_transaction_id: transactionId,
                  },
                });
              }
            }

            const { error: updateError } = await adminClient
              .from('user_licenses')
              .update({ is_active: false })
              .eq('paddle_subscription_id', transactionId);

            if (updateError) {
              console.error('[Paddle Webhook] 환불 처리 실패:', updateError);
              return NextResponse.json({ error: 'refund_processing_failed' }, { status: 500 });
            }

            console.log(`[Paddle Webhook] 환불 처리 완료: txn=${transactionId}, action=${action}`);
          }
        }
        break;
      }

      default:
        console.log(`[Paddle Webhook] 미처리 이벤트: ${event.eventType}`);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('[Paddle Webhook] 처리 중 오류:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
