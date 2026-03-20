/**
 * Validate Environment MCP Tool
 * SPEC-MCP-005 Phase 2: Check if user's project has required NPM packages installed
 * SPEC-MCP-005: Tailwind CSS 설정 검증 확장
 */

import type {
  ValidateEnvironmentInput,
  ValidateEnvironmentOutput,
} from '../schemas/mcp-schemas.js';
import * as fs from 'fs';
import * as path from 'path';
import { getReactNativeAuditRules, type PlatformTarget } from '../platform-support.js';
import { readPackageJson } from '../utils/package-json-reader.js';
import { readTailwindConfig } from '../utils/tailwind-config-reader.js';
import { extractErrorMessage } from '../utils/error-handler.js';

type ValidateEnvironmentToolInput = Pick<
  ValidateEnvironmentInput,
  'projectPath' | 'requiredPackages'
> &
  Partial<Pick<ValidateEnvironmentInput, 'platform' | 'checkTailwind' | 'sourceFiles'>>;

function getInstalledMajor(versionSpec?: string): number | undefined {
  if (!versionSpec) {
    return undefined;
  }

  const match = versionSpec.match(/(\d+)(?:\.\d+)?(?:\.\d+)?/);
  if (!match) {
    return undefined;
  }

  return Number.parseInt(match[1]!, 10);
}

function usesTailwindV4(versionSpec?: string): boolean {
  const major = getInstalledMajor(versionSpec);
  return major !== undefined && major >= 4;
}

function findBootstrapEntry(projectPath: string): string | undefined {
  const candidates = [
    'app/layout.tsx',
    'app/layout.jsx',
    'src/app/layout.tsx',
    'src/app/layout.jsx',
    'src/main.tsx',
    'src/main.jsx',
    'src/main.ts',
    'src/main.js',
  ];

  return candidates.find(candidate => fs.existsSync(path.join(projectPath, candidate)));
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
  input: ValidateEnvironmentToolInput
): Promise<ValidateEnvironmentOutput> {
  try {
    const { projectPath, requiredPackages } = input;

    // Step 1: Read package.json from the project
    const readResult = readPackageJson(projectPath);

    if (!readResult.success || !readResult.installedPackages) {
      return {
        success: false,
        error: readResult.error || 'Failed to read package.json',
      };
    }

    const installedPackages = readResult.installedPackages;
    const packageJson = readResult.packageJson ?? {};
    const platform = inferPlatform(input.platform, installedPackages);
    const environment = detectEnvironment(projectPath, packageJson, installedPackages, platform);
    const shouldCheckTailwind = input.checkTailwind ?? platform === 'web';

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

    if (shouldCheckTailwind) {
      const tailwindResult = readTailwindConfig(projectPath);
      const installedTailwindVersion = installedPackages.tailwindcss;

      const issues: string[] = [];
      const fixes: string[] = [];
      const tailwindV4 = usesTailwindV4(installedTailwindVersion);

      if (!tailwindResult.found && !tailwindV4) {
        issues.push('tailwind.config.{ts,js,mjs,cjs} not found in project root');
        fixes.push(
          'Create a tailwind.config.ts file in your project root. ' +
            'See https://tailwindcss.com/docs/configuration for setup guide.'
        );
      } else if (tailwindResult.found) {
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
      } else if (tailwindV4) {
        fixes.push(
          'Tailwind v4 detected. Keep your existing CSS-first setup and ensure your global stylesheet imports FramingUI styles.'
        );
      }

      const bootstrapEntry = findBootstrapEntry(projectPath);
      if (!bootstrapEntry) {
        issues.push('No app root entry found for FramingUIProvider bootstrap');
        fixes.push(
          'Create app/layout.tsx (Next.js) or src/main.tsx (Vite) and wrap the app with ' +
            '<FramingUIProvider theme={framinguiTheme}>...</FramingUIProvider>'
        );
      } else {
        const bootstrapContent = fs.readFileSync(path.join(projectPath, bootstrapEntry), 'utf-8');
        if (
          !bootstrapContent.includes('FramingUIProvider') ||
          !bootstrapContent.includes('framinguiTheme') ||
          !bootstrapContent.includes('theme={framinguiTheme}')
        ) {
          issues.push(
            `${bootstrapEntry} does not mount FramingUIProvider with the generated framinguiTheme`
          );
          fixes.push(
            `Update ${bootstrapEntry} to import { FramingUIProvider } from '@framingui/ui', ` +
              "import framinguiTheme from './framingui-theme', and wrap the app root with " +
              '<FramingUIProvider theme={framinguiTheme}>...</FramingUIProvider>'
          );
        }
      }

      const themeModuleCandidates = [
        'app/framingui-theme.ts',
        'app/framingui-theme.js',
        'src/app/framingui-theme.ts',
        'src/app/framingui-theme.js',
        'src/framingui-theme.ts',
        'src/framingui-theme.js',
      ];
      const hasThemeModule = themeModuleCandidates.some(candidate =>
        fs.existsSync(path.join(projectPath, candidate))
      );
      if (!hasThemeModule) {
        issues.push('Generated framingui-theme module not found');
        fixes.push(
          'Generate a local framingui-theme module that exports a theme object and pass it to FramingUIProvider'
        );
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

    const sourceAudit =
      platform === 'react-native' && input.sourceFiles && input.sourceFiles.length > 0
        ? auditReactNativeSourceFiles(input.sourceFiles)
        : undefined;

    return {
      success: true,
      installed,
      missing,
      platform,
      environment,
      installCommands,
      warnings: warnings.length > 0 ? warnings : undefined,
      tailwind,
      sourceAudit,
    };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error),
    };
  }
}

