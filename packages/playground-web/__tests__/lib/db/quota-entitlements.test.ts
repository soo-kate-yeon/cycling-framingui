import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { upsertQuotaEntitlement } from '@/lib/db/quota-entitlements';
import type { QuotaEntitlement } from '@/lib/db/types';

const mockFrom = vi.fn();
const mockUpsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

describe('upsertQuotaEntitlement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockReturnValue({ upsert: mockUpsert });
    mockUpsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('upserts the current quota entitlement for a paid plan', async () => {
    const mockEntitlement: QuotaEntitlement = {
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
    };

    mockSingle.mockResolvedValue({
      data: mockEntitlement,
      error: null,
    });

    const result = await upsertQuotaEntitlement({
      user_id: 'user-1',
      plan_id: 'developer',
      status: 'active',
      included_units: 2000,
    });

    expect(mockFrom).toHaveBeenCalledWith('quota_entitlements');
    expect(mockUpsert).toHaveBeenCalledWith(
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
    expect(result).toEqual(mockEntitlement);
  });

  it('updates quota entitlement lifecycle status by subscription id', async () => {
    mockFrom.mockReturnValue({ update: mockUpdate });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });

    mockSingle.mockResolvedValue({
      data: {
        id: 'qe_1',
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'canceled',
        included_units: 2000,
        current_period_start: null,
        current_period_end: null,
        paddle_subscription_id: 'sub_1',
        created_at: '2026-03-18T00:00:00.000Z',
        updated_at: '2026-03-19T00:00:00.000Z',
      },
      error: null,
    });

    const { updateQuotaEntitlementStatusBySubscriptionIdWithClient } =
      await import('@/lib/db/quota-entitlements');

    const result = await updateQuotaEntitlementStatusBySubscriptionIdWithClient(
      { from: mockFrom },
      'sub_1',
      'canceled'
    );

    expect(mockFrom).toHaveBeenCalledWith('quota_entitlements');
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'canceled',
      })
    );
    expect(mockEq).toHaveBeenCalledWith('paddle_subscription_id', 'sub_1');
    expect(result.status).toBe('canceled');
  });
});
