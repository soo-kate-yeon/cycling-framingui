'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { trackTemplatePromptCopied } from '../../lib/analytics';

export interface ScreenPreset {
  keyword: string;
  theme: string;
  route: string;
  prompt: string;
  copyPrompt: string;
}

export const SCREEN_PRESETS: ScreenPreset[] = [
  {
    keyword: 'trading',
    theme: 'dark-boldness',
    route: '/explore/dark-boldness/trading',
    prompt: 'Build a dark-themed trading interface with real-time charts and order book',
    copyPrompt:
      'Using framingui MCP server with the dark-boldness theme, create a responsive trading interface. Include: price chart with candlestick view, order book with bid/ask depth, trade entry form, active orders table, and a vertical icon nav. Use the screen generation workflow with adaptive layout for desktop grid + mobile hamburger drawer.',
  },
  {
    keyword: 'issue tracker',
    theme: 'minimal-workspace',
    route: '/explore/minimal-workspace/kanban',
    prompt: 'Create a kanban board workspace with task cards, status columns, and filters',
    copyPrompt:
      'Using framingui MCP server with the minimal-workspace theme, create a responsive kanban workspace. Include: multi-column board with To Do / In Progress / Done, draggable task cards with priority labels, top navigation with search, and a calendar sidebar. Use the screen generation workflow with adaptive layout for desktop and tablet breakpoints.',
  },
  {
    keyword: 'solutions',
    theme: 'editorial-tech',
    route: '/explore/editorial-tech/solutions',
    prompt: 'Design a SaaS solutions page with clean typography and feature grid',
    copyPrompt:
      'Using framingui MCP server with the editorial-tech theme, create a responsive SaaS solutions landing page. Include: hero section with headline, trusted-by logos, feature grid with icons, infrastructure section, CTA block, and a minimal footer. Use the screen generation workflow with adaptive layout for desktop grid + mobile single column.',
  },
  {
    keyword: 'magazine',
    theme: 'classic-magazine',
    route: '/explore/classic-magazine/article',
    prompt: 'Design a magazine article page with editorial typography and rich layout',
    copyPrompt:
      'Using framingui MCP server with the classic-magazine theme, create a responsive magazine article page. Include: masthead navigation, hero headline with author byline, full-width imagery, pull quotes, related articles grid, and a newsletter signup section. Use the screen generation workflow with adaptive layout for desktop grid + mobile single column.',
  },
  {
    keyword: 'social feed',
    theme: 'pebble',
    route: '/explore/pebble/feed',
    prompt: 'Design a social feed app with soft rounded cards and bottom tab navigation',
    copyPrompt:
      'Using framingui MCP server with the pebble theme, create a responsive social feed interface. Include: bottom tab navigation (Home, Search, Notifications, Profile), card-based feed with soft rounded corners, trending hashtags sidebar, and suggested users. Use the screen generation workflow with mobile-first adaptive layout.',
  },
];

interface PromptTextboxProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function PromptTextbox({ activeIndex, onSelect }: PromptTextboxProps) {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const charIndex = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const prevIndex = useRef(activeIndex);

  const activePreset = SCREEN_PRESETS[activeIndex]!;

  useEffect(() => {
    if (prevIndex.current !== activeIndex) {
      prevIndex.current = activeIndex;
      setDisplayed('');
      charIndex.current = 0;
      setIsTyping(true);
      setCopied(false);
    }
  }, [activeIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const tick = useCallback(() => {
    charIndex.current++;
    const next = activePreset.prompt.slice(0, charIndex.current);
    setDisplayed(next);

    if (charIndex.current >= activePreset.prompt.length) {
      setIsTyping(false);
    } else {
      timeoutRef.current = setTimeout(tick, 25 + Math.random() * 20);
    }
  }, [activePreset.prompt]);

  useEffect(() => {
    if (!isTyping) {
      return;
    }
    timeoutRef.current = setTimeout(tick, charIndex.current === 0 ? 300 : 0);
    return () => clearTimeout(timeoutRef.current);
  }, [isTyping, tick]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activePreset.copyPrompt);
    setCopied(true);
    trackTemplatePromptCopied({
      template_id: activePreset.theme,
      template_name: activePreset.keyword,
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const lines = displayed ? displayed.match(/.{1,48}/g) || [displayed] : [''];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden border border-neutral-700/50 shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#252526] border-b border-neutral-700/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[11px] text-neutral-500 font-medium">prompt</span>
          </div>
          <div className="w-[46px]" />
        </div>

        {/* Keyword tabs */}
        <div className="flex flex-wrap gap-1.5 px-3 sm:px-4 pt-2.5 pb-2 border-b border-neutral-700/30">
          {SCREEN_PRESETS.map((preset, i) => (
            <button
              key={preset.keyword}
              onClick={() => onSelect(i)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono transition-colors ${
                i === activeIndex
                  ? 'bg-white/10 text-white'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'
              }`}
            >
              {preset.keyword}
            </button>
          ))}
        </div>

        {/* Editor area */}
        <div className="px-3 sm:px-4 py-3 font-mono text-xs sm:text-[13px] leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-6 text-right text-neutral-600 select-none mr-4 text-xs leading-6">
                {i + 1}
              </span>
              <span className="text-[#d4d4d4]">
                {line}
                {i === lines.length - 1 && (
                  <span className="inline-block w-[6px] h-[16px] bg-[#528bff] ml-px align-middle animate-pulse" />
                )}
              </span>
            </div>
          ))}
          {lines.length < 3 &&
            Array.from({ length: 3 - lines.length }).map((_, i) => (
              <div key={`e-${i}`} className="flex">
                <span className="w-6 text-right text-neutral-600 select-none mr-4 text-xs leading-6">
                  {lines.length + i + 1}
                </span>
              </div>
            ))}
        </div>

        {/* Copy prompt — accent color */}
        <div className="px-3 sm:px-4 pb-3 pt-1 border-t border-neutral-700/30">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-[#569cd6] hover:text-[#7cb9f1] text-xs sm:text-sm font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied to clipboard
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy prompt to build this screen
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
