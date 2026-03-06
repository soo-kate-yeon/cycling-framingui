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
  },
  {
    from: join(repoDir, '.moai', 'icon-libraries', 'generated'),
    to: join(distDir, 'icon-libraries', 'generated'),
  },
];

for (const { from, to } of sources) {
  if (!existsSync(from)) {
    throw new Error(`Missing generated data directory: ${from}`);
  }

  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}
