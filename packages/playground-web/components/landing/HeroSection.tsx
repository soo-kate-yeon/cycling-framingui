'use client';

import { motion } from 'framer-motion';
import { Button } from '@framingui/ui';
import { trackFunnelPrimaryCtaClick } from '../../lib/analytics';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const handleCtaClick = () => {
    trackFunnelPrimaryCtaClick({
      cta_id: 'home_hero_try_free',
      cta_label: 'Try Free',
      location: 'home_hero',
      destination: '/explore',
      cta_variant: 'primary',
    });
    onCtaClick?.();
  };

  return (
    <section className="container mx-auto px-6 md:px-8 pt-40 pb-24 md:pt-[240px] md:pb-40 text-center max-w-6xl">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl sm:text-7xl md:text-[90px] font-bold mb-8 md:mb-12 leading-[1.05] tracking-tighter text-neutral-950"
      >
        UI Kit for Agents
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-xl md:text-[28px] text-neutral-600 mb-12 md:mb-16 max-w-4xl mx-auto leading-relaxed tracking-tight"
      >
        Beautiful themes your AI can actually use. No hallucinations.
      </motion.p>

      {/* Demo GIF Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 max-w-5xl mx-auto"
      >
        <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl shadow-2xl flex items-center justify-center border border-neutral-300">
          <div className="text-neutral-400 font-medium text-lg">
            Demo GIF Placeholder
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <Button
          onClick={handleCtaClick}
          className="h-14 md:h-16 px-8 md:px-12 rounded-full text-lg md:text-xl font-medium bg-neutral-900 text-white hover:bg-neutral-800 hover:scale-105 transition-all shadow-xl"
        >
          Try Free
        </Button>
        <p className="text-sm md:text-base text-neutral-500 font-medium">
          No credit card required
        </p>
      </motion.div>
    </section>
  );
}
