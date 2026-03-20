import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getUserQuotaSummary } from '@/lib/db/quota-summary';

const mockFrom = vi.fn();
const mockEntitlementSelect = vi.fn();
const mockEntitlementEq = vi.fn();
const mockEntitlementMaybeSingle = vi.fn();
const mockAllocationSelect = vi.fn();
const mockAllocationEq = vi.fn();
const mockAllocationOrder = vi.fn();
const mockLicenseSelect = vi.fn();
const mockLicenseEq = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

describe('getUserQuotaSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockImplementation((table: string) => {
      if (table === 'quota_entitlements') {
        return {
          select: mockEntitlementSelect,
        };
      }

      if (table === 'quota_allocations') {
        return {
          select: mockAllocationSelect,
        };
      }

      if (table === 'user_licenses') {
        return {
          select: mockLicenseSelect,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    mockEntitlementSelect.mockReturnValue({ eq: mockEntitlementEq });
    mockEntitlementEq.mockReturnValue({ maybeSingle: mockEntitlementMaybeSingle });

    mockAllocationSelect.mockReturnValue({ eq: mockAllocationEq });
    mockAllocationEq.mockReturnValue({ order: mockAllocationOrder });
    mockLicenseSelect.mockReturnValue({ eq: mockLicenseEq });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('summarizes entitlement and allocation totals for a user', async () => {
    mockEntitlementMaybeSingle.mockResolvedValue({
      data: {
        id: 'qe_1',
        user_id: 'user-1',
        plan_id: 'developer',
        status: 'active',
        included_units: 2000,
        current_period_start: '2026-04-01T00:00:00.000Z',
        current_period_end: '2026-05-01T00:00:00.000Z',
        paddle_subscription_id: 'sub_1',
        created_at: '2026-03-20T00:00:00.000Z',
        updated_at: '2026-03-20T00:00:00.000Z',
      },
      error: null,
    });
    mockAllocationOrder.mockResolvedValue({
      data: [
        {
          units: 1000,
          allocation_type: 'top_up',
          created_at: '2026-04-05T00:00:00.000Z',
        },
        {
          units: 2000,
          allocation_type: 'plan',
          created_at: '2026-04-01T00:00:00.000Z',
        },
      ],
      error: null,
    });
    mockLicenseEq.mockResolvedValue({
      data: [
        {
          theme_id: 'creator-all-access',
          tier: 'creator',
          is_active: true,
          expires_at: '2026-12-31T00:00:00.000Z',
        },
      ],
      error: null,
    });

    const result = await getUserQuotaSummary('user-1');

    expect(result.entitlement?.plan_id).toBe('developer');
    expect(result.total_allocated_units).toBe(3000);
    expect(result.plan_allocated_units).toBe(2000);
    expect(result.top_up_allocated_units).toBe(1000);
    expect(result.latest_allocation_at).toBe('2026-04-05T00:00:00.000Z');
    expect(result.legacy_transition_allowance).toEqual({
      source: 'creator_all_access',
      units: 2000,
      description:
        'Grandfathered transition allowance for legacy all-access customers while quota plans roll out.',
    });
  });
});
