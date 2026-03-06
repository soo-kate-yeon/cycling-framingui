import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function findProjectRoot(startDir: string): string | null {
  let currentDir = startDir;
  const root = '/';

  while (currentDir !== root) {
    if (existsSync(join(currentDir, '.moai'))) {
      return currentDir;
    }
    currentDir = resolve(currentDir, '..');
  }

  return null;
}

export function getGeneratedDataDir(
  importMetaUrl: string,
  type: 'themes' | 'icon-libraries'
): string | null {
  const moduleDir = dirname(fileURLToPath(importMetaUrl));
  const cwdRoot = findProjectRoot(process.cwd());
  const moduleRoot = findProjectRoot(moduleDir);

  const candidates = [
    cwdRoot ? join(cwdRoot, '.moai', type, 'generated') : null,
    moduleRoot ? join(moduleRoot, '.moai', type, 'generated') : null,
    join(moduleDir, 'bundled', type, 'generated'),
  ];

  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}
