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
  transpilePackages: ['@framingui/core', '@framingui/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    const uiSourceRoot = path.resolve(import.meta.dirname, '../ui/src');

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
      '@framingui/ui$': path.join(uiSourceRoot, 'index.ts'),
      '@framingui/ui/templates$': path.join(uiSourceRoot, 'templates/index.ts'),
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
