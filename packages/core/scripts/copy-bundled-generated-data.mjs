import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = join(scriptDir, '..');
const repoDir = join(packageDir, '..', '..');
const distDir = join(packageDir, 'dist', 'bundled');

const sources = [
  {
    from: join(repoDir, '.moai', 'themes', 'generated'),
    to: join(distDir, 'themes', 'generated'),
    required: true,
  },
  {
    from: join(repoDir, '.moai', 'icon-libraries', 'generated'),
    to: join(distDir, 'icon-libraries', 'generated'),
    required: false,
  },
];

for (const { from, to, required } of sources) {
  if (!existsSync(from)) {
    if (required) {
      throw new Error(`Missing generated data directory: ${from}`);
    }

    console.warn(`[copy-bundled-generated-data] Skipping missing optional source: ${from}`);
    continue;
  }

  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}
