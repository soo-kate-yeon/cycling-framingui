/**
 * Pricing Page
 *
 * - Hero + capability cards + pricing cards + comparison + FAQ
 * - 제품 기능과 사용량 모델을 함께 설명
 */

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { Accordion } from '../landing/Accordion';
import { Footer } from '../shared/Footer';
import { useGlobalLanguage } from '../../contexts/GlobalLanguageContext';
import { getPricingContent } from '../../data/i18n/pricing';
import { useAuth } from '../../contexts/AuthContext';
import { usePaddle } from '../../hooks/usePaddle';
import { PADDLE_CONFIG } from '../../lib/paddle/config';

/* ─── 애니메이션 ─── */
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── 데이터 ─── */
const PRICING_SECTION_SHELL = 'max-w-6xl mx-auto px-6 md:px-8';

const PLANS = [
  {
    id: 'free',
    name: 'Free Quota',
    description: 'Learn the product and inspect the workflow before paying.',
    price: 0,
    priceLabel: '$0',
    priceSub: 'shadow visibility',
    cta: 'Start Free',
    ctaHref: '/#theme-gallery',
    featured: false,
    badge: null,
    features: [
      'Explore MCP tools and package surfaces',
      'Preview components, templates, and themes',
      'Inspect usage visibility in `whoami`',
      'Start with guided onboarding',
    ],
  },
  {
    id: 'developer',
    name: 'Developer',
    description: 'For solo developers shipping real product UI with FramingUI.',
    price: 39,
    priceLabel: '$39',
    priceSub: '/month',
    cta: 'Subscribe to Developer',
    ctaHref: '/pricing',
    featured: true,
    badge: 'Most Popular',
    features: [
      '2,000 weighted tool units / month',
      'Component, template, and theme discovery',
      'Screen-generation context and validated workflow',
      'Environment checks and code-audit guidance',
      'Email support (72h)',
      'Top-up support when usage spikes',
    ],
  },
] as const;

