import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm';

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function detectPackageManager(cwd: string): PackageManager {
  if (fileExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fileExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fileExists(path.join(cwd, 'bun.lock')) || fileExists(path.join(cwd, 'bun.lockb'))) {
    return 'bun';
  }
  return 'npm';
}

export function buildAddCommand(pm: PackageManager, packages: string[]): string {
  return `${pm} add ${packages.join(' ')}`;
}

export function buildUpdateCommand(pm: PackageManager, packages: string[]): string {
  switch (pm) {
    case 'pnpm':
      return `pnpm up ${packages.join(' ')}`;
    case 'yarn':
      return `yarn up ${packages.join(' ')}`;
    case 'bun':
      return `bun update ${packages.join(' ')}`;
    case 'npm':
    default:
      return `npm install ${packages.map(pkg => `${pkg}@latest`).join(' ')}`;
  }
}
