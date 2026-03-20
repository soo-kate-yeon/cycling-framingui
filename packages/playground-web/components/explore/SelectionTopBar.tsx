/**
 * SelectionTopBar Component
 * Double 패키지 선택 모드에서 상단에 표시되는 sticky 바
 *
 * 선택 상태 표시 + Paddle 체크아웃 연동 + 취소 기능
 */

'use client';

import { X, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { usePaddle } from '../../hooks/usePaddle';
import { PADDLE_CONFIG } from '../../lib/paddle/config';
import { useExploreLanguage } from '../../contexts/ExploreLanguageContext';

// ============================================================================
// Types
// ============================================================================

interface SelectionTopBarProps {
  /** 선택된 템플릿 ID 배열 */
  selectedTemplates: string[];
  /** 선택된 템플릿 이름 배열 */
  selectedNames: string[];
  /** 최대 선택 가능 수 */
  maxSelection: number;
  /** selection mode 해제 콜백 */
  onExit: () => void;
}

// ============================================================================
// i18n
// ============================================================================

const messages = {
  en: {
    selected: (count: number, max: number) => `${count} of ${max} selected`,
    checkout: 'Checkout - $99',
    selectMore: (remaining: number) => `Select ${remaining} more`,
  },
  ko: {
    selected: (count: number, max: number) => `${max}개 중 ${count}개 선택됨`,
    checkout: '결제하기 - $99',
    selectMore: (remaining: number) => `${remaining}개 더 선택하세요`,
  },
};

// ============================================================================
// Component
// ============================================================================

export function SelectionTopBar({
  selectedTemplates,
  selectedNames,
  maxSelection,
  onExit,
}: SelectionTopBarProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openCheckout, isReady: isPaddleReady, notReadyReason } = usePaddle();
  const { locale } = useExploreLanguage();
  const t = locale === 'ko' ? messages.ko : messages.en;
  const paymentNotReadyMessage =
    locale === 'ko'
      ? '결제 시스템을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
      : 'Payment system is not ready. Please try again later.';
  const priceConfigMissingMessage =
    locale === 'ko'
      ? '결제 가격 설정이 누락되었습니다. 관리자에게 문의해 주세요.'
      : 'Price configuration is missing. Please contact support.';

  const isComplete = selectedTemplates.length === maxSelection;
  const remaining = maxSelection - selectedTemplates.length;

  const handleCheckout = () => {
    if (!user) {
      // 미로그인 → 로그인 페이지로 리디렉션 (returnUrl 포함)
      const returnUrl = `/explore?plan=double&selected=${selectedTemplates.join(',')}`;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!isPaddleReady) {
      console.error('[Paddle] Payment system is not ready');
      alert(notReadyReason ?? paymentNotReadyMessage);
      return;
    }

    const priceId = PADDLE_CONFIG.prices.double;
    if (!priceId) {
      console.error('[Paddle] Double price configuration missing');
      alert(priceConfigMissingMessage);
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email || '',
      purchaseKind: 'legacy_template',
      themeId: selectedTemplates.join(','),
      tier: 'double',
      successPath: `/explore?plan=double&checkout=success&selected=${selectedTemplates.join(',')}`,
    });
  };

  return (
    <div className="sticky top-0 z-30 bg-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* 좌측: 선택 상태 */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-white">
            {t.selected(selectedTemplates.length, maxSelection)}
          </span>
          {selectedNames.length > 0 && (
            <span className="text-xs text-neutral-400 truncate">{selectedNames.join(' · ')}</span>
          )}
        </div>

        {/* 우측: CTA + 닫기 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCheckout}
            disabled={!isComplete}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              isComplete
                ? 'bg-white text-neutral-950 hover:bg-neutral-100'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={16} />
            {isComplete ? t.checkout : t.selectMore(remaining)}
          </button>

          <button
            onClick={onExit}
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Exit selection mode"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
