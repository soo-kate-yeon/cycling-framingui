import type { NextConfig } from 'next';
import path from 'node:path';
import createNextIntlPlugin from 'next-intl/plugin';

// Note: Middleware removed for Next.js 16 compatibility
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Workspace 패키지 transpile
  // Note: @framingui/ui는 이미 'use client' 지시어가 포함된 pre-built ESM 번들을 제공하므로 제외
  transpilePackages: ['@framingui/core'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    const uiDistRoot = path.resolve(import.meta.dirname, '../ui/dist');

    // pnpm symlink를 따라가지 않고 package.json exports 사용
    config.resolve.symlinks = false;
    // symlinks=false 시 pnpm 가상 스토어에서 transitive 의존성 해석을 위해
    // 로컬 node_modules를 resolve 경로에 추가
    config.resolve.modules = [
      path.resolve(import.meta.dirname, 'node_modules'),
      ...(config.resolve.modules || ['node_modules']),
    ];
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@framingui/ui$': path.join(uiDistRoot, 'index.mjs'),
      '@framingui/ui/templates$': path.join(uiDistRoot, 'templates/index.mjs'),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
