import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { mockUnmarshal, mockRateLimitWebhooks, mockCreateRateLimitErrorResponse } = vi.hoisted(
  () => ({
    mockUnmarshal: vi.fn(),
    mockRateLimitWebhooks: vi.fn(),
    mockCreateRateLimitErrorResponse: vi.fn(),
  })
);

const { mockUpsertBillingAccountWithClient, mockUpsertBillingSubscriptionWithClient } = vi.hoisted(
  () => ({
    mockUpsertBillingAccountWithClient: vi.fn(),
    mockUpsertBillingSubscriptionWithClient: vi.fn(),
  })
);

const mockInsert = vi.fn();
const mockQuotaInsert = vi.fn();
const mockQuotaSelect = vi.fn();
const mockQuotaSingle = vi.fn();
const mockEntitlementUpsert = vi.fn();
const mockEntitlementSelect = vi.fn();
const mockEntitlementSingle = vi.fn();
const mockEntitlementUpdate = vi.fn();
const mockEntitlementEq = vi.fn();
const mockLicenseUpdate = vi.fn();
const mockLicenseEq = vi.fn();
const mockLimit = vi.fn();
const mockEqSubscriptionId = vi.fn();
const mockEqUserId = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

vi.mock('@paddle/paddle-node-sdk', () => ({
  Environment: { production: 'production', sandbox: 'sandbox' },
  EventName: {
    TransactionCompleted: 'transaction.completed',
    SubscriptionActivated: 'subscription.activated',
    SubscriptionUpdated: 'subscription.updated',
    SubscriptionCanceled: 'subscription.canceled',
    SubscriptionPastDue: 'subscription.past_due',
    AdjustmentCreated: 'adjustment.created',
  },
  Paddle: vi.fn().mockImplementation(() => ({
    webhooks: {
      unmarshal: mockUnmarshal,
    },
  })),
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock('@/lib/security/rate-limit', () => ({
  rateLimitWebhooks: mockRateLimitWebhooks,
  getClientIp: vi.fn(() => '127.0.0.1'),
  createRateLimitErrorResponse: mockCreateRateLimitErrorResponse,
}));

vi.mock('@/lib/db/billing-accounts', () => ({
  upsertBillingAccountWithClient: mockUpsertBillingAccountWithClient,
}));

vi.mock('@/lib/db/billing-subscriptions', () => ({
  upsertBillingSubscriptionWithClient: mockUpsertBillingSubscriptionWithClient,
}));

describe('POST /api/webhooks/paddle', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    process.env.PADDLE_API_KEY = 'pdl_test_key';
    process.env.PADDLE_WEBHOOK_SECRET = 'pdl_whsec_test';
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT = 'sandbox';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';
    process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE = 'pri_single';
    process.env.NEXT_PUBLIC_PADDLE_PRICE_DOUBLE = 'pri_double';
    process.env.NEXT_PUBLIC_PADDLE_PRICE_CREATOR = 'pri_creator';

    mockRateLimitWebhooks.mockResolvedValue({
      success: true,
      limit: 60,
      remaining: 59,
      reset: Date.now() + 60_000,
    });

    mockFrom.mockImplementation((table: string) => {
      if (table === 'user_licenses') {
        return {
          select: mockSelect,
          insert: mockInsert,
          update: mockLicenseUpdate,
        };
      }

      if (table === 'quota_allocations') {
        return {
          insert: mockQuotaInsert,
        };
      }

      if (table === 'quota_entitlements') {
        return {
          upsert: mockEntitlementUpsert,
          update: mockEntitlementUpdate,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    mockSelect.mockReturnValue({ eq: mockEqUserId });
    mockEqUserId.mockReturnValue({ eq: mockEqSubscriptionId });
    mockEqSubscriptionId.mockReturnValue({ limit: mockLimit });
    mockLicenseUpdate.mockReturnValue({ eq: mockLicenseEq });
    mockLicenseEq.mockResolvedValue({ error: null });
    mockLimit.mockResolvedValue({ data: [] });
    mockInsert.mockResolvedValue({ error: null });
    mockQuotaInsert.mockReturnValue({ select: mockQuotaSelect });
    mockQuotaSelect.mockReturnValue({ single: mockQuotaSingle });
    mockQuotaSingle.mockResolvedValue({
      data: {
        id: 'qa_1',
        user_id: 'user-1',
        allocation_type: 'plan',
        units: 2000,
        source: 'paddle_transaction',
        billing_period_start: null,
        billing_period_end: null,
        paddle_transaction_id: 'txn_789',
        paddle_subscription_id: null,
        metadata: { plan_id: 'developer' },
        created_at: '2026-03-18T00:00:00.000Z',
      },
      error: null,
    });
    mockEntitlementUpsert.mockReturnValue({ select: mockEntitlementSelect });
    mockEntitlementSelect.mockReturnValue({ single: mockEntitlementSingle });
    mockEntitlementSingle.mockResolvedValue({
      data: {
        id: 'qe_1',
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'active',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: null,
        created_at: '2026-03-18T00:00:00.000Z',
        updated_at: '2026-03-18T00:00:00.000Z',
      },
      error: null,
    });
    mockEntitlementUpdate.mockReturnValue({ eq: mockEntitlementEq });
    mockEntitlementEq.mockReturnValue({ select: mockEntitlementSelect });
    mockUpsertBillingAccountWithClient.mockResolvedValue({
      id: 'ba_1',
      user_id: 'user-1',
      paddle_customer_id: 'ctm_1',
    });
    mockUpsertBillingSubscriptionWithClient.mockResolvedValue({
      id: 'bs_1',
      user_id: 'user-1',
      paddle_subscription_id: 'sub_1',
      plan_id: 'developer',
      status: 'active',
    });
  });

  it('stores creator purchases as explicit all-access licenses when theme_id is omitted', async () => {
    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'transaction.completed',
      data: {
        id: 'txn_123',
        customData: {
          user_id: 'user-1',
        },
        items: [{ price: { id: 'pri_creator' } }],
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        theme_id: 'creator-all-access',
        tier: 'creator',
      })
    );
  });

  it('rejects single purchases when theme_id is missing instead of writing default', async () => {
    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'transaction.completed',
      data: {
        id: 'txn_456',
        customData: {
          user_id: 'user-1',
        },
        items: [{ price: { id: 'pri_single' } }],
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('missing_theme_id');
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('recognizes quota-plan purchases without creating legacy licenses', async () => {
    process.env.NEXT_PUBLIC_PADDLE_PRICE_DEVELOPER_MONTHLY = 'pri_dev_monthly';

    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'transaction.completed',
      data: {
        id: 'txn_789',
        customData: {
          user_id: 'user-1',
          purchase_kind: 'plan',
          billing_model: 'quota',
          plan_id: 'developer',
        },
        items: [{ price: { id: 'pri_dev_monthly' } }],
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('quota_plan_recorded');
    expect(data.mode).toBe('transition');
    expect(data.plan_id).toBe('developer');
    expect(data.granted_units).toBe(2000);
    expect(mockQuotaInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        allocation_type: 'plan',
        units: 2000,
        paddle_transaction_id: 'txn_789',
        metadata: { plan_id: 'developer' },
      })
    );
    expect(mockEntitlementUpsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'active',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: null,
      },
      { onConflict: 'user_id' }
    );
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('recognizes quota top-up purchases and returns normalized granted units', async () => {
    process.env.NEXT_PUBLIC_PADDLE_PRICE_TOPUP_1000 = 'pri_topup_1000';

    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'transaction.completed',
      data: {
        id: 'txn_topup_1',
        customData: {
          user_id: 'user-1',
          purchase_kind: 'top_up',
          billing_model: 'quota',
          top_up_units: 1000,
        },
        items: [{ price: { id: 'pri_topup_1000' } }],
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('quota_top_up_recorded');
    expect(data.mode).toBe('transition');
    expect(data.granted_units).toBe(1000);
    expect(mockQuotaInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        allocation_type: 'top_up',
        units: 1000,
        paddle_transaction_id: 'txn_topup_1',
        metadata: { purchase_kind: 'top_up' },
      })
    );
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('upserts plan entitlements when subscription is activated', async () => {
    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'subscription.activated',
      data: {
        id: 'sub_activated_1',
        customData: {
          user_id: 'user-1',
          purchase_kind: 'plan',
          billing_model: 'quota',
          plan_id: 'developer',
        },
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockEntitlementUpsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'active',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: 'sub_activated_1',
      },
      { onConflict: 'user_id' }
    );
    expect(mockUpsertBillingSubscriptionWithClient).toHaveBeenCalledWith(expect.anything(), {
      user_id: 'user-1',
      paddle_subscription_id: 'sub_activated_1',
      plan_id: 'developer',
      status: 'active',
      current_period_start: null,
      current_period_end: null,
    });
  });

  it('marks quota entitlement as canceled when subscription is canceled', async () => {
    const mockLicenseUpdate = vi.fn();
    const mockLicenseEq = vi.fn();

    mockFrom.mockImplementation((table: string) => {
      if (table === 'user_licenses') {
        return {
          select: mockSelect,
          insert: mockInsert,
          update: mockLicenseUpdate,
        };
      }

      if (table === 'quota_allocations') {
        return {
          insert: mockQuotaInsert,
        };
      }

      if (table === 'quota_entitlements') {
        return {
          upsert: mockEntitlementUpsert,
          update: mockEntitlementUpdate,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    mockLicenseUpdate.mockReturnValue({ eq: mockLicenseEq });
    mockLicenseEq.mockResolvedValue({ error: null });
    mockEntitlementSingle.mockResolvedValue({
      data: {
        id: 'qe_1',
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'canceled',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: 'sub_cancel_1',
        created_at: '2026-03-18T00:00:00.000Z',
        updated_at: '2026-03-19T00:00:00.000Z',
      },
      error: null,
    });

    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'subscription.canceled',
      data: {
        id: 'sub_cancel_1',
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockEntitlementUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'canceled',
      })
    );
    expect(mockEntitlementEq).toHaveBeenCalledWith('paddle_subscription_id', 'sub_cancel_1');
  });

  it('marks quota entitlement as past_due when subscription payment is overdue', async () => {
    mockEntitlementSingle.mockResolvedValue({
      data: {
        id: 'qe_1',
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'past_due',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: 'sub_past_due_1',
        created_at: '2026-03-18T00:00:00.000Z',
        updated_at: '2026-03-19T00:00:00.000Z',
      },
      error: null,
    });

    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'subscription.past_due',
      data: {
        id: 'sub_past_due_1',
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockEntitlementUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'past_due',
      })
    );
    expect(mockEntitlementEq).toHaveBeenCalledWith('paddle_subscription_id', 'sub_past_due_1');
  });

  it('creates a renewal allocation and refreshes entitlement periods on subscription.updated', async () => {
    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'subscription.updated',
      data: {
        id: 'sub_renew_1',
        customData: {
          user_id: 'user-1',
          purchase_kind: 'plan',
          billing_model: 'quota',
          plan_id: 'developer',
        },
        currentBillingPeriod: {
          startsAt: '2026-04-01T00:00:00.000Z',
          endsAt: '2026-05-01T00:00:00.000Z',
        },
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockQuotaInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        allocation_type: 'plan',
        units: 2000,
        source: 'subscription_renewal',
        billing_period_start: '2026-04-01T00:00:00.000Z',
        billing_period_end: '2026-05-01T00:00:00.000Z',
        paddle_transaction_id: 'sub_renew_1:2026-04-01T00:00:00.000Z',
        paddle_subscription_id: 'sub_renew_1',
        metadata: { plan_id: 'developer', renewal: true },
      })
    );
    expect(mockEntitlementUpsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'active',
        included_units: 2000,
        current_period_start: '2026-04-01T00:00:00.000Z',
        current_period_end: '2026-05-01T00:00:00.000Z',
        paddle_subscription_id: 'sub_renew_1',
      },
      { onConflict: 'user_id' }
    );
    expect(mockUpsertBillingSubscriptionWithClient).toHaveBeenCalledWith(expect.anything(), {
      user_id: 'user-1',
      paddle_subscription_id: 'sub_renew_1',
      plan_id: 'developer',
      status: 'active',
      current_period_start: '2026-04-01T00:00:00.000Z',
      current_period_end: '2026-05-01T00:00:00.000Z',
    });
  });

  it('records signed quota adjustments for refunded top-ups', async () => {
    const { POST } = await import('@/app/api/webhooks/paddle/route');

    mockUnmarshal.mockResolvedValue({
      eventType: 'adjustment.created',
      data: {
        id: 'adj_1',
        action: 'refund',
        transactionId: 'txn_topup_1',
        customData: {
          user_id: 'user-1',
          purchase_kind: 'top_up',
          billing_model: 'quota',
          top_up_units: 1000,
        },
      },
    });

    const request = new NextRequest('http://localhost:3001/api/webhooks/paddle', {
      method: 'POST',
      headers: { 'paddle-signature': 'sig_test' },
      body: JSON.stringify({ ok: true }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(mockQuotaInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        allocation_type: 'adjustment',
        units: -1000,
        source: 'paddle_adjustment',
        paddle_transaction_id: 'adj_1',
        metadata: {
          action: 'refund',
          purchase_kind: 'top_up',
          original_transaction_id: 'txn_topup_1',
        },
      })
    );
  });
});