/* ─── 컴포넌트 ─── */
export function PricingPage() {
  const router = useRouter();
  const { locale } = useGlobalLanguage();
  const content = getPricingContent(locale);
  const { user } = useAuth();
  const { openCheckout, isReady: isPaddleReady, notReadyReason } = usePaddle();

  const handleFreeAccess = () => {
    router.push('/#theme-gallery');
  };

  const handleQuotaCheckout = (planId: 'developer') => {
    if (!user) {
      const returnUrl = '/pricing';
      router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!isPaddleReady) {
      console.error('[Paddle] Payment system is not ready');
      alert(notReadyReason ?? content.ui.paymentNotReady);
      return;
    }

    const priceId = PADDLE_CONFIG.quotaPrices.developerMonthly;

    if (!priceId) {
      console.error('[Paddle] Price configuration missing for plan:', planId);
      alert(content.ui.priceConfigMissing);
      return;
    }

    openCheckout({
      priceId,
      userId: user.id,
      userEmail: user.email || '',
      purchaseKind: 'plan',
      planId,
      successPath: `/pricing?checkout=success&plan=${planId}`,
    });
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* 네비게이션 */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className={`${PRICING_SECTION_SHELL} h-16 flex items-center justify-between`}>
          <button
            onClick={() => router.push('/')}
            className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity"
          >
            {content.nav.brandName}
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/#theme-gallery')}
              className="h-9 px-5 rounded-full text-sm font-medium bg-neutral-950 text-white hover:bg-neutral-800 transition-colors"
            >
              {content.nav.getStarted}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <FadeIn className={`${PRICING_SECTION_SHELL} text-center`}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
            {content.hero.title}
          </h1>
          <p className="mx-auto max-w-3xl text-base md:text-lg leading-7 text-neutral-500">
            {content.quota.description}
          </p>
        </FadeIn>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 md:pb-28">
        <div className={`${PRICING_SECTION_SHELL} grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {(['free', 'developer'] as const).map((planId, index) => {
            const planContent = content.plans[planId];
            const planData = PLANS.find((p) => p.id === planId)!;

            return (
              <FadeIn key={planId} delay={index * 0.1} className="h-full">
                <div
                  className={`relative flex flex-col h-full p-6 md:p-8 rounded-[28px] border bg-white transition-shadow hover:shadow-sm ${
                    planData.featured
                      ? 'border-neutral-950 shadow-[0_8px_24px_rgba(17,24,39,0.06)]'
                      : 'border-neutral-200'
                  }`}
                >
                  {/* 배지 */}
                  {planData.badge && (
                    <div
                      className={`absolute -top-3 left-6 px-3 py-1 text-xs font-semibold rounded-full ${
                        planData.featured
                          ? 'bg-neutral-950 text-white'
                          : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}
                    >
                      {planData.badge === 'Most Popular' && (
                        <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                      )}
                      {'badge' in planContent && planContent.badge}
                    </div>
                  )}

                  {/* 상단 고정 영역: 플랜 이름 + 설명 + 가격 */}
                  <div className="mb-6">
                    {/* 플랜 이름 + 설명 */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">{planContent.name}</h3>
                    <p className="text-sm text-neutral-500 mb-6">{planContent.description}</p>

                    {/* 가격 */}
                    <div className="min-h-[60px] flex items-end">
                      <div className="w-full">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
                            {planContent.priceLabel}
                          </span>
                          <span className="text-sm text-neutral-500">{planContent.priceSub}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 중간 확장 영역: 구분선 + 기능 목록 */}
                  <div className="flex-1 flex flex-col mb-6">
                    {/* 구분선 */}
                    <div className="border-t border-neutral-100 mb-6" />

                    {/* 기능 목록 */}
                    <ul className="space-y-3">
                      {planContent.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-neutral-900 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-neutral-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 하단 고정 영역: 버튼 + ROSCA 고지 */}
                  <div className="mt-auto">
                    {/* CTA 버튼 */}
                    <button
                      onClick={() => {
                        if (planId === 'free') {
                          handleFreeAccess();
                        } else {
                          handleQuotaCheckout(planId);
                        }
                      }}
                      className={`w-full py-3 px-6 rounded-full text-sm font-semibold transition-colors mb-3 flex items-center justify-center gap-2 ${
                        planData.featured
                          ? 'bg-neutral-950 text-white hover:bg-neutral-800'
                          : 'bg-neutral-100 text-neutral-950 hover:bg-neutral-200'
                      }`}
                    >
                      {planContent.cta}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* ROSCA 자동갱신 고지 */}
                    {'renewalNotice' in planContent && planContent.renewalNotice && (
                      <p className="text-xs text-neutral-400 text-center min-h-[32px]">
                        {planContent.renewalNotice}
                      </p>
                    )}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 md:py-24">
        <div className={PRICING_SECTION_SHELL}>
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              {content.comparison.title}
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px] [&_tr>*:last-child]:pr-6 [&_tr>*:first-child]:pl-6">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-4 pr-4 font-medium text-neutral-500 w-[35%]">
                      {content.comparison.tableHeaders.feature}
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">
                      {content.comparison.tableHeaders.free}
                    </th>
                    <th className="text-center py-4 px-4 font-bold text-neutral-900">
                      <span className="inline-flex items-center gap-1">
                        {content.comparison.tableHeaders.developer}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Included usage */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.includedUnits}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.includedUnits}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.includedUnits}
                      </span>
                    </td>
                  </tr>

                  {/* Discovery tools */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.discoveryTools}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.discoveryTools}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.discoveryTools}
                      </span>
                    </td>
                  </tr>

                  {/* Workflow guidance */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.workflowGuidance}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.workflowGuidance}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.workflowGuidance}
                      </span>
                    </td>
                  </tr>

                  {/* Environment checks */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.environmentChecks}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.environmentChecks}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.environmentChecks}
                      </span>
                    </td>
                  </tr>

                  {/* Usage visibility */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.usageVisibility}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.usageVisibility}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.usageVisibility}
                      </span>
                    </td>
                  </tr>

                  {/* Top-ups */}
                  <tr className="border-b border-neutral-100">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.topUps}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.topUps}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.topUps}
                      </span>
                    </td>
                  </tr>

                  {/* Support */}
                  <tr className="border-b border-neutral-100 last:border-none">
                    <td className="py-4 pr-4 text-neutral-700">
                      {content.comparison.features.support}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.free.support}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-neutral-700 font-medium">
                        {content.comparison.values.developer.support}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <FadeIn className={PRICING_SECTION_SHELL}>
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-4">
              <h2 className="text-3xl font-bold tracking-tight mb-4">{content.faq.title}</h2>
              <p className="text-lg text-neutral-500">{content.faq.subtitle}</p>
            </div>
            <div className="md:col-span-8">
              <Accordion items={content.faq.items} allowMultiple />
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
