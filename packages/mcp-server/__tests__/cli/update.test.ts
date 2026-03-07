import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { getInstalledFraminguiPackages, getUpdatePlan } from '../../src/cli/update.ts';

const tempDirs: string[] = [];

function createTempProject(packageJson: object, extraFiles: string[] = []): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'framingui-update-'));
  tempDirs.push(dir);
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(packageJson, null, 2));
  extraFiles.forEach(file => fs.writeFileSync(path.join(dir, file), ''));
  return dir;
}

describe('cli update helpers', () => {
  afterEach(() => {
    tempDirs.splice(0).forEach(dir => {
      fs.rmSync(dir, { recursive: true, force: true });
    });
  });

  it('detects installed FramingUI packages from package.json', () => {
    const dir = createTempProject({
      dependencies: {
        '@framingui/ui': '^0.6.8',
        react: '^19.0.0',
      },
      devDependencies: {
        'tailwindcss-animate': '^1.0.7',
      },
    });

    expect(getInstalledFraminguiPackages(dir)).toEqual(['@framingui/ui', 'tailwindcss-animate']);
  });

  it('builds a pnpm update plan when pnpm lockfile exists', () => {
    const dir = createTempProject(
      {
        dependencies: {
          '@framingui/ui': '^0.6.8',
          '@framingui/tokens': '^0.6.8',
        },
      },
      ['pnpm-lock.yaml']
    );

    const plan = getUpdatePlan(dir);

    expect(plan.packageManager).toBe('pnpm');
    expect(plan.command).toBe('pnpm up @framingui/ui @framingui/tokens');
  });

  it('returns no command when no FramingUI packages are installed', () => {
    const dir = createTempProject({
      dependencies: {
        react: '^19.0.0',
      },
    });

    const plan = getUpdatePlan(dir);

    expect(plan.packages).toEqual([]);
    expect(plan.command).toBeNull();
  });
});
