import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setRawApiKey } from '../../src/auth/state.js';
import { syncUsageEvent } from '../../src/billing/usage-sync.js';

describe('usage sync', () => {
  const originalFetch = global.fetch;
  const originalApiUrl = process.env.FRAMINGUI_API_URL;

  beforeEach(() => {
    setRawApiKey(null);
    process.env.FRAMINGUI_API_URL = 'https://framingui.com';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    setRawApiKey(null);

    if (originalApiUrl) {
      process.env.FRAMINGUI_API_URL = originalApiUrl;
    } else {
      delete process.env.FRAMINGUI_API_URL;
    }
  });

  it('posts usage events to the backend when an API key is available', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 202,
      statusText: 'Accepted',
    }));
    global.fetch = fetchMock as unknown as typeof fetch;
    setRawApiKey(`tk_live_${'a'.repeat(64)}`);

    await syncUsageEvent({
      id: 'usage-1',
      timestamp: '2026-03-20T00:00:00.000Z',
      toolName: 'list-components',
      toolClass: 'discovery',
      billable: true,
      units: 1,
      outcome: 'success',
      userId: 'user-1',
      plan: 'pro',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://framingui.com/api/mcp/usage-events',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: `Bearer tk_live_${'a'.repeat(64)}`,
        }),
      })
    );
  });

  it('does nothing when there is no authenticated user or API key', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    await syncUsageEvent({
      id: 'usage-1',
      timestamp: '2026-03-20T00:00:00.000Z',
      toolName: 'list-components',
      toolClass: 'discovery',
      billable: true,
      units: 1,
      outcome: 'success',
      userId: null,
      plan: 'pro',
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
