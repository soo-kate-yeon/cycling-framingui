import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./__tests__/setup.ts'],
    exclude: ['node_modules', '.next', '__tests__/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        '__tests__/',
        '*.config.*',
        'dist/',
        'app/**', // Next.js app directory - tested via E2E (SPEC-PLAYGROUND-001 AC-006, AC-007, AC-008)
        '**/*.d.ts',
        '**/index.ts', // Re-export files
        'next-env.d.ts',
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/components': path.resolve(__dirname, './components'),
      // Use workspace sources in tests so CI does not depend on a prior package build.
      '@framingui/ui/theme-loader': path.resolve(__dirname, '../ui/src/theme-loader.ts'),
      '@framingui/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      '@framingui/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
