import { useEffect, useRef, useState } from 'react';
import { X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TemplateData } from '../../data/templates';
import { useAuth } from '../../contexts/AuthContext';
import { usePaddle } from '../../hooks/usePaddle';
import { useExploreLanguage } from '../../contexts/ExploreLanguageContext';
import { getExploreContent, getTemplatePriceLabel } from '../../data/i18n/explore';
import { getLocalizedTemplateText } from '../../data/templates';
import { PADDLE_CONFIG } from '../../lib/paddle/config';
import { AlertModal } from '../modals/AlertModal';

// ============================================================================
// Types
// ============================================================================

interface TemplateModalProps {
  template: TemplateData;
  isOpen: boolean;
  onClose: () => void;
  /** Double 패키지 선택 모드 진입 콜백 */
  onSelectDouble?: () => void;
  /** 로그인 후 자동으로 열릴 결제 플로우 */
  autoCheckout?: 'single' | 'creator';
}

// ============================================================================
// Component
// ============================================================================

export function TemplateModal({
  template,
  isOpen,
  onClose,
  onSelectDouble,
  autoCheckout,
}: TemplateModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openCheckout, isReady: isPaddleReady, notReadyReason } = usePaddle();
  const { locale } = useExploreLanguage();
  const i18n = getExploreContent(locale);
  const [activeChipIdx, setActiveChipIdx] = useState(0);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const autoCheckoutFiredRef = useRef(false);
  const paymentNotReadyMessage =
    locale === 'ko'
      ? '결제 시스템을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
      : 'Payment system is not ready. Please try again later.';
  const priceConfigMissingMessage =
    locale === 'ko'
      ? '결제 가격 설정이 누락되었습니다. 관리자에게 문의해 주세요.'
      : 'Price configuration is missing. Please contact support.';

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev === 0 ? template.screenshots.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev === template.screenshots.length - 1 ? 0 : prev + 1));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false); // Reset state after animation
    }, 200); // 200ms matches the duration-200 class
  };

  const redirectToLogin = (returnPath: string) => {
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnPath)}`);
  };

  // 로그인 후 자동 결제창 트리거
  useEffect(() => {
    if (!autoCheckout || !isOpen || !user || !isPaddleReady || autoCheckoutFiredRef.current) {
      return;
    }
    autoCheckoutFiredRef.current = true;

    const tier = autoCheckout;
    const priceId = tier === 'single' ? PADDLE_CONFIG.prices.single : PADDLE_CONFIG.prices.creator;
    if (!priceId) {
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email ?? '',
      purchaseKind: 'legacy_template',
      ...(tier === 'single' ? { themeId: template.id } : {}),
      tier,
      successPath:
        tier === 'single'
          ? `/explore/template/${template.id}?checkout=success`
          : `/explore/template/${template.id}?checkout=success&plan=creator`,
    });
  }, [autoCheckout, isOpen, user, isPaddleReady]);

  const handleSingleCheckout = () => {
    if (!user) {
      redirectToLogin(`/?template=${template.id}&auto_checkout=single`);
      return;
    }

    if (!isPaddleReady) {
      console.error('[Paddle] Payment system is not ready');
      setAlertMessage(notReadyReason ?? paymentNotReadyMessage);
      return;
    }

    const priceId = PADDLE_CONFIG.prices.single;
    if (!priceId) {
      console.error('[Paddle] Single price configuration missing');
      setAlertMessage(priceConfigMissingMessage);
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email ?? '',
      purchaseKind: 'legacy_template',
      themeId: template.id,
      tier: 'single',
      successPath: `/explore/template/${template.id}?checkout=success`,
    });
  };

  const handleCreatorCheckout = () => {
    if (!user) {
      redirectToLogin(`/?template=${template.id}&auto_checkout=creator`);
      return;
    }

    if (!isPaddleReady) {
      console.error('[Paddle] Payment system is not ready');
      setAlertMessage(notReadyReason ?? paymentNotReadyMessage);
      return;
    }

    const priceId = PADDLE_CONFIG.prices.creator;
    if (!priceId) {
      console.error('[Paddle] Creator price configuration missing');
      setAlertMessage(priceConfigMissingMessage);
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email ?? '',
      purchaseKind: 'legacy_template',
      tier: 'creator',
      successPath: `/explore/template/${template.id}?checkout=success&plan=creator`,
    });
  };

  const handleSelectDouble = () => {
    if (onSelectDouble) {
      onSelectDouble();
      return;
    }
    router.push('/explore?plan=double');
  };

  // Body Scroll Lock & Reset State
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false); // Ensure it's false when reopening
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

  // Translation helpers
  const displayTitle = template.name;
  const displayTagline = getLocalizedTemplateText(locale, template.tagline, template.taglineKo);
  const displayDesc = getLocalizedTemplateText(
    locale,
    template.description,
    template.descriptionKo
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-12">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-neutral-950/20 backdrop-blur-sm transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full h-full sm:h-auto max-w-6xl max-h-full bg-white sm:rounded-[24px] shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col duration-200 ${
          isClosing ? 'animate-out fade-out zoom-out-95' : 'animate-in fade-in zoom-in-95'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
          aria-label={i18n.templateModal.closeModalAria}
        >
          <X size={20} />
        </button>

        <div className="p-5 pt-14 sm:p-8 md:p-12 space-y-16 sm:space-y-24">
          {/* ============================================================== */}
          {/* Section 1: Hero (Left / Right) */}
          {/* ============================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-20">
            {/* Block A: Title + Tagline — 1st on both mobile & desktop (left col) */}
            <div className="flex flex-col justify-center py-2 sm:py-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 mb-3 sm:mb-4">
                {displayTitle}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-500 font-medium tracking-tight mb-0 lg:mb-6">
                {displayTagline}
              </p>

              {/* Desktop only: desc + CTAs */}
              <p className="hidden lg:block text-sm sm:text-base text-neutral-600 leading-relaxed mt-6 mb-8 max-w-md">
                {displayDesc}
              </p>
              <div className="hidden lg:block space-y-4">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSingleCheckout}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-950 px-8 py-4 text-white shadow-lg hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <span className="text-sm font-medium opacity-70">
                      {i18n.templateModal.trialCtaPrefix}
                    </span>
                    <span className="text-base font-semibold">
                      {getTemplatePriceLabel(locale, template.price).split(' / ')[0]}/
                      {i18n.templateModal.oneTimePrice}
                    </span>
                  </button>
                  <a
                    href={`/explore/${template.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 gap-2"
                  >
                    {i18n.templateModal.liveDemo} <span className="text-neutral-400">→</span>
                  </a>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSelectDouble}
                    className="group flex items-center gap-3 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors w-fit"
                  >
                    <span className="underline underline-offset-4 whitespace-nowrap">
                      {i18n.templateModal.getTwoTemplates}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-emerald-700 uppercase whitespace-nowrap group-hover:bg-emerald-100 transition-colors shrink-0">
                      {i18n.templateModal.savePercent}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatorCheckout}
                    className="group flex items-center gap-3 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors w-fit"
                  >
                    <span className="underline underline-offset-4 whitespace-nowrap">
                      {i18n.templateModal.getUnlimitedAccess}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-brand-700 uppercase whitespace-nowrap group-hover:bg-brand-100 transition-colors shrink-0">
                      {i18n.templateModal.bestOffer}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Block B: Media — 2nd on mobile (right col on desktop) */}
            <div className="flex flex-col gap-4">
              {/* Simple Carousel */}
              <div className="relative w-full aspect-[1440/900] bg-neutral-100 rounded-2xl border border-neutral-200 overflow-hidden group">
                <img
                  key={currentImageIdx}
                  src={template.screenshots[currentImageIdx]}
                  alt={`${template.name} preview ${currentImageIdx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = document.createElement('div');
                    placeholder.className =
                      'absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-neutral-100 z-0';
                    placeholder.innerHTML = `
                      <span class="text-xs text-neutral-500 uppercase tracking-widest font-medium mb-1">Screenshot ${currentImageIdx + 1}</span>
                      <span class="text-[10px] text-neutral-400">Placeholder</span>
                    `;
                    e.currentTarget.parentElement?.appendChild(placeholder);
                  }}
                />
                {template.screenshots.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-neutral-950 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                      aria-label={i18n.templateModal.previousImageAria}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-neutral-950 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                      aria-label={i18n.templateModal.nextImageAria}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-2 pt-2">
                {template.screenshots.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? 'bg-neutral-900 w-4' : 'bg-neutral-300 hover:bg-neutral-400'}`}
                    aria-label={`${i18n.templateModal.slideAriaPrefix} ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Block C: Desc + CTAs — 3rd on mobile only, hidden on desktop */}
            <div className="lg:hidden flex flex-col gap-6">
              <p className="text-sm text-neutral-600 leading-relaxed">{displayDesc}</p>
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleSingleCheckout}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-neutral-950 px-8 py-4 text-white shadow-lg hover:bg-neutral-800 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                  >
                    <span className="text-sm font-medium opacity-70">
                      {i18n.templateModal.trialCtaPrefix}
                    </span>
                    <span className="text-base font-semibold">
                      {getTemplatePriceLabel(locale, template.price).split(' / ')[0]}/
                      {i18n.templateModal.oneTimePrice}
                    </span>
                  </button>
                  <a
                    href={`/explore/${template.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-sm font-medium text-neutral-950 shadow-sm hover:bg-neutral-50 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 gap-2"
                  >
                    {i18n.templateModal.liveDemo} <span className="text-neutral-400">→</span>
                  </a>
                </div>
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSelectDouble}
                    className="group flex items-center gap-3 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors w-fit"
                  >
                    <span className="underline underline-offset-4 whitespace-nowrap">
                      {i18n.templateModal.getTwoTemplates}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-emerald-700 uppercase whitespace-nowrap group-hover:bg-emerald-100 transition-colors shrink-0">
                      {i18n.templateModal.savePercent}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatorCheckout}
                    className="group flex items-center gap-3 text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors w-fit"
                  >
                    <span className="underline underline-offset-4 whitespace-nowrap">
                      {i18n.templateModal.getUnlimitedAccess}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-bold tracking-widest text-brand-700 uppercase whitespace-nowrap group-hover:bg-brand-100 transition-colors shrink-0">
                      {i18n.templateModal.bestOffer}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-neutral-200" />

          {/* ============================================================== */}
          {/* Section 2: Features & Recommended For */}
          {/* ============================================================== */}
          <section className="space-y-16 sm:space-y-24">
            {/* Features (Checklist style) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-16">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 lg:sticky top-12">
                  {i18n.templateModal.features}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 sm:gap-y-10">
                {template.features.map((feature, idx) => {
                  const fTitle = getLocalizedTemplateText(locale, feature.title, feature.titleKo);
                  const fDesc = getLocalizedTemplateText(
                    locale,
                    feature.description,
                    feature.descriptionKo
                  );
                  return (
                    <div key={idx} className="flex gap-3 sm:gap-4">
                      <div className="mt-1 shrink-0 bg-neutral-100 rounded-full p-1 h-fit">
                        <Check size={16} className="text-neutral-950" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-base font-semibold text-neutral-950 tracking-tight">
                          {fTitle}
                        </h4>
                        <p className="text-sm text-neutral-600 leading-relaxed">{fDesc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended For (Chip style) */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-16">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 lg:sticky top-12">
                  {i18n.templateModal.recommendedToUseFor}
                </h3>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-wrap gap-2">
                  {template.recommendedFor.map((rec, idx) => {
                    const rTitle = getLocalizedTemplateText(locale, rec.title, rec.titleKo);
                    const isActive = idx === activeChipIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveChipIdx(idx)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                          isActive
                            ? 'bg-neutral-950 text-white border-neutral-950'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'
                        }`}
                      >
                        {rTitle}
                      </button>
                    );
                  })}
                </div>

                {/* Active Description */}
                <div className="pt-2">
                  <p className="text-base text-neutral-600 leading-relaxed">
                    {getLocalizedTemplateText(
                      locale,
                      template.recommendedFor[activeChipIdx]?.description ?? '',
                      template.recommendedFor[activeChipIdx]?.descriptionKo
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-neutral-200" />

          {/* ============================================================== */}
          {/* Section 3: How to use */}
          {/* ============================================================== */}
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-16 pb-8 sm:pb-12">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 lg:sticky top-12">
                {i18n.templateLanding.howToUse}
              </h3>
            </div>
            <div className="flex flex-col gap-8 sm:gap-10">
              {template.howToUse.map((step, idx) => {
                const sTitle = getLocalizedTemplateText(locale, step.title, step.titleKo);
                const sDesc = getLocalizedTemplateText(
                  locale,
                  step.description,
                  step.descriptionKo
                );
                return (
                  <div key={idx} className="flex gap-4 sm:gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-sm font-semibold text-neutral-600 group-hover:border-neutral-950 group-hover:text-neutral-950 group-hover:bg-neutral-50 transition-colors shrink-0">
                        {step.step}
                      </div>
                      {idx !== template.howToUse.length - 1 && (
                        <div className="w-px h-full bg-neutral-200 mt-4" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2 pt-1 pb-6 flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-neutral-950 tracking-tight">
                        {sTitle}
                      </h4>
                      <p className="text-base text-neutral-600 leading-relaxed">{sDesc}</p>
                      {step.code && (
                        <pre className="mt-4 p-4 rounded-xl bg-neutral-950 text-neutral-50 text-sm overflow-x-auto font-mono whitespace-pre-wrap break-all sm:break-normal">
                          <code>{step.code}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* Alert Modal — editorial-tech styled, replaces native alert() */}
      <AlertModal
        isOpen={alertMessage !== null}
        onClose={() => setAlertMessage(null)}
        title={locale === 'ko' ? '알림' : 'Notice'}
        message={alertMessage ?? ''}
        variant="warning"
        confirmLabel={locale === 'ko' ? '확인' : 'OK'}
      />
    </div>
  );
}
