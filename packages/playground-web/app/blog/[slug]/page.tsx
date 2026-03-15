import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogSlugs, getRelatedPosts } from '@/lib/blog';
import { BlogPostPage } from '@/components/blog/BlogPostPage';
import { BlogPostingJsonLd, BreadcrumbJsonLd } from '@/components/blog/JsonLd';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  const fm = post.frontmatter.en;
  const url = `https://framingui.com/blog/${slug}`;

  const ogImage = fm.coverImage || '/og-image.png';

  return {
    title: `${fm.title} | Tekton Blog`,
    description: fm.description,
    openGraph: {
      title: fm.title,
      description: fm.description,
      type: 'article',
      url,
      publishedTime: fm.date,
      modifiedTime: fm.updatedAt || fm.date,
      authors: [fm.author.name],
      tags: fm.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fm.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fm.title,
      description: fm.description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
      languages: {
        en: url,
        ko: url,
      },
    },
  };
}

export default async function BlogSlugPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const enRelated = getRelatedPosts(slug, 'en');
  const koRelated = getRelatedPosts(slug, 'ko');
  const fm = post.frontmatter.en;
  const url = `https://framingui.com/blog/${slug}`;

  return (
    <>
      <BlogPostingJsonLd
        title={fm.title}
        description={fm.description}
        datePublished={fm.date}
        dateModified={fm.updatedAt}
        authorName={fm.author.name}
        url={url}
        imageUrl={fm.coverImage}
        wordCount={post.content.en.split(/\s+/).length}
        language="en"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Blog', url: 'https://framingui.com/blog' },
          {
            name: fm.category,
            url: `https://framingui.com/blog/tag/${fm.tags[0]?.toLowerCase() || ''}`,
          },
          { name: fm.title, url },
        ]}
      />
      <BlogPostPage post={post} relatedPosts={{ en: enRelated, ko: koRelated }} />
    </>
  );
}