function inferPlatform(
  inputPlatform: ValidateEnvironmentInput['platform'],
  installedPackages: Record<string, string>
): PlatformTarget {
  if (inputPlatform) {
    return inputPlatform;
  }

  if (installedPackages.expo || installedPackages['react-native']) {
    return 'react-native';
  }

  return 'web';
}

function detectEnvironment(
  projectPath: string,
  packageJson: Record<string, unknown>,
  installedPackages: Record<string, string>,
  platform: PlatformTarget
): NonNullable<ValidateEnvironmentOutput['environment']> {
  const packageManagerField =
    typeof packageJson.packageManager === 'string' ? packageJson.packageManager : undefined;

  return {
    platform,
    runtime:
      platform === 'react-native' ? (installedPackages.expo ? 'expo' : 'react-native') : 'web',
    projectType:
      platform === 'react-native' ? (installedPackages.expo ? 'expo' : 'react-native') : 'web',
    packageManager: detectPackageManager(projectPath, packageManagerField),
  };
}

function detectPackageManager(
  projectPath: string,
  packageManagerField?: string
): NonNullable<ValidateEnvironmentOutput['environment']>['packageManager'] {
  if (packageManagerField) {
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

  const rootPath = projectPath.endsWith('package.json') ? path.dirname(projectPath) : projectPath;
  if (fs.existsSync(path.join(rootPath, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (fs.existsSync(path.join(rootPath, 'yarn.lock'))) {
    return 'yarn';
  }
  if (fs.existsSync(path.join(rootPath, 'bun.lockb'))) {
    return 'bun';
  }
  if (fs.existsSync(path.join(rootPath, 'package-lock.json'))) {
    return 'npm';
  }
  return 'unknown';
}

function auditReactNativeSourceFiles(
  sourceFiles: string[]
): NonNullable<ValidateEnvironmentOutput['sourceAudit']> {
  const findings: NonNullable<ValidateEnvironmentOutput['sourceAudit']>['findings'] = [];
  const rules = getReactNativeAuditRules();

  for (const filePath of sourceFiles) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes('@framingui/ui')) {
      findings.push({
        filePath,
        ruleId: 'rn-web-import',
        severity: 'error',
        message: 'Web-only @framingui/ui import found in a React Native target file',
        guidance: 'Replace @framingui/ui imports with @framingui/react-native exports.',
      });
    }

    for (const rule of rules) {
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(content)) {
        continue;
      }

      findings.push({
        filePath,
        ruleId: rule.id,
        severity: rule.severity,
        message: rule.description,
        guidance: rule.guidance,
      });
    }
  }

  return {
    filesScanned: sourceFiles.length,
    issues: findings.map(finding => `${finding.filePath}: ${finding.message}. ${finding.guidance}`),
    fixes: findings.map(finding => `${finding.filePath}: ${finding.guidance}`),
    findings,
  };
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
