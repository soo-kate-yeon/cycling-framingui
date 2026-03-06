'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@framingui/ui';
import { Footer } from '../shared/Footer';
import { useGlobalLanguage } from '../../contexts/GlobalLanguageContext';
import { getLandingContent } from '../../data/i18n/landing';
import { HeroSection } from './HeroSection';
import { ThemeGallery } from './ThemeGallery';
import { trackFunnelPrimaryCtaClick } from '../../lib/analytics';

export function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale } = useGlobalLanguage();
  const content = getLandingContent(locale);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleNavigateWithTracking = (
    destination: string,
    ctaId: string,
    ctaLabel: string,
    location: string,
    ctaVariant: 'primary' | 'secondary' | 'beta' | 'free-start' = 'primary'
  ) => {
    trackFunnelPrimaryCtaClick({
      cta_id: ctaId,
      cta_label: ctaLabel,
      location,
      destination,
      cta_variant: ctaVariant,
    });
    router.push(destination);
  };

  const handleHeroCtaClick = () => {
    router.push('/explore');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Top Nav Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-neutral-200'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <div
            className="text-xl font-bold tracking-tighter cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {content.nav.brandName || content.hero.brandName}
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() =>
                handleNavigateWithTracking(
                  '/pricing',
                  'home_nav_pricing',
                  content.nav.pricing,
                  'home_top_nav',
                  'secondary'
                )
              }
              className="hidden md:flex h-9 px-4 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200 shadow-sm"
            >
              {content.nav.pricing}
            </Button>
            <Button
              onClick={() =>
                handleNavigateWithTracking(
                  '/docs',
                  'home_nav_docs',
                  content.nav.docs,
                  'home_top_nav',
                  'secondary'
                )
              }
              className="hidden md:flex h-9 px-4 rounded-full text-sm font-medium bg-white text-neutral-900 hover:bg-neutral-100 border border-neutral-200 shadow-sm"
            >
              {content.nav.docs}
            </Button>
            <Button
              onClick={() =>
                handleNavigateWithTracking(
                  '/explore',
                  'home_nav_explore',
                  content.hero.buttons.tryStudio,
                  'home_top_nav',
                  'primary'
                )
              }
              className="h-9 px-4 rounded-full text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
            >
              {content.hero.buttons.tryStudio}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onCtaClick={handleHeroCtaClick} />

      {/* Theme Gallery */}
      <ThemeGallery />

      {/* Footer */}
      <Footer />
    </div>
  );
}
