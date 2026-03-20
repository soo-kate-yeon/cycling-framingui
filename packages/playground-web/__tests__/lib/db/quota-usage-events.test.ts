import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createQuotaUsageEventWithClient, getUserUsageSummary } from '@/lib/db/quota-usage-events';

const mockFrom = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockUsageSelect = vi.fn();
const mockUsageEq = vi.fn();
const mockUsageGte = vi.fn();
const mockUsageOrder = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: mockFrom,
  })),
}));

describe('quota usage events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockImplementation((table: string) => {
      if (table === 'quota_usage_events') {
        return {
          insert: mockInsert,
          select: mockUsageSelect,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockUsageSelect.mockReturnValue({ eq: mockUsageEq });
    mockUsageEq.mockReturnValue({ gte: mockUsageGte });
    mockUsageGte.mockReturnValue({ order: mockUsageOrder });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a durable usage event', async () => {
    mockSingle.mockResolvedValue({
      data: {
        id: 'evt_1',
        user_id: 'user-1',
        tool_name: 'list-components',
        tool_class: 'discovery',
        units: 1,
        outcome: 'success',
        created_at: '2026-03-20T00:00:00.000Z',
      },
      error: null,
    });

    const result = await createQuotaUsageEventWithClient(
      {
        from: mockFrom,
      },
      {
        user_id: 'user-1',
        tool_name: 'list-components',
        tool_class: 'discovery',
        units: 1,
        outcome: 'success',
      }
    );

    expect(result.tool_name).toBe('list-components');
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-1',
        tool_name: 'list-components',
        tool_class: 'discovery',
        units: 1,
        outcome: 'success',
      })
    );
  });

  it('summarizes current-period usage by tool class', async () => {
    mockUsageOrder.mockResolvedValue({
      data: [
        {
          tool_class: 'guarded',
          units: 6,
          created_at: '2026-03-20T02:00:00.000Z',
        },
        {
          tool_class: 'discovery',
          units: 1,
          created_at: '2026-03-20T01:00:00.000Z',
        },
        {
          tool_class: 'discovery',
          units: 1,
          created_at: '2026-03-20T00:00:00.000Z',
        },
      ],
      error: null,
    });

    const result = await getUserUsageSummary('user-1');

    expect(result.total_used_units).toBe(8);
    expect(result.total_calls).toBe(3);
    expect(result.latest_event_at).toBe('2026-03-20T02:00:00.000Z');
    expect(result.by_tool_class).toEqual(
      expect.arrayContaining([
        { tool_class: 'guarded', used_units: 6, calls: 1 },
        { tool_class: 'discovery', used_units: 2, calls: 2 },
      ])
    );
  });
});
