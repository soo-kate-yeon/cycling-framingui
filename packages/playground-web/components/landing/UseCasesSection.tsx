'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PromptTextbox, SCREEN_PRESETS } from './PromptTextbox';
import { trackHeroDemoPromptSubmitted } from '../../lib/analytics';

interface UseCasesSectionProps {
  content: {
    title: string;
    subtitle: string;
  };
}

export function UseCasesSection({ content }: UseCasesSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const activePreset = SCREEN_PRESETS[activeIndex]!;

  useEffect(() => {
    setIframeLoaded(false);
  }, [activeIndex]);

  const handleSelect = (index: number) => {
    if (index === activeIndex) {
      return;
    }
    setActiveIndex(index);
    const preset = SCREEN_PRESETS[index]!;
    trackHeroDemoPromptSubmitted({ prompt: preset.prompt, theme: preset.theme });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
          {content.title}
        </h2>
        <p className="mt-1.5 text-sm text-neutral-500">{content.subtitle}</p>
      </motion.div>

      {/* Row 1: IDE textbox */}
      <div className="mb-4 sm:mb-5">
        <PromptTextbox activeIndex={activeIndex} onSelect={handleSelect} />
      </div>

      {/* Row 2: Screen view — full width */}
      <motion.div
        key={activePreset.theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-lg bg-neutral-50 aspect-[2/3] sm:aspect-[3/4] md:aspect-[16/10]"
      >
        {!iframeLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-300 border-t-neutral-600 animate-spin" />
          </div>
        )}
        <iframe
          src={`${activePreset.route}?embed=true`}
          className={`w-full h-full border-0 transition-opacity duration-500 ${
            iframeLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          title={activePreset.keyword}
          onLoad={() => setIframeLoaded(true)}
        />
      </motion.div>
    </section>
  );
}
