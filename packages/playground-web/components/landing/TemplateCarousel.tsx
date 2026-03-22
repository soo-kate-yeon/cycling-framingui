'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '../explore/landing/ScrollReveal';
import { ThemeRecipeCard } from './ThemeRecipeCard';

// ============================================================================
// Types
// ============================================================================

interface TemplateCarouselProps {
  content: {
    title: string;
    subtitle: string;
    copyPromptLabel: string;
  };
  templates: {
    id: string;
    name: string;
    description: string;
    descriptionKo?: string;
    thumbnail?: string;
  }[];
}

// ============================================================================
// TemplateCarousel
// ============================================================================

export function TemplateCarousel({ content, templates }: TemplateCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : templates.length - 1));
  }, [templates.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev < templates.length - 1 ? prev + 1 : 0));
  }, [templates.length]);

  return (
    <section className="py-12 md:py-16 overflow-x-hidden">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-neutral-950">
            {content.title}
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500">{content.subtitle}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        {/* Desktop: horizontal scroll (md and above) */}
        <div
          className="hidden md:flex gap-4 sm:gap-5 overflow-x-auto px-4 sm:px-6 md:px-8 pb-2 scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            touchAction: 'pan-x pan-y',
          }}
        >
          {templates.map((template) => (
            <ThemeRecipeCard
              key={template.id}
              template={template}
              copyPromptLabel={content.copyPromptLabel}
            />
          ))}
        </div>

        {/* Mobile: single-card carousel (below md) */}
        <div className="md:hidden px-4 sm:px-6">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {templates.map((template) => (
                <div key={template.id} className="w-full flex-shrink-0 flex justify-center">
                  <ThemeRecipeCard template={template} copyPromptLabel={content.copyPromptLabel} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation: arrows + dot indicators */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goToPrev}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
              aria-label="Previous template"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {templates.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-full transition-all duration-200 ${
                    index === activeIndex
                      ? 'w-2.5 h-2.5 bg-neutral-900'
                      : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to template ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
              aria-label="Next template"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
