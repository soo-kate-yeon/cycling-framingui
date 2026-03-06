'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { trackFunnelPrimaryCtaClick } from '../../lib/analytics';

interface Theme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

const THEMES: Theme[] = [
  {
    id: 'bold-line',
    name: 'Bold Line',
    description: 'Strong typography with bold dividing lines. Perfect for content-first platforms.',
    thumbnail: '/screenshots/bold-line/hero.png',
  },
  {
    id: 'classic-magazine',
    name: 'Classic Magazine',
    description: 'Timeless editorial layout inspired by print magazines.',
    thumbnail: '/screenshots/classic-magazine/hero.png',
  },
  {
    id: 'dark-boldness',
    name: 'Dark Boldness',
    description: 'High-contrast dark theme with powerful visual hierarchy.',
    thumbnail: '/screenshots/dark-boldness/hero.png',
  },
  {
    id: 'editorial-tech',
    name: 'Editorial Tech',
    description: 'Modern tech aesthetic with editorial sophistication.',
    thumbnail: '/screenshots/editorial-tech/hero.png',
  },
  {
    id: 'minimal-workspace',
    name: 'Minimal Workspace',
    description: 'Clean, focused workspace UI for productivity tools.',
    thumbnail: '/screenshots/minimal-workspace/hero.png',
  },
  {
    id: 'neutral-workspace',
    name: 'Neutral Workspace',
    description: 'Balanced neutral tones for professional applications.',
    thumbnail: '/screenshots/neutral-workspace/hero.png',
  },
  {
    id: 'pebble',
    name: 'Pebble',
    description: 'Soft, rounded design with organic warmth.',
    thumbnail: '/screenshots/pebble/hero.png',
  },
  {
    id: 'square-minimalism',
    name: 'Square Minimalism',
    description: 'Sharp edges and high contrast for modern minimalist interfaces.',
    thumbnail: '/screenshots/square-minimalism/hero.png',
  },
];

interface ThemeCardProps {
  theme: Theme;
  index: number;
  onTryClick: (themeId: string) => void;
}

function ThemeCard({ theme, index, onTryClick }: ThemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackFunnelPrimaryCtaClick({
      cta_id: `home_theme_gallery_try_${theme.id}`,
      cta_label: 'Try this',
      location: 'home_theme_gallery',
      destination: `/explore/${theme.id}`,
      cta_variant: 'secondary',
    });
    onTryClick(theme.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col gap-6 w-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[1440/900] w-full bg-neutral-100 overflow-hidden rounded-2xl transition-all duration-500 group-hover:shadow-lg border border-transparent group-hover:border-neutral-300">
        <img
          src={theme.thumbnail}
          alt={theme.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/5 transition-colors" />

        {/* Try Button */}
        <button
          onClick={handleTryClick}
          className="absolute bottom-4 right-4 px-5 py-2.5 flex items-center gap-2 bg-neutral-950 text-white text-sm font-medium rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-800 shadow-sm"
        >
          Try this
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 relative">
        <h3 className="text-2xl font-bold tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600 pr-8">
          {theme.name}
        </h3>

        <div
          className="relative cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <p
            className="text-base text-neutral-600 leading-relaxed pr-6"
            style={
              isExpanded
                ? undefined
                : {
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }
            }
          >
            {theme.description}
          </p>

          {/* Toggle button */}
          <button
            className="absolute bottom-1 right-0 text-neutral-400 hover:text-neutral-900 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function ThemeGallery() {
  const handleTryClick = (themeId: string) => {
    window.open(`/explore/${themeId}`, '_blank');
  };

  return (
    <section className="container mx-auto px-6 md:px-8 py-24 md:py-32">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16 md:mb-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-neutral-950">
          Explore Themes
        </h2>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Choose from our curated collection of production-ready themes.
        </p>
      </motion.div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {THEMES.map((theme, index) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            index={index}
            onTryClick={handleTryClick}
          />
        ))}
      </div>
    </section>
  );
}
