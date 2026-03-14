/**
 * Validate Environment MCP Tool
 * SPEC-MCP-005 Phase 2: Check if user's project has required NPM packages installed
 * SPEC-MCP-005: Tailwind CSS 설정 검증 확장
 */

import fs from 'node:fs';
import path from 'node:path';
import type {
  ValidateEnvironmentInput,
  ValidateEnvironmentOutput,
} from '../schemas/mcp-schemas.js';
import { readPackageJson } from '../utils/package-json-reader.js';
import { readTailwindConfig } from '../utils/tailwind-config-reader.js';
import { extractErrorMessage } from '../utils/error-handler.js';

type ResolvedPlatform = 'web' | 'react-native';
type ResolvedRuntime = 'web' | 'react-native' | 'expo';
type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';

function detectPackageManager(projectPath: string, packageManagerField?: unknown): PackageManager {
  if (typeof packageManagerField === 'string') {
    if (packageManagerField.startsWith('pnpm')) {
      return 'pnpm';
    }
    if (packageManagerField.startsWith('yarn')) {
      return 'yarn';
    }
    if (packageManagerField.startsWith('bun')) {
      return 'bun';
    }
    if (packageManagerField.startsWith('npm')) {
      return 'npm';
    }
  }

  const root = projectPath.endsWith('package.json') ? path.dirname(projectPath) : projectPath;
  if (fs.existsSync(path.join(root, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(root, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(root, 'bun.lockb')) || fs.existsSync(path.join(root, 'bun.lock'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(root, 'package-lock.json'))) {
    return 'npm';
  }
  return 'unknown';
}

function resolvePlatform(options: {
  requestedPlatform?: ValidateEnvironmentInput['platform'];
  installedPackages: Record<string, string>;
}): { platform: ResolvedPlatform; runtime: ResolvedRuntime } {
  if (options.requestedPlatform === 'react-native') {
    return {
      platform: 'react-native',
      runtime: options.installedPackages.expo
        ? 'expo'
        : options.installedPackages['react-native']
          ? 'react-native'
          : 'react-native',
    };
  }

  if (options.installedPackages.expo) {
    return { platform: 'react-native', runtime: 'expo' };
  }

  if (options.installedPackages['react-native']) {
    return { platform: 'react-native', runtime: 'react-native' };
  }

  return { platform: 'web', runtime: 'web' };
}

function auditSourceFiles(sourceFiles: string[] | undefined, platform: ResolvedPlatform) {
  if (!sourceFiles || sourceFiles.length === 0) {
    return undefined;
  }

  const issues: string[] = [];
  const fixes: string[] = [];
  const rawColorPattern = /#(?:[0-9a-fA-F]{3,8})\b|rgba?\(/;
  const rawSpacingPattern =
    /(padding|paddingHorizontal|paddingVertical|paddingTop|paddingBottom|margin|marginTop|marginBottom|gap|borderRadius)\s*:\s*(1[3-9]|[2-9]\d+)/;

  for (const sourceFile of sourceFiles) {
    if (!fs.existsSync(sourceFile)) {
      continue;
    }

    const source = fs.readFileSync(sourceFile, 'utf8');

    if (platform === 'react-native') {
      if (source.includes('@framingui/ui')) {
        issues.push(
          `${sourceFile}: found web-only @framingui/ui import in a React Native source file`
        );
        fixes.push(
          `Replace @framingui/ui imports with @framingui/react-native exports in ${sourceFile}`
        );
      }

      if (/className\s*=/.test(source)) {
        issues.push(`${sourceFile}: found className usage in a React Native source file`);
        fixes.push(`Move utility-class styling into StyleSheet.create in ${sourceFile}`);
      }

      if (rawColorPattern.test(source)) {
        issues.push(`${sourceFile}: found raw color values instead of token-backed theme usage`);
        fixes.push(
          `Replace raw color literals with @framingui/react-native theme tokens in ${sourceFile}`
        );
      }

      if (rawSpacingPattern.test(source)) {
        issues.push(`${sourceFile}: found raw spacing or radius values instead of layout tokens`);
        fixes.push(`Use Screen, Stack, Section, or token-backed spacing helpers in ${sourceFile}`);
      }
    }
  }

  return {
    checkedFiles: sourceFiles.length,
    issues,
    fixes,
  };
}

/**
 * Validate user's environment for required dependencies
 *
 * Compares required packages against installed packages in package.json
 * and provides installation commands for missing packages.
 * Optionally validates Tailwind CSS configuration for @framingui/ui compatibility.
 *
 * @param input - Project path and required packages to validate
 * @returns Validation result with installed/missing packages and install commands
 *
 * @example
 * ```typescript
 * const result = await validateEnvironmentTool({
 *   projectPath: '/path/to/project',
 *   requiredPackages: ['framer-motion', 'react'],
 *   checkTailwind: true
 * });
 *
 * if (result.success && result.missing.length > 0) {
 *   console.log(`Missing packages: ${result.missing.join(', ')}`);
 *   console.log(`Install with: ${result.installCommands.npm}`);
 * }
 *
 * if (result.tailwind?.issues.length) {
 *   console.log('Tailwind issues:', result.tailwind.issues);
 *   console.log('Fixes:', result.tailwind.fixes);
 * }
 * ```
 */
export async function validateEnvironmentTool(
  input: ValidateEnvironmentInput
): Promise<ValidateEnvironmentOutput> {
  try {
    const { projectPath, requiredPackages, checkTailwind } = input;

    // Step 1: Read package.json from the project
    const readResult = readPackageJson(projectPath);

    if (!readResult.success || !readResult.installedPackages) {
      return {
        success: false,
        error: readResult.error || 'Failed to read package.json',
      };
    }

    const installedPackages = readResult.installedPackages;
    const environment = resolvePlatform({
      requestedPlatform: input.platform,
      installedPackages,
    });
    const packageManager = detectPackageManager(
      projectPath,
      readResult.packageJson?.packageManager
    );

    // Step 2: Compare required packages with installed packages
    const installed: Record<string, string> = {};
    const missing: string[] = [];

    for (const packageName of requiredPackages) {
      const version = installedPackages[packageName];
      if (version !== undefined) {
        // Package is installed
        installed[packageName] = version;
      } else {
        // Package is missing
        missing.push(packageName);
      }
    }

    // Step 3: Generate install commands for missing packages
    const installCommands = generateInstallCommands(missing);

    // Step 4: Check for potential warnings (optional enhancement)
    const warnings: string[] = [];

    // Step 5: Tailwind CSS 설정 검증
    let tailwind: ValidateEnvironmentOutput['tailwind'];

    if (environment.platform === 'web' && checkTailwind !== false) {
      const tailwindResult = readTailwindConfig(projectPath);

      const issues: string[] = [];
      const fixes: string[] = [];

      if (!tailwindResult.found) {
        issues.push('tailwind.config.{ts,js,mjs,cjs} not found in project root');
        fixes.push(
          'Create a tailwind.config.ts file in your project root. ' +
            'See https://tailwindcss.com/docs/configuration for setup guide.'
        );
      } else {
        if (!tailwindResult.hasUiContentPath) {
          issues.push(
            'tailwind.config content paths do not include @framingui/ui — ' +
              'component styles (Dialog, AlertDialog, Popover, etc.) will not be compiled'
          );
          fixes.push(
            "Add '../../packages/ui/src/**/*.{ts,tsx}' (monorepo) or " +
              "'node_modules/@framingui/ui/dist/**/*.{js,ts,jsx,tsx}' (standalone) " +
              'to the content array in your tailwind.config'
          );
        }

        if (!tailwindResult.hasAnimatePlugin) {
          issues.push(
            'tailwindcss-animate plugin is not configured — ' +
              'Radix UI component animations (Dialog open/close, Popover, Tooltip) will not work'
          );
          fixes.push(
            'Install tailwindcss-animate (npm install tailwindcss-animate) and add it to plugins array: ' +
              "import animate from 'tailwindcss-animate'; plugins: [animate]"
          );
        }
      }

      tailwind = {
        configFound: tailwindResult.found,
        configPath: tailwindResult.configPath,
        hasUiContentPath: tailwindResult.hasUiContentPath,
        hasAnimatePlugin: tailwindResult.hasAnimatePlugin,
        issues,
        fixes,
      };
    }

    const sourceAudit = auditSourceFiles(input.sourceFiles, environment.platform);

    return {
      success: true,
      installed,
      missing,
      installCommands,
      warnings: warnings.length > 0 ? warnings : undefined,
      environment: {
        platform: environment.platform,
        runtime: environment.runtime,
        packageManager,
      },
      sourceAudit,
      tailwind,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}

/**
 * Generate installation commands for multiple package managers
 *
 * @param packages - Array of package names to install
 * @returns Install commands for npm, yarn, pnpm, and bun
 *
 * @example
 * ```typescript
 * const commands = generateInstallCommands(['react', 'react-dom']);
 * // {
 * //   npm: 'npm install react react-dom',
 * //   yarn: 'yarn add react react-dom',
 * //   pnpm: 'pnpm add react react-dom',
 * //   bun: 'bun add react react-dom'
 * // }
 * ```
 */
function generateInstallCommands(packages: string[]): {
  npm: string;
  yarn: string;
  pnpm: string;
  bun: string;
} {
  if (packages.length === 0) {
    return {
      npm: '',
      yarn: '',
      pnpm: '',
      bun: '',
    };
  }

  const packageList = packages.join(' ');

  return {
    npm: `npm install ${packageList}`,
    yarn: `yarn add ${packageList}`,
    pnpm: `pnpm add ${packageList}`,
    bun: `bun add ${packageList}`,
  };
}
