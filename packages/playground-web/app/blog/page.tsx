import { getAllBlogPosts, getAllTags } from '@/lib/blog';
import { BlogListPage } from '@/components/blog/BlogListPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Tekton',
  description:
    'Insights on AI-powered development, design systems, and modern web engineering from the Tekton team.',
  openGraph: {
    title: 'Blog | Tekton',
    description:
      'Insights on AI-powered development, design systems, and modern web engineering from the Tekton team.',
    type: 'website',
    url: 'https://framingui.com/blog',
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
    title: 'Blog | Tekton',
    description:
      'Insights on AI-powered development, design systems, and modern web engineering from the Tekton team.',
    images: ['/og-image.png'],
  },
  alternates: {
    types: {
      'application/rss+xml': '/blog/feed.xml',
    },
  },
};

export default function BlogPage() {
  const enPosts = getAllBlogPosts('en');
  const koPosts = getAllBlogPosts('ko');
  const enTags = getAllTags('en');
  const koTags = getAllTags('ko');

  return <BlogListPage posts={{ en: enPosts, ko: koPosts }} allTags={{ en: enTags, ko: koTags }} />;
}
