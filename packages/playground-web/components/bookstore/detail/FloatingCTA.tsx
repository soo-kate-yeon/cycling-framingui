'use client';

import { useEffect, useState } from 'react';

interface FloatingCTAProps {
  price: string;
}

export function FloatingCTA({ price }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA when scrolled more than 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <>
      {/* Mobile: Full-width bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--atomic-semantic-background-surface-default)]/95 backdrop-blur-md border-t border-[var(--atomic-semantic-border-default-subtle)] shadow-2xl animate-slide-up">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[var(--atomic-semantic-text-secondary)]">Price</p>
            <p className="text-xl font-bold text-[var(--atomic-semantic-text-brand)]">{price}</p>
          </div>
          <button className="flex-1 max-w-[200px] px-6 py-3 bg-[var(--atomic-semantic-text-brand)] text-white font-semibold rounded-[var(--atomic-radius-full)] hover:opacity-90 transition-opacity shadow-lg min-h-[56px]">
            View Access
          </button>
        </div>
        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      {/* Desktop: Bottom-right pill button */}
      <div className="hidden md:block fixed bottom-8 right-8 z-40 animate-slide-up">
        <button className="px-8 py-4 bg-[var(--atomic-semantic-text-brand)] text-white font-semibold rounded-[var(--atomic-radius-full)] hover:opacity-90 transition-all shadow-2xl flex items-center gap-3 hover:scale-105">
          <span className="text-lg">{price}</span>
          <span className="text-2xl">→</span>
          <span>View Access</span>
        </button>
      </div>
    </>
  );
}
