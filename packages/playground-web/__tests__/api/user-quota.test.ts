import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/user/quota/route';

const { mockGetUser, mockGetUserQuotaSummary } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetUserQuotaSummary: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock('@/lib/db/quota-summary', () => ({
  getUserQuotaSummary: mockGetUserQuotaSummary,
}));

describe('GET /api/user/quota', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 401 for unauthenticated users', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'No session' },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'unauthorized' });
  });

  it('returns the user quota summary for authenticated users', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockGetUserQuotaSummary.mockResolvedValue({
      entitlement: {
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
      total_allocated_units: 3000,
      plan_allocated_units: 2000,
      top_up_allocated_units: 1000,
      latest_allocation_at: '2026-04-05T00:00:00.000Z',
      legacy_transition_allowance: {
        source: 'creator_all_access',
        units: 2000,
        description:
          'Grandfathered transition allowance for legacy all-access customers while quota plans roll out.',
      },
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.quota.entitlement.plan_id).toBe('developer');
    expect(data.quota.total_allocated_units).toBe(3000);
    expect(data.quota.legacy_transition_allowance.units).toBe(2000);
  });
});
