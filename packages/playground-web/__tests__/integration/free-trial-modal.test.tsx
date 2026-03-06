/**
 * FreeTrialModal Tests
 *
 * WHY: 무료 체험 생성 실패/성공 시 UI 동작과 자동 호출 안정성을 검증한다.
 * IMPACT: 무료 체험 시작 UX 회귀 방지
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { FreeTrialModal } from '@/components/modals/FreeTrialModal';
import { GlobalLanguageProvider } from '@/contexts/GlobalLanguageContext';

const { mockUseAuth, mockTrackFunnelPrimaryCtaClick } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockTrackFunnelPrimaryCtaClick: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/lib/analytics', () => ({
  trackFunnelPrimaryCtaClick: mockTrackFunnelPrimaryCtaClick,
}));

function createMockResponse({
  ok,
  status,
  statusText = '',
  body = '',
}: {
  ok: boolean;
  status: number;
  statusText?: string;
  body?: string;
}): Response {
  return {
    ok,
    status,
    statusText,
    text: async () => body,
  } as Response;
}

describe('FreeTrialModal', () => {
  function renderModal(onStartTrial = vi.fn()) {
    return render(
      <GlobalLanguageProvider>
        <FreeTrialModal
          isOpen={true}
          onClose={vi.fn()}
          onStartTrial={onStartTrial}
          onDismissForever={vi.fn()}
        />
      </GlobalLanguageProvider>
    );
  }

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});

    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      login: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('trial 생성 성공 시 onStartTrial을 호출하고 localStorage를 갱신한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: true,
        status: 201,
        body: JSON.stringify({ success: true }),
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const onStartTrial = vi.fn();
    renderModal(onStartTrial);

    await waitFor(() => {
      expect(onStartTrial).toHaveBeenCalledTimes(1);
    });

    expect(localStorage.getItem('hasSeenFreeTrial')).toBe('true');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('빈 에러 payload({})가 와도 자동 생성은 1회만 실행되고 사용자 에러 메시지를 표시한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        body: '{}',
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    renderModal();

    expect(await screen.findByText('An error occurred while creating the trial')).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      '[FreeTrialModal] Trial creation failed:',
      expect.objectContaining({
        status: 500,
        errorCode: null,
      })
    );
  });

  it('trial_already_exists(409) 응답 시 전용 안내 메시지를 표시한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createMockResponse({
        ok: false,
        status: 409,
        body: JSON.stringify({ error: 'trial_already_exists' }),
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    renderModal();

    expect(await screen.findByText('You have already used the trial')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
