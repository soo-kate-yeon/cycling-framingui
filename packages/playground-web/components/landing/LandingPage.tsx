'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@framingui/ui';
import { User, Settings, LogOut } from 'lucide-react';
import { Footer } from '../shared/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useGlobalLanguage } from '../../contexts/GlobalLanguageContext';
import { getLandingContent } from '../../data/i18n/landing';
import { HeroSection } from './HeroSection';
import { TemplateGallery } from '../explore/TemplateGallery';
import { ExplorePageClient } from '../explore/ExplorePageClient';
import { ExploreLanguageProvider } from '../../contexts/ExploreLanguageContext';
import { trackFunnelPrimaryCtaClick, trackFunnelHomeEntered } from '../../lib/analytics';

interface Template {
  id: string;
  name: string;
  description: string;
  descriptionKo?: string;
  category: string;
  thumbnail?: string;
  price?: number;
}

interface LandingPageProps {
  templates: Template[];
}

function AvatarDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Button
        onClick={() => router.push('/auth/login')}
        className="h-9 px-4 rounded-full text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm"
      >
        Sign Up
      </Button>
    );
  }

  const initials = (user.email?.[0] || 'U').toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium hover:bg-neutral-700 transition-colors"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-1 z-50">
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-sm font-medium text-neutral-900 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/explore/account');
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <User size={16} />
            Account
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/settings');
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export function LandingPage({ templates }: LandingPageProps) {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale } = useGlobalLanguage();
  const content = getLandingContent(locale);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  // Track home page entry
  useEffect(() => {
    trackFunnelHomeEntered();
  }, []);

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
            <AvatarDropdown />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection
        content={content}
        onCtaClick={() => {
          document.getElementById('theme-gallery')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Theme Gallery - explore TemplateGallery */}
      <div id="theme-gallery" />
      <ExploreLanguageProvider>
        <ExplorePageClient>
          {templates.length > 0 ? (
            <Suspense fallback={<div className="min-h-[400px]" />}>
              <TemplateGallery templates={templates} />
            </Suspense>
          ) : (
            <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12 md:py-16">
              <div className="text-center py-24">
                <p className="text-lg font-medium text-neutral-600 mb-4">No themes found</p>
              </div>
            </div>
          )}
        </ExplorePageClient>
      </ExploreLanguageProvider>

      {/* Footer */}
      <Footer />
    </div>
  );
}
