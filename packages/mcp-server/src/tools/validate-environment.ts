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
import { readPackageJson } from '../utils/package-json-reader.js';
import { readTailwindConfig } from '../utils/tailwind-config-reader.js';
import { extractErrorMessage } from '../utils/error-handler.js';

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

    if (checkTailwind !== false) {
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

    return {
      success: true,
      installed,
      missing,
      installCommands,
      warnings: warnings.length > 0 ? warnings : undefined,
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
