/**
 * Validate Environment MCP Tool
 * SPEC-MCP-005 Phase 2: Check if user's project has required NPM packages installed
 * SPEC-MCP-005: Tailwind CSS 설정 검증 확장
 */

import type {
  ValidateEnvironmentInput,
  ValidateEnvironmentOutput,
} from '../schemas/mcp-schemas.js';
import { readPackageJson } from '../utils/package-json-reader.js';
import { readTailwindConfig } from '../utils/tailwind-config-reader.js';
import { extractErrorMessage } from '../utils/error-handler.js';
import { readStyleContract } from '../utils/style-contract-reader.js';

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
    const { projectPath, requiredPackages, checkTailwind, checkStyles } = input;

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
    let styles: ValidateEnvironmentOutput['styles'];

    if (checkTailwind !== false) {
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

    if (checkStyles !== false) {
      const styleContractResult = readStyleContract(projectPath);
      const issues: string[] = [];
      const fixes: string[] = [];

      if (styleContractResult.styleContract === 'unknown') {
        issues.push(
          'No common global CSS entry was found, so FramingUI style variables could not be verified'
        );
        fixes.push(
          'Add a global stylesheet such as app/globals.css or styles/globals.css and import @framingui/ui/styles when using FramingUI component defaults'
        );
      }

      if (styleContractResult.styleContract === 'host-utility') {
        issues.push(
          'Project appears to be utility-first without FramingUI style variables; FramingUI component default variants may render incorrectly'
        );
        fixes.push(
          'Keep this screen utility-first and add explicit Tailwind classes, or migrate the project to the FramingUI variable contract before relying on component defaults'
        );
      }

      if (styleContractResult.styleContract === 'mixed') {
        issues.push(
          `Project defines only part of the FramingUI style contract. Missing variables: ${styleContractResult.missingVariables.join(
            ', '
          )}`
        );
        fixes.push(
          'Complete the FramingUI variable contract or stop mixing utility-first page styling with FramingUI component default variants in the same screen'
        );
      }

      if (
        styleContractResult.styleContract === 'framingui-native' &&
        !styleContractResult.uiStylesImportFound
      ) {
        fixes.push(
          "If these variables come from FramingUI, import '@framingui/ui/styles' from your global stylesheet to keep the contract explicit"
        );
      }

      styles = {
        ...styleContractResult,
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
      styles,
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
