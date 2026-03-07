import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { buildUpdateCommand, detectPackageManager } from './package-manager.js';

const UPDATE_CANDIDATES = [
  '@framingui/ui',
  '@framingui/core',
  '@framingui/tokens',
  '@framingui/mcp-server',
  'tailwindcss-animate',
];

interface ProjectPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function findPackageJsonPath(cwd: string): string {
  const direct = path.join(cwd, 'package.json');
  if (fs.existsSync(direct)) {
    return direct;
  }

  throw new Error(`No package.json found in ${cwd}. Run this inside a project directory.`);
}

export function getInstalledFraminguiPackages(cwd: string): string[] {
  const packageJsonPath = findPackageJsonPath(cwd);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as ProjectPackageJson;
  const installed = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);

  return UPDATE_CANDIDATES.filter(pkg => installed.has(pkg));
}

export function getUpdatePlan(cwd: string): {
  packageManager: string;
  packages: string[];
  command: string | null;
} {
  const packageManager = detectPackageManager(cwd);
  const packages = getInstalledFraminguiPackages(cwd);

  return {
    packageManager,
    packages,
    command: packages.length > 0 ? buildUpdateCommand(packageManager, packages) : null,
  };
}

export function updateCommand(args: string[]): void {
  const cwdIndex = args.indexOf('--cwd');
  const cwd = cwdIndex === -1 ? process.cwd() : path.resolve(args[cwdIndex + 1] ?? process.cwd());
  const checkOnly = args.includes('--check');

  const plan = getUpdatePlan(cwd);

  if (!plan.command) {
    throw new Error(
      `No installed FramingUI packages found in ${cwd}. Run \`framingui-mcp init\` or install @framingui/ui first.`
    );
  }

  console.log(`Detected package manager: ${plan.packageManager}`);
  console.log(`Packages: ${plan.packages.join(', ')}`);
  console.log(`Command: ${plan.command}`);

  if (checkOnly) {
    return;
  }

  execSync(plan.command, { cwd, stdio: 'inherit' });
}
