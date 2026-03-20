/**
 * Template Landing Page (Redesigned)
 *
 * Framer.com 마켓플레이스 스타일 랜딩 페이지
 * - Hero: 템플릿 이름 + 3개 버튼 (Preview, Buy for $XX, Documentation)
 * - 2x2 이미지 그리드 (대표 화면 4개)
 * - Features 섹션
 * - Recommended to use for 섹션
 * - How to use 섹션
 * - Footer 제거
 * - Framer Motion 스크롤 애니메이션 (Subtle)
 * - Mobile-optimized responsive design
 * - i18n support (en/ko)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { ScrollReveal } from '../../../../components/explore/landing';
import { CodeBlock } from '../../../../components/explore/landing/CodeBlock';
import {
  getTemplateData,
  getLocalizedTemplateText,
  type TemplateData,
} from '../../../../data/templates';
import { useAuth } from '../../../../contexts/AuthContext';
import { usePaddle } from '../../../../hooks/usePaddle';
import { PADDLE_CONFIG } from '../../../../lib/paddle/config';
import { useExploreLanguage } from '../../../../contexts/ExploreLanguageContext';
import {
  getExploreContent,
  getTemplateBuyLabel,
  getTemplateFinalCtaDescription,
} from '../../../../data/i18n/explore';

interface TemplatePageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateLandingPage({ params }: TemplatePageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { openCheckout, isReady: isPaddleReady, notReadyReason } = usePaddle();
  const { locale } = useExploreLanguage();
  const i18n = getExploreContent(locale);
  const [templateId, setTemplateId] = useState<string>('');
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const paymentNotReadyMessage =
    locale === 'ko'
      ? '결제 시스템을 아직 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.'
      : 'Payment system is not ready. Please try again later.';
  const priceConfigMissingMessage =
    locale === 'ko'
      ? '결제 가격 설정이 누락되었습니다. 관리자에게 문의해 주세요.'
      : 'Price configuration is missing. Please contact support.';

  // Next.js 16: params is a Promise
  useEffect(() => {
    params.then((p) => {
      setTemplateId(p.id);
      const data = getTemplateData(p.id);
      setTemplate(data);
    });
  }, [params]);

  const handlePreviewClick = () => {
    // Open demo in new window
    window.open(`/explore/${templateId}`, '_blank');
  };

  const handleBuyClick = () => {
    if (!user) {
      const returnUrl = `/explore/template/${templateId}`;
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!isPaddleReady) {
      console.error('[Paddle] Payment system is not ready');
      alert(notReadyReason ?? paymentNotReadyMessage);
      return;
    }

    const priceId = PADDLE_CONFIG.prices.single;
    if (!priceId) {
      console.error('[Paddle] Single price configuration missing');
      alert(priceConfigMissingMessage);
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email ?? '',
      purchaseKind: 'legacy_template',
      themeId: templateId,
      tier: 'single',
      successPath: `/explore/template/${templateId}?checkout=success`,
    });
  };

  const handleDocumentationClick = () => {
    // Navigate to template documentation page
    router.push(`/explore/${templateId}/docs`);
  };

  // Loading state
  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-sm text-neutral-600">{i18n.templateLanding.loadingTemplate}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              {/* Template Name */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-neutral-900 mb-4 sm:mb-6">
                {template.name}
              </h1>

              {/* Description (통합된 소개글) */}
              <p className="text-base sm:text-lg text-neutral-700 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
                {getLocalizedTemplateText(locale, template.description, template.descriptionKo)}
              </p>

              {/* CTA Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                <button
                  type="button"
                  onClick={handlePreviewClick}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded-lg flex items-center justify-center gap-2"
                >
                  {i18n.templateLanding.preview}
                  <ExternalLink size={14} />
                </button>

                <button
                  type="button"
                  onClick={handleBuyClick}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 transition-colors rounded-lg"
                >
                  {getTemplateBuyLabel(locale, template.price)}
                </button>

                <button
                  type="button"
                  onClick={handleDocumentationClick}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-wider text-neutral-900 bg-white border border-neutral-300 hover:border-neutral-900 transition-colors rounded-lg"
                >
                  {i18n.templateLanding.guide}
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Image Grid Section (2x2) - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {template.screenshots.slice(0, 4).map((screenshot, index) => (
                <div
                  key={index}
                  className="aspect-video bg-neutral-200 rounded-lg overflow-hidden border border-neutral-300"
                >
                  <img
                    src={screenshot}
                    alt={`${template.name} screenshot ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder on error
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-neutral-100">
                          <span class="text-xs text-neutral-400 uppercase tracking-wider">Screenshot ${index + 1}</span>
                        </div>
                      `;
                    }}
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section - Landing Page Style */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0.2}>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-900 mb-8 sm:mb-12 text-center">
              {i18n.templateLanding.features}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
            {template.features.map((feature, index) => (
              <ScrollReveal key={index} delay={0.25 + index * 0.05}>
                <div className="space-y-3 sm:space-y-4">
                  {/* Icon/Number Indicator */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white font-bold text-lg">
                    {feature.icon}
                  </div>

                  {/* Title - Bold, Prominent */}
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                    {getLocalizedTemplateText(locale, feature.title, feature.titleKo)}
                  </h3>

                  {/* Subtitle - 1 Sentence Tagline */}
                  <p className="text-base sm:text-lg font-medium text-neutral-700 leading-snug">
                    {getLocalizedTemplateText(locale, feature.subtitle, feature.subtitleKo)}
                  </p>

                  {/* Body Text - 2-3 Sentences Detailed Explanation */}
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {getLocalizedTemplateText(locale, feature.description, feature.descriptionKo)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended to use for Section - Structured Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0.3}>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-900 mb-8 sm:mb-12 text-center">
              {i18n.templateLanding.recommendedToUseFor}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {template.recommendedFor.map((useCase, index) => (
              <ScrollReveal key={index} delay={0.35 + index * 0.05}>
                <div className="p-6 bg-white border border-neutral-200 rounded-xl space-y-3">
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 leading-tight">
                    {getLocalizedTemplateText(locale, useCase.title, useCase.titleKo)}
                  </h3>

                  {/* Description - Why this template is good for this use case */}
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    {getLocalizedTemplateText(locale, useCase.description, useCase.descriptionKo)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to use Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal delay={0.4}>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-900 mb-8 sm:mb-12">
              {i18n.templateLanding.howToUse}
            </h2>
          </ScrollReveal>

          <div className="space-y-6 sm:space-y-8">
            {template.howToUse.map((step, index) => (
              <ScrollReveal key={index} delay={0.45 + index * 0.05}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Step Number - Mobile Optimized */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-base sm:text-lg">
                      {step.step}
                    </div>
                  </div>

                  {/* Step Content - Mobile Optimized */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                      {getLocalizedTemplateText(locale, step.title, step.titleKo)}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 mb-3 sm:mb-4">
                      {getLocalizedTemplateText(locale, step.description, step.descriptionKo)}
                    </p>

                    {step.code && (
                      <div className="overflow-x-auto">
                        <CodeBlock code={step.code} language="bash" />
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-neutral-50 border-t border-neutral-100">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal delay={0.5}>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-neutral-900 mb-4 sm:mb-6">
              {i18n.templateLanding.readyToStart}
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mb-6 sm:mb-8 px-2">
              {getTemplateFinalCtaDescription(
                locale,
                template.name,
                i18n.templateLanding.finalCtaDescriptionSuffix
              )}
            </p>
            <button
              type="button"
              onClick={handleBuyClick}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 transition-colors rounded"
            >
              {getTemplateBuyLabel(locale, template.price)}
            </button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
