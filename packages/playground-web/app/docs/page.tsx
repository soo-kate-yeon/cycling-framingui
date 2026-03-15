/**
 * Docs Landing Page
 */

import Link from 'next/link';
import { Rocket, Download, Cpu, Palette, SwatchBook } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation | framingui',
  description: 'The agentic design system. 0% hallucination, production-ready UI.',
  openGraph: {
    title: 'Documentation | framingui',
    description: 'The agentic design system. 0% hallucination, production-ready UI.',
    url: 'https://framingui.com/docs',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FramingUI - Agent-First Design System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Documentation | framingui',
    description: 'The agentic design system. 0% hallucination, production-ready UI.',
    images: ['/og-image.png'],
  },
};

const CARDS = [
  {
    href: '/docs/quick-start',
    icon: Rocket,
    title: 'Quick Start',
    description: 'Get up and running in 5 minutes',
  },
  {
    href: '/docs/installation',
    icon: Download,
    title: 'Installation',
    description: 'npm, pnpm, or yarn — your choice',
  },
  {
    href: '/docs/mcp',
    icon: Cpu,
    title: 'MCP Integration',
    description: 'Connect with Claude Code, Cursor, Windsurf',
  },
  {
    href: '/docs/themes',
    icon: SwatchBook,
    title: 'Theme Guides',
    description: 'Token, layout, and component guidance for each theme',
  },
  {
    href: '/explore',
    icon: Palette,
    title: 'Explore Themes',
    description: 'Browse 7 production-ready themes',
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">
          framingui Documentation
        </h1>
        <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
          The agentic design system. A complete token architecture that AI agents can actually
          follow. <strong>0% hallucination by design.</strong>
        </p>
      </header>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group p-6 bg-white border border-neutral-200 rounded-xl hover:border-neutral-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-neutral-200 transition-colors">
                <card.icon className="w-5 h-5 text-neutral-600" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 group-hover:text-neutral-700">
                  {card.title}
                </h3>
                <p className="text-sm text-neutral-500 mt-1">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* What is FramingUI */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">What is framingui?</h2>
        <div className="space-y-4 text-neutral-600 leading-relaxed">
          <p>
            framingui is an <strong>agentic design system</strong> — built not for humans, but for
            AI agents. Traditional design systems provide guidelines that humans interpret.
            framingui provides structured constraints that LLMs can parse and follow.
          </p>
          <p>
            The result: when you ask Claude Code, Cursor, or any MCP-compatible tool to build UI
            with FramingUI, it generates production-ready code with consistent colors, typography,
            spacing, and components. No more random hex codes. No more magic numbers.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Key Features</h2>
        <ul className="space-y-3 text-neutral-600">
          <li className="flex items-start gap-3">
            <span className="text-neutral-400">→</span>
            <span>
              <strong>OKLCH Color System</strong> — Perceptually uniform, semantic color tokens
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-neutral-400">→</span>
            <span>
              <strong>Typography Scales</strong> — Fluid, responsive type system
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-neutral-400">→</span>
            <span>
              <strong>Spacing Tokens</strong> — Consistent rhythm across all components
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-neutral-400">→</span>
            <span>
              <strong>30+ Components</strong> — Buttons, cards, forms, navigation, and more
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-neutral-400">→</span>
            <span>
              <strong>MCP Protocol</strong> — Native integration with AI coding tools
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
