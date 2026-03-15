'use client';

/**
 * TrialLaunchModal
 *
 * 랜딩 히어로 "3일 무료체험" CTA 클릭 후 표시되는 모달.
 * Step 1: 템플릿 선택 (하나만 가능)
 * Step 2: 확인 → POST /api/licenses/trial → 성공 시 onActivated 호출
 *
 * editorial-tech 테마 적용:
 * - rounded-2xl 모달 컨테이너
 * - rounded-full 필 버튼
 * - 고정 width/height
 * - 반응형 최적화
 */

import { useEffect, useState } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { useGlobalLanguage } from '../../contexts/GlobalLanguageContext';
import { trackFunnelFreeTrialStarted, trackFunnelPrimaryCtaClick } from '../../lib/analytics';

interface Template {
  id: string;
  name: string;
  thumbnail?: string;
}

interface TrialLaunchModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  /** 체험 활성화 성공 시 선택된 templateId 전달 */
  onActivated: (templateId: string, templateName: string) => void;
}

const CONTENT = {
  en: {
    title: 'Start Your 3-Day Free Trial',
    subtitle: 'Pick one template to try for free.',
    notice: 'Free trial is limited to 1 template. Choose carefully.',
    step2Title: 'Start free trial with this template?',
    step2Desc: (name: string) =>
      `You'll get full access to "${name}" for 3 days. This is a one-time offer.`,
    selectBtn: 'Next',
    confirmBtn: 'Start Free Trial',
    back: 'Back',
    activating: 'Activating\u2026',
    errorAlready: 'You have already used your free trial.',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  ko: {
    title: '3일 무료체험 시작하기',
    subtitle: '체험할 템플릿 하나를 선택해주세요.',
    notice: '무료체험은 템플릿 1개에 대해서만 가능해요. 신중하게 선택해주세요.',
    step2Title: '이 템플릿으로 무료체험을 시작할까요?',
    step2Desc: (name: string) =>
      `"${name}"을 3일간 무료로 사용할 수 있어요. 무료체험은 1회만 제공됩니다.`,
    selectBtn: '다음',
    confirmBtn: '무료체험 시작',
    back: '뒤로',
    activating: '활성화 중\u2026',
    errorAlready: '이미 무료체험을 사용하셨어요.',
    errorGeneric: '오류가 발생했어요. 다시 시도해주세요.',
  },
};

export function TrialLaunchModal({
  isOpen,
  onClose,
  templates,
  onActivated,
}: TrialLaunchModalProps) {
  const { locale } = useGlobalLanguage();
  const c = CONTENT[locale];
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedTemplate = templates.find((t) => t.id === selectedId);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setStep('select');
      setSelectedId(null);
      setError(null);
      setIsClosing(false);
      onClose();
    }, 150);
  };

  const handleConfirm = async () => {
    if (!selectedTemplate) {
      return;
    }
    setIsActivating(true);
    setError(null);

    try {
      const res = await fetch('/api/licenses/trial', { method: 'POST' });
      if (res.ok) {
        // 무료체험 시작 트래킹
        trackFunnelFreeTrialStarted({
          entry_point: 'trial_launch_modal',
          is_authenticated: true,
        });
        trackFunnelPrimaryCtaClick({
          cta_id: 'free_trial_confirm',
          cta_label: c.confirmBtn,
          location: 'trial_launch_modal',
          destination: `/explore/${selectedTemplate.id}`,
          cta_variant: 'free-start',
        });
        onActivated(selectedTemplate.id, selectedTemplate.name);
        handleClose();
      } else {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (res.status === 409 || body.error === 'trial_already_exists') {
          setError(c.errorAlready);
        } else {
          setError(c.errorGeneric);
        }
      }
    } catch {
      setError(c.errorGeneric);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay — editorial-tech: bg-black/80 backdrop-blur-sm */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-150 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal — editorial-tech: 고정 크기 */}
      <div
        className={`relative z-10 bg-white border border-neutral-200 rounded-2xl shadow-2xl
          w-full
          sm:w-[460px]
          md:w-[500px]
          flex flex-col overflow-hidden transition-all duration-150
          ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'}`}
      >
        {/* Close — editorial-tech: rounded-none 스타일 유지하되 버튼은 pill */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-950 transition-colors z-10"
          aria-label="Close"
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {step === 'select' ? (
          <div className="flex flex-col p-6 sm:p-8">
            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 mb-1 pr-8">
              {c.title}
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-5">{c.subtitle}</p>

            {/* Notice — 정렬 수정: 수직 center, 아이콘 고정 크기 */}
            <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 mb-6">
              <AlertTriangle size={16} className="shrink-0 text-neutral-500" />
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{c.notice}</p>
            </div>

            {/* Template list — 고정 높이 스크롤 영역 */}
            <div className="flex flex-col gap-1.5 max-h-[240px] sm:max-h-[280px] overflow-y-auto mb-6">
              {templates.map((t) => {
                const isSelected = selectedId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border transition-colors ${
                      isSelected
                        ? 'border-neutral-950 bg-neutral-950 text-white'
                        : 'border-neutral-200 bg-white hover:border-neutral-400 text-neutral-950'
                    }`}
                  >
                    <span className="flex-1 text-sm font-medium truncate">{t.name}</span>
                    {isSelected && <Check size={16} className="shrink-0 text-white" />}
                  </button>
                );
              })}
            </div>

            {/* CTA — editorial-tech: rounded-full 필 버튼 */}
            <button
              onClick={() => setStep('confirm')}
              disabled={!selectedId}
              className="w-full inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {c.selectBtn}
            </button>
          </div>
        ) : (
          <div className="flex flex-col p-6 sm:p-8">
            {/* Header */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-950 mb-3 pr-8">
              {c.step2Title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-500 leading-relaxed mb-8">
              {c.step2Desc(selectedTemplate?.name ?? '')}
            </p>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 border border-red-200 bg-red-50 rounded-xl px-4 py-3 mb-6">
                <AlertTriangle size={16} className="shrink-0 text-red-500" />
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirm}
                disabled={isActivating}
                className="w-full inline-flex items-center justify-center rounded-full bg-neutral-950 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActivating ? c.activating : c.confirmBtn}
              </button>
              <button
                onClick={() => {
                  setStep('select');
                  setError(null);
                }}
                className="w-full inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 transition-colors"
              >
                {c.back}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
