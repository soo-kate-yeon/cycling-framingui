/**
 * FreeTrialModal - 무료 체험 시작 모달 (우측 하단 팝업)
 *
 * 기능:
 * - 라이선스가 없는 사용자에게 표시
 * - localStorage로 중복 표시 방지
 * - 로그인 상태에 따라 분기 (로그인 → 템플릿 선택, 미로그인 → 로그인 플로우)
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  trackFunnelPrimaryCtaClick,
  trackFunnelTransitionAccessStarted,
} from '../../lib/analytics';
import { useGlobalLanguage } from '../../contexts/GlobalLanguageContext';
import { getFreeTrialModalContent } from '../../data/i18n/freeTrialModal';

// ============================================================================
// Types
// ============================================================================

interface FreeTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void; // 로그인 완료 후 템플릿 선택 모달로 진입
  onDismissForever: () => void; // "다시 보지 않기" 클릭 시
}

// ============================================================================
// Constants
// ============================================================================

const LOCAL_STORAGE_KEY = 'hasSeenFreeTrial';
const OPT_OUT_STORAGE_KEY = 'optedOutOfFreeTrialForever';

interface TrialErrorResponse {
  error?: string;
  message?: string;
}

interface NormalizedTrialError {
  status: number;
  statusText: string;
  errorCode: string | null;
  message: string | null;
  rawBody: string | null;
}

async function parseJsonSafely(rawBody: string): Promise<unknown> {
  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return null;
  }
}

function normalizeTrialError(
  response: Response,
  parsedBody: unknown,
  rawBody: string
): NormalizedTrialError {
  const body = (
    parsedBody && typeof parsedBody === 'object' ? parsedBody : {}
  ) as TrialErrorResponse;

  return {
    status: response.status,
    statusText: response.statusText || 'Unknown Error',
    errorCode: typeof body.error === 'string' ? body.error : null,
    message: typeof body.message === 'string' ? body.message : null,
    rawBody: rawBody || null,
  };
}

function toUserErrorMessage(
  error: NormalizedTrialError,
  errorMessages: { trialAlreadyExists: string; loginRequired: string; trialCreationFailed: string }
): string {
  if (
    error.status === 409 &&
    (error.errorCode === 'trial_already_exists' ||
      error.errorCode === 'transition_access_already_exists')
  ) {
    return errorMessages.trialAlreadyExists;
  }

  if (error.status === 401) {
    return errorMessages.loginRequired;
  }

  return errorMessages.trialCreationFailed;
}

// ============================================================================
// Component
// ============================================================================

export function FreeTrialModal({
  isOpen,
  onClose: _onClose,
  onStartTrial,
  onDismissForever,
}: FreeTrialModalProps) {
  const { user, login } = useAuth();
  const { locale } = useGlobalLanguage();
  const content = getFreeTrialModalContent(locale);
  const hasAutoCreateAttemptedRef = useRef(false);
  const [isClosing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCreatingTrial, setIsCreatingTrial] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 로그인 완료 시 자동으로 trial 생성 (모달 오픈당 1회만)
  useEffect(() => {
    if (!isOpen) {
      hasAutoCreateAttemptedRef.current = false;
      return;
    }

    if (!user || isLoggingIn || isCreatingTrial || hasAutoCreateAttemptedRef.current) {
      return;
    }

    hasAutoCreateAttemptedRef.current = true;
    console.log('[FreeTrialModal] User logged in, creating trial');
    void createTrial();
  }, [user, isOpen, isLoggingIn, isCreatingTrial]);

  const createTrial = async () => {
    setIsCreatingTrial(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/access/transition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const rawBody = await response.text();
      const parsedBody = await parseJsonSafely(rawBody);

      if (response.ok) {
        // 성공: localStorage에 "본 적 있음" 표시 (이건 하위 호환성을 위해 유지)
        localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
        console.log('[FreeTrialModal] Transition access created successfully:', parsedBody);
        trackFunnelTransitionAccessStarted({
          entry_point: 'transition_access_modal',
          is_authenticated: true,
        });
        onStartTrial();
      } else {
        const normalizedError = normalizeTrialError(response, parsedBody, rawBody);
        setErrorMessage(toUserErrorMessage(normalizedError, content.errors));
        console.error('[FreeTrialModal] Transition access creation failed:', normalizedError);
      }
    } catch (error) {
      const errorDetails =
        error instanceof Error ? { name: error.name, message: error.message } : { error };
      console.error('[FreeTrialModal] Transition access creation error:', errorDetails);
      setErrorMessage(content.errors.networkError);
    } finally {
      setIsCreatingTrial(false);
    }
  };

  const handleCTA = async () => {
    console.log('[FreeTrialModal] CTA clicked, user:', user ? 'logged in' : 'not logged in');
    trackFunnelPrimaryCtaClick({
      cta_id: user ? 'transition_access_create' : 'transition_access_start',
      cta_label: user ? content.buttons.startTrial : content.buttons.startFree,
      location: 'transition_access_modal',
      destination: user ? '/api/access/transition' : '/auth/login',
      cta_variant: 'free-start',
    });

    if (user) {
      // 이미 로그인된 경우: trial 생성
      hasAutoCreateAttemptedRef.current = true;
      await createTrial();
    } else {
      // 미로그인: Google OAuth 로그인 시작
      setIsLoggingIn(true);
      try {
        await login('google');
        // login()은 리다이렉트를 발생시키므로 여기서는 실행되지 않음
        // 리다이렉트 후 돌아오면 useEffect에서 user 상태 변화를 감지하여 createTrial() 호출
      } catch (error) {
        console.error('[FreeTrialModal] Login failed:', error);
        setIsLoggingIn(false);
      }
    }
  };

  const handleDismissForever = () => {
    console.log('[FreeTrialModal] Dismiss forever clicked');
    try {
      localStorage.setItem(OPT_OUT_STORAGE_KEY, 'true');
    } catch (e) {
      console.error('Failed to save opt-out preference', e);
    }
    onDismissForever();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center p-4 md:left-auto md:right-6 md:bottom-6 md:p-0 pointer-events-none">
      {/* Card */}
      <div
        className={`w-full max-w-[24rem] bg-white rounded-none shadow-xl border border-neutral-200 transition-all duration-300 pointer-events-auto ${
          isClosing ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100 animate-slide-up'
        }`}
      >
        <div className="p-6 sm:p-10 flex flex-col text-left">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 mb-3">
            {content.title.part1}
            <br />
            {content.title.part2}
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-6 sm:mb-8">
            {content.subtitle.line1}
            <br />
            {content.subtitle.line2}
          </p>

          {/* CTA Button */}
          <button
            onClick={handleCTA}
            disabled={isLoggingIn || isCreatingTrial}
            className="w-full inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoggingIn
              ? content.buttons.loggingIn
              : isCreatingTrial
                ? content.buttons.creatingTrial
                : user
                  ? content.buttons.startTrial
                  : content.buttons.startFree}
          </button>

          {/* Error Message */}
          {errorMessage && <p className="text-sm text-red-600 mt-4 font-medium">{errorMessage}</p>}

          {/* Don't show again link */}
          {!errorMessage && (
            <div className="mt-6 text-center">
              <button
                onClick={handleDismissForever}
                className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-widest"
              >
                {content.infoText.dismissForever}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Helper: 유저가 무료 체험 모달 "다시 보지 않기"를 선택했는지 확인
 */
export function hasOptedOutOfFreeTrialModal(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem(OPT_OUT_STORAGE_KEY) === 'true';
}

/**
 * DEPRECATED: use hasOptedOutOfFreeTrialModal instead
 */
export function hasSeenFreeTrialModal(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
}
