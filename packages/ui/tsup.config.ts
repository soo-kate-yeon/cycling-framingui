import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/templates/index.ts'],
    format: ['esm'],
    dts: true,
    tsconfig: 'tsconfig.build.json',
    banner: {
      js: "'use client';",
    },
  },
  {
    entry: ['src/theme-loader.ts'],
    format: ['esm'],
    dts: true,
    tsconfig: 'tsconfig.build.json',
  },
]);
