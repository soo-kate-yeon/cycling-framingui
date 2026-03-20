/**
 * Docs Layout
 * Editorial Tech theme - airy, typography-first, grayscale
 * Mobile: Top nav with hamburger menu
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Book,
  Rocket,
  Download,
  Cpu,
  Box,
  Layers,
  Palette,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { FreeTrialBanner } from '@/components/shared/FreeTrialBanner';
import { trackFunnelPrimaryCtaClick } from '@/lib/analytics';

const NAV_ITEMS = [
  { href: '/docs', label: 'Overview', icon: Book },
  { href: '/docs/quick-start', label: 'Quick Start', icon: Rocket },
  { href: '/docs/installation', label: 'Installation', icon: Download },
  { href: '/docs/components', label: 'Components', icon: Layers },
  { href: '/docs/themes', label: 'Theme Guides', icon: Palette },
  { href: '/docs/api', label: 'API Reference', icon: Box },
  { href: '/docs/mcp', label: 'MCP Integration', icon: Cpu },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const trackDocsCta = (
    ctaId: string,
    ctaLabel: string,
    location: string,
    destination: string,
    ctaVariant: 'primary' | 'secondary' | 'beta' | 'free-start'
  ) => {
    trackFunnelPrimaryCtaClick({
      cta_id: ctaId,
      cta_label: ctaLabel,
      location,
      destination,
      cta_variant: ctaVariant,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Beta Banner */}
      <FreeTrialBanner />

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50 flex items-center justify-between px-6">
        <Link href="/docs" onClick={closeMobileMenu} className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-neutral-900">
            framingui<span className="text-neutral-400">/docs</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-neutral-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 bg-white/95 backdrop-blur-md transition-all duration-300 overflow-hidden flex flex-col ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex-1 px-6 py-8 overflow-y-auto">
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile CTA */}
        <div className="p-6 border-t border-neutral-200 space-y-3">
          <Link
            href="https://tally.so/r/7R2kz6"
            target="_blank"
            onClick={() => {
              trackDocsCta(
                'docs_mobile_beta_access',
                'Get Beta Access',
                'docs_mobile_menu',
                'https://tally.so/r/7R2kz6',
                'beta'
              );
              closeMobileMenu();
            }}
            className="block w-full text-center py-3 px-4 bg-neutral-900 text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
          >
            Get Beta Access
          </Link>
          <Link
            href="/#theme-gallery"
            onClick={() => {
              trackDocsCta(
                'docs_mobile_open_theme_gallery',
                'Open Theme Gallery',
                'docs_mobile_menu',
                '/#theme-gallery',
                'primary'
              );
              closeMobileMenu();
            }}
            className="block w-full text-center py-3 px-4 border border-neutral-300 text-neutral-700 rounded-full font-medium hover:bg-neutral-100 transition-colors"
          >
            Open Theme Gallery
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden md:block border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/docs" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight text-neutral-900">
              framingui<span className="text-neutral-400">/docs</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="https://tally.so/r/7R2kz6"
              target="_blank"
              onClick={() =>
                trackDocsCta(
                  'docs_desktop_beta_access',
                  'Get Beta Access',
                  'docs_desktop_header',
                  'https://tally.so/r/7R2kz6',
                  'beta'
                )
              }
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Get Beta Access
            </Link>
            <Link
              href="/#theme-gallery"
              onClick={() =>
                trackDocsCta(
                  'docs_desktop_open_theme_gallery',
                  'Open Theme Gallery',
                  'docs_desktop_header',
                  '/#theme-gallery',
                  'primary'
                )
              }
              className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Open Theme Gallery
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-65px)] p-6 sticky top-[65px]">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-neutral-100 text-neutral-900'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 ${isActive ? 'text-neutral-700' : 'text-neutral-400 group-hover:text-neutral-600'}`}
                  />
                  {item.label}
                  <ChevronRight
                    className={`w-3 h-3 ml-auto transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  />
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 md:px-12 py-10 pt-24 md:pt-10">
          <article className="prose prose-neutral max-w-3xl">{children}</article>
        </main>
      </div>
    </div>
  );
}
