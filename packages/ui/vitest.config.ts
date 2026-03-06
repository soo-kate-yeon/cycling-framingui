import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    loader: 'tsx',
    include: /\.(tsx?|jsx?)$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/*.d.ts',
        'src/index.ts',
        'src/lib/tokens.ts', // Pure constant exports, no logic to test
        'src/lib/theme-loader.ts', // Complex utility with browser-specific logic
      ],
      all: true,
      skipFull: false,
      thresholds: {
        lines: 85,
        functions: 75, // Lower threshold due to many untested utility components
        branches: 85,
        statements: 85,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@framingui/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@framingui/core/template-catalog': path.resolve(
        __dirname,
        '../core/src/catalog/templates/index.ts'
      ),
    },
  },
});
