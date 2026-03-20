'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalLanguage } from '@/contexts/GlobalLanguageContext';
import { getFreeTrialBannerContent } from '@/data/i18n/freeTrialBanner';
import { trackFunnelPrimaryCtaClick } from '@/lib/analytics';

interface FreeTrialBannerProps {
  onStartFreeTrial?: () => void;
}

export function FreeTrialBanner({ onStartFreeTrial }: FreeTrialBannerProps) {
  const router = useRouter();
  const { locale } = useGlobalLanguage();
  const content = getFreeTrialBannerContent(locale);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={(el) => {
        if (el) {
          const h = el.getBoundingClientRect().height;
          document.documentElement.style.setProperty('--banner-h', `${h}px`);
        }
      }}
      className="sticky top-0 z-40 relative animate-gradient-vibrant text-white overflow-hidden shadow-sm"
    >
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center gap-6 text-sm sm:text-base">
          <p className="font-medium tracking-tight opacity-95">{content.label}</p>
          <button
            onClick={() => {
              trackFunnelPrimaryCtaClick({
                cta_id: 'transition_access_banner',
                cta_label: content.cta,
                location: 'top_banner',
                destination: '/#theme-gallery',
                cta_variant: 'free-start',
              });
              if (onStartFreeTrial) {
                onStartFreeTrial();
              } else {
                router.push('/#theme-gallery');
              }
            }}
            className="inline-flex items-center px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-white text-neutral-900 hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            {content.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
