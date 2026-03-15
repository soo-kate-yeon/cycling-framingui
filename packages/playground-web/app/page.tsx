import { Metadata } from 'next';
import { LandingPageWrapper } from '../components/landing/LandingPageWrapper';
import { getAllTemplates } from '../data/templates';

export const metadata: Metadata = {
  title: 'framingui - Agent-first Design System',
  description:
    'framingui is the first design system built specifically for AI agents. Structured tokens and layout logic let agents generate professional, production-ready UI—directly in your codebase.',
  keywords: [
    'design system',
    'AI agents',
    'Agent-first',
    'design tokens',
    'OKLCH',
    'Tailwind CSS',
    'React',
    'Next.js',
    'MCP',
  ],
  authors: [{ name: 'framingui Team' }],
  openGraph: {
    title: 'framingui - Agent-first Design System',
    description:
      'The first design system built specifically for AI agents. Generate production-ready UI directly in your codebase.',
    url: 'https://framingui.com',
    type: 'website',
    locale: 'en_US',
    siteName: 'framingui',
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
    title: 'framingui - Agent-first Design System',
    description: 'The first design system built specifically for AI agents.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  const templates = getAllTemplates();
  const galleryItems = templates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    descriptionKo: t.descriptionKo,
    category: 'Design System',
    thumbnail: `/screenshots/${t.id}/thumbnail.webp`,
    price: t.price,
  }));

  return <LandingPageWrapper templates={galleryItems} />;
}
