import type { Metadata } from 'next';
import '../styles/globals.css';
import { Providers } from './providers';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { ClarityProvider } from '@/components/Clarity';

export const metadata: Metadata = {
  title: {
    default: 'framingui - Agent-First Design System',
    template: '%s | framingui',
  },
  description:
    'The first design system AI agents can actually understand. 0% hallucination, production-ready UI with structured tokens.',
  metadataBase: new URL('https://framingui.com'),
  openGraph: {
    title: 'framingui - Agent-First Design System',
    description:
      'The first design system AI agents can actually understand. 0% hallucination by design.',
    url: 'https://framingui.com',
    siteName: 'framingui',
    type: 'website',
    images: [
      {
        url: 'https://framingui.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'framingui - Agent-First Design System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'framingui - Agent-First Design System',
    description: 'The first design system AI agents can actually understand.',
    images: ['https://framingui.com/og-image.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

// JSON-LD Structured Data for Search Results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'framingui',
  description: 'Agent-First Design System. 0% hallucination, production-ready UI.',
  url: 'https://framingui.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://framingui.com/docs?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
  sameAs: ['https://github.com/soo-kate-yeon/tekton'],
};

const siteNavigation = {
  '@context': 'https://schema.org',
  '@type': 'SiteNavigationElement',
  name: 'Main Navigation',
  hasPart: [
    {
      '@type': 'WebPage',
      name: 'Pricing',
      url: 'https://framingui.com/pricing',
    },
    {
      '@type': 'WebPage',
      name: 'See Demo',
      url: 'https://framingui.com/explore',
    },
    {
      '@type': 'WebPage',
      name: 'Templates Gallery',
      url: 'https://framingui.com/explore',
    },
    {
      '@type': 'WebPage',
      name: 'Documentation',
      url: 'https://framingui.com/docs',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigation) }}
        />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <ClarityProvider />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
