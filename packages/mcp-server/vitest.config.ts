import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [
    {
      // .js 확장자 import를 동일 경로의 .ts 파일로 redirect하는 플러그인
      // mcp-server 소스는 TypeScript ESM 패턴으로 .js 확장자를 사용함
      // vitest 실행 시 dist/*.js 대신 src/*.ts를 로드해야 최신 소스가 사용됨
      name: 'resolve-ts-from-js',
      resolveId(id: string, importer: string | undefined) {
        if (!id.endsWith('.js')) {
          return null;
        }
        if (!importer) {
          return null;
        }

        // importer가 file:// URL 형식인 경우 일반 경로로 변환
        const importerPath = importer.startsWith('file://') ? fileURLToPath(importer) : importer;
        const importerDir = importerPath.replace(/\/[^/]+$/, '');
        const tsPath = resolve(importerDir, id.replace(/\.js$/, '.ts'));

        if (existsSync(tsPath)) {
          return tsPath;
        }
        return null;
      },
    },
  ],
  resolve: {
    alias: {
      '@framingui/ui': resolve(__dirname, '../ui/src/index.ts'),
      '@framingui/core': resolve(__dirname, '../core/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/schemas/**', 'src/storage/**', 'src/tools/**', 'src/utils/**'],
      exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.test.js'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
