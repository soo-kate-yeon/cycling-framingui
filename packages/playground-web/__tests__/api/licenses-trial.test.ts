/**
 * Transition Access API Tests
 *
 * WHY: transition access 생성 API와 legacy wrapper의 호환성을 함께 검증한다.
 * IMPACT: quota onboarding 플로우 안정성 향상
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST as postLegacyRoute } from '@/app/api/licenses/trial/route';
import { POST as postTransitionRoute } from '@/app/api/access/transition/route';

const mockGetUser = vi.fn();
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEqUserId = vi.fn();
const mockEqType = vi.fn();
const mockMaybeSingle = vi.fn();
const mockInsert = vi.fn();
const mockInsertSelect = vi.fn();
const mockInsertSingle = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

describe('transition access routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFrom.mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
    });

    mockSelect.mockReturnValue({ eq: mockEqUserId });
    mockEqUserId.mockReturnValue({ eq: mockEqType });
    mockEqType.mockReturnValue({ maybeSingle: mockMaybeSingle });

    mockInsert.mockReturnValue({ select: mockInsertSelect });
    mockInsertSelect.mockReturnValue({ single: mockInsertSingle });
  });

  it('returns 401 for unauthenticated users on the new route', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'No session' },
    });

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ error: 'unauthorized' });
  });

  it('returns transition_access_already_exists with compatibility fields when access already exists', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: { id: 'trial-1', type: 'trial', expires_at: '2099-01-01T00:00:00.000Z' },
      error: null,
    });

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('transition_access_already_exists');
    expect(data.legacy_error).toBe('trial_already_exists');
    expect(data.existing_access.expires_at).toBe('2099-01-01T00:00:00.000Z');
    expect(data.existing_trial.expires_at).toBe('2099-01-01T00:00:00.000Z');
  });

  it('creates transition access successfully on the new route', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });
    mockInsertSingle.mockResolvedValue({
      data: { id: 'trial-new', type: 'trial', expires_at: '2099-01-01T00:00:00.000Z' },
      error: null,
    });

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.access.id).toBe('trial-new');
    expect(data.trial.id).toBe('trial-new');
    expect(data.access.type).toBe('trial');
  });

  it('returns creation_failed on DB insert error', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });
    mockInsertSingle.mockResolvedValue({
      data: null,
      error: { message: 'insert failed' },
    });

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('creation_failed');
    expect(data.message).toBe('insert failed');
  });

  it('returns internal_error on unexpected exception', async () => {
    mockGetUser.mockRejectedValue(new Error('boom'));

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'internal_error' });
  });

  it('returns reason=rls_denied on RLS failure', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });
    mockInsertSingle.mockResolvedValue({
      data: null,
      error: { message: 'new row violates row-level security policy', code: '42501' },
    });

    const response = await postTransitionRoute();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('creation_failed');
    expect(data.reason).toBe('rls_denied');
    expect(data.debug.code).toBe('42501');
  });

  it('keeps the legacy /api/licenses/trial wrapper working', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    });
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: null,
    });
    mockInsertSingle.mockResolvedValue({
      data: { id: 'trial-new', type: 'trial', expires_at: '2099-01-01T00:00:00.000Z' },
      error: null,
    });

    const response = await postLegacyRoute();
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.access.id).toBe('trial-new');
  });
});
