#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const packagesDir = path.join(repoRoot, 'packages');
const args = process.argv.slice(2);
const shouldRunConsumerSmoke = args.includes('--consumer-smoke');
const shouldSkipLockfileCheck = args.includes('--skip-lockfile-check');
const dependencyFields = ['dependencies', 'peerDependencies', 'optionalDependencies'];
const npmCacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'framingui-npm-cache-'));
const selectedPackages = [];

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--package') {
    const value = args[i + 1];
    if (!value || value.startsWith('--')) {
      throw new Error('--package requires a package name value');
    }
    selectedPackages.push(value);
    i += 1;
  }
}

function run(command, args, cwd = repoRoot) {
  const env = { ...process.env };
  if (command === 'npm') {
    env.npm_config_cache = npmCacheDir;
  }

  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.status !== 0) {
    const detail = `${result.stdout || ''}${result.stderr || ''}`.trim();
    throw new Error(`${command} ${args.join(' ')} failed\n${detail}`);
  }

  return (result.stdout || '').trim();
}

function collectPublishablePackages() {
  if (!fs.existsSync(packagesDir)) {
    throw new Error(`packages directory not found: ${packagesDir}`);
  }

  const dirs = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(packagesDir, d.name));

  const publishable = [];
  for (const dir of dirs) {
    const pkgPath = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      continue;
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.private === true) {
      continue;
    }

    publishable.push({
      dir,
      manifestPath: pkgPath,
      name: pkg.name,
      version: pkg.version,
      manifest: pkg,
    });
  }

  if (selectedPackages.length === 0) {
    return publishable;
  }

  const filtered = publishable.filter((pkg) => selectedPackages.includes(pkg.name));
  const missing = selectedPackages.filter(
    (selectedName) => !filtered.some((pkg) => pkg.name === selectedName)
  );

  if (missing.length > 0) {
    throw new Error(`Selected package(s) not found or not publishable: ${missing.join(', ')}`);
  }

  return filtered;
}

function checkWorkspaceProtocolInManifest(pkg, errors) {
  for (const field of dependencyFields) {
    const deps = pkg.manifest[field] || {};
    for (const [depName, spec] of Object.entries(deps)) {
      if (typeof spec === 'string' && spec.includes('workspace:')) {
        errors.push(
          `${pkg.name}@${pkg.version} has invalid ${field}.${depName}="${spec}" in ${pkg.manifestPath}`
        );
      }
    }
  }
}

function extractPackedManifest(tarballPath) {
  const packedJson = run('tar', ['-xOf', tarballPath, 'package/package.json']);
  return JSON.parse(packedJson);
}

function checkWorkspaceProtocolInPackedManifest(pkg, packedManifest, errors) {
  for (const field of dependencyFields) {
    const deps = packedManifest[field] || {};
    for (const [depName, spec] of Object.entries(deps)) {
      if (typeof spec === 'string' && spec.includes('workspace:')) {
        errors.push(
          `${pkg.name}@${pkg.version} leaked ${field}.${depName}="${spec}" in packed package.json`
        );
      }
    }
  }
}

function runConsumerInstallSmoke(pkg, tarballPath, errors) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'framingui-consumer-smoke-'));

  try {
    run('npm', ['init', '-y'], tempDir);
    run(
      'npm',
      ['install', '--ignore-scripts', '--no-audit', '--fund=false', tarballPath],
      tempDir
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`${pkg.name}@${pkg.version} consumer install smoke failed\n${message}`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function main() {
  const errors = [];

  if (!shouldSkipLockfileCheck) {
    console.log('Checking lockfile consistency...');
    run('pnpm', ['install', '--frozen-lockfile', '--lockfile-only']);
  }

  const publishablePackages = collectPublishablePackages();
  if (publishablePackages.length === 0) {
    console.log('No publishable packages found.');
    process.exit(0);
  }

  console.log(`Checking ${publishablePackages.length} publishable package(s)...`);

  for (const pkg of publishablePackages) {
    checkWorkspaceProtocolInManifest(pkg, errors);

    let tarballPath = '';
    try {
      const packOutput = run('npm', ['pack', '--json'], pkg.dir);
      const parsed = JSON.parse(packOutput);
      const tarballFile = parsed?.[0]?.filename;
      if (!tarballFile) {
        errors.push(`${pkg.name}@${pkg.version} npm pack did not return a tarball filename`);
        continue;
      }

      tarballPath = path.join(pkg.dir, tarballFile);
      const packedManifest = extractPackedManifest(tarballPath);
      checkWorkspaceProtocolInPackedManifest(pkg, packedManifest, errors);

      if (shouldRunConsumerSmoke) {
        runConsumerInstallSmoke(pkg, tarballPath, errors);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${pkg.name}@${pkg.version} pack validation failed\n${message}`);
    } finally {
      if (tarballPath) {
        fs.rmSync(tarballPath, { force: true });
      }
    }
  }

  if (errors.length > 0) {
    console.error('\nPublish integrity check failed:\n');
    for (const err of errors) {
      console.error(`- ${err}\n`);
    }
    process.exit(1);
  }

  if (shouldRunConsumerSmoke) {
    console.log('Publish integrity check passed (including consumer install smoke).');
  } else {
    console.log('Publish integrity check passed.');
  }
}

try {
  main();
} finally {
  fs.rmSync(npmCacheDir, { recursive: true, force: true });
}
