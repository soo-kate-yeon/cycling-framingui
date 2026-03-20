import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/app/api/user/usage/route';

const { mockGetUser, mockGetUserUsageSummary } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetUserUsageSummary: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

vi.mock('@/lib/db/quota-usage-events', () => ({
  getUserUsageSummary: mockGetUserUsageSummary,
}));

describe('GET /api/user/usage', () => {
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

  it('returns a usage summary for authenticated users', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockGetUserUsageSummary.mockResolvedValue({
      total_used_units: 8,
      total_calls: 3,
      by_tool_class: [
        { tool_class: 'guarded', used_units: 6, calls: 1 },
        { tool_class: 'discovery', used_units: 2, calls: 2 },
      ],
      latest_event_at: '2026-03-20T02:00:00.000Z',
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.usage.total_used_units).toBe(8);
    expect(data.usage.by_tool_class).toHaveLength(2);
  });
});
