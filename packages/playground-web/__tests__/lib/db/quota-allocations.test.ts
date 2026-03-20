import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createQuotaAllocation } from '@/lib/db/quota-allocations';
import type { QuotaAllocation } from '@/lib/db/types';

const mockFrom = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

describe('createQuotaAllocation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockReturnValue({ insert: mockInsert });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a quota allocation record for a normalized quota purchase', async () => {
    const mockAllocation: QuotaAllocation = {
      id: 'qa_1',
      user_id: 'user-1',
      allocation_type: 'plan',
      units: 2000,
      source: 'paddle_transaction',
      billing_period_start: '2026-03-18T00:00:00.000Z',
      billing_period_end: '2026-04-18T00:00:00.000Z',
      paddle_transaction_id: 'txn_1',
      paddle_subscription_id: 'sub_1',
      metadata: { plan_id: 'developer' },
      created_at: '2026-03-18T00:00:00.000Z',
    };

    mockSingle.mockResolvedValue({
      data: mockAllocation,
      error: null,
    });

    const result = await createQuotaAllocation({
      user_id: 'user-1',
      allocation_type: 'plan',
      units: 2000,
      source: 'paddle_transaction',
      billing_period_start: '2026-03-18T00:00:00.000Z',
      billing_period_end: '2026-04-18T00:00:00.000Z',
      paddle_transaction_id: 'txn_1',
      paddle_subscription_id: 'sub_1',
      metadata: { plan_id: 'developer' },
    });

    expect(mockFrom).toHaveBeenCalledWith('quota_allocations');
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: 'user-1',
      allocation_type: 'plan',
      units: 2000,
      source: 'paddle_transaction',
      billing_period_start: '2026-03-18T00:00:00.000Z',
      billing_period_end: '2026-04-18T00:00:00.000Z',
      paddle_transaction_id: 'txn_1',
      paddle_subscription_id: 'sub_1',
      metadata: { plan_id: 'developer' },
    });
    expect(result).toEqual(mockAllocation);
  });

  it('fails closed on duplicate transaction inserts', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: {
        message: 'duplicate key value violates unique constraint',
        code: '23505',
      },
    });

    await expect(
      createQuotaAllocation({
        user_id: 'user-1',
        allocation_type: 'top_up',
        units: 1000,
        source: 'paddle_transaction',
        paddle_transaction_id: 'txn_topup_1',
      })
    ).rejects.toMatchObject({
      message: 'Quota allocation already exists for this transaction',
      code: '23505',
    });
  });
});
