import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { mockCompare } = vi.hoisted(() => ({
  mockCompare: vi.fn(),
}));

const mockReturns = vi.fn();
const mockIs = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();
const mockCreateQuotaUsageEventWithClient = vi.fn();

vi.mock('bcryptjs', () => ({
  default: {
    compare: mockCompare,
  },
  compare: mockCompare,
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock('@/lib/db/quota-usage-events', () => ({
  createQuotaUsageEventWithClient: mockCreateQuotaUsageEventWithClient,
}));

describe('POST /api/mcp/usage-events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role';

    mockFrom.mockImplementation((table: string) => {
      if (table === 'api_keys') {
        return {
          select: mockSelect,
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    mockSelect.mockReturnValue({ is: mockIs });
    mockIs.mockReturnValue({ returns: mockReturns });
  });

  it('records a usage event for a valid API key', async () => {
    const { POST } = await import('@/app/api/mcp/usage-events/route');

    mockReturns.mockResolvedValue({
      data: [
        {
          id: 'key_1',
          user_id: 'user-1',
          key_hash: 'hash',
          revoked_at: null,
          expires_at: null,
        },
      ],
      error: null,
    });
    mockCompare.mockResolvedValue(true);
    mockCreateQuotaUsageEventWithClient.mockResolvedValue({
      id: 'evt_1',
    });

    const request = new NextRequest('http://localhost:3000/api/mcp/usage-events', {
      method: 'POST',
      headers: {
        authorization: `Bearer tk_live_${'a'.repeat(64)}`,
      },
      body: JSON.stringify({
        toolName: 'list-components',
        toolClass: 'discovery',
        units: 1,
        outcome: 'success',
        createdAt: '2026-03-20T00:00:00.000Z',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(202);
    expect(data.status).toBe('recorded');
    expect(mockCreateQuotaUsageEventWithClient).toHaveBeenCalledWith(expect.anything(), {
      user_id: 'user-1',
      tool_name: 'list-components',
      tool_class: 'discovery',
      units: 1,
      outcome: 'success',
      created_at: '2026-03-20T00:00:00.000Z',
    });
  });

  it('rejects invalid payloads', async () => {
    const { POST } = await import('@/app/api/mcp/usage-events/route');

    mockReturns.mockResolvedValue({
      data: [
        {
          id: 'key_1',
          user_id: 'user-1',
          key_hash: 'hash',
          revoked_at: null,
          expires_at: null,
        },
      ],
      error: null,
    });
    mockCompare.mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/mcp/usage-events', {
      method: 'POST',
      headers: {
        authorization: `Bearer tk_live_${'a'.repeat(64)}`,
      },
      body: JSON.stringify({
        toolName: 'list-components',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('invalid_payload');
    expect(mockCreateQuotaUsageEventWithClient).not.toHaveBeenCalled();
  });
});
