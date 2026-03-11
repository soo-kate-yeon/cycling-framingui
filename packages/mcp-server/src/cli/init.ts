/**
 * framingui-mcp init command
 * Bootstraps the FramingUI screen-generation runtime into a project.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import readline from 'node:readline';
import { loadThemeV2, type ThemeV2 } from '@framingui/core';
import type { ThemeDefinition } from '@framingui/ui';
import { generateGuide, type Framework } from './guide-template.js';
import { generateClaudeMdSection, generateAgentsMdSection } from './agent-md-templates.js';
import { upsertFraminguiServerConfig, type McpConfig } from './mcp-config.js';
import { readTailwindConfig } from '../utils/tailwind-config-reader.js';

const FRAMINGUI_UI_CONTENT_PATH = './node_modules/@framingui/ui/dist/**/*.{js,mjs}';
const FRAMINGUI_STYLE_IMPORT = "@import '@framingui/ui/styles';";
const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.next', 'dist', 'build', 'coverage']);
const MAX_SEARCH_DEPTH = 5;
const FRAMINGUI_TAILWIND_VERSION = '^3.4.17';
const FRAMINGUI_POSTCSS_VERSION = '^8.4.38';
const FRAMINGUI_AUTOPREFIXER_VERSION = '^10.4.19';
const FRAMINGUI_ANIMATE_VERSION = '^1.0.7';
const DEFAULT_THEME_ID = 'neutral-workspace';

export const SCREEN_GENERATION_RUNTIME_PACKAGES = [
  '@framingui/ui',
  '@framingui/core',
  '@framingui/tokens',
  '@hookform/resolvers',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-label',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toast',
  '@radix-ui/react-tooltip',
  'class-variance-authority',
  'clsx',
  'cmdk',
  'date-fns',
  'framer-motion',
  'lucide-react',
  'react-day-picker',
  'react-hook-form',
  'tailwind-merge',
  'zod',
] as const;

export const TAILWIND_V3_TOOLCHAIN_PACKAGES = {
  tailwindcss: FRAMINGUI_TAILWIND_VERSION,
  postcss: FRAMINGUI_POSTCSS_VERSION,
  autoprefixer: FRAMINGUI_AUTOPREFIXER_VERSION,
  'tailwindcss-animate': FRAMINGUI_ANIMATE_VERSION,
} as const;

export const SCREEN_GENERATION_PACKAGES = [
  ...SCREEN_GENERATION_RUNTIME_PACKAGES,
  ...Object.keys(TAILWIND_V3_TOOLCHAIN_PACKAGES),
] as const;

function usesTailwindV4(versionSpec?: string): boolean {
  const major = getInstalledMajor(versionSpec);
  return major !== undefined && major >= 4;
}

type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm';

type InitVerification = {
  installedPackagesOk: boolean;
  missingPackages: string[];
  styleImportOk: boolean;
  styleImportPath?: string;
  providerBootstrapOk: boolean;
  providerEntryPath?: string;
  themeModuleOk: boolean;
  themeModulePath?: string;
  tailwindFound: boolean;
  tailwindUiContentOk: boolean;
  tailwindAnimatePluginOk: boolean;
  tailwindVersionOk: boolean;
  detectedTailwindVersion?: string;
  tailwindConfigPath?: string;
  warnings: string[];
};

function log(step: number, total: number, message: string): void {
  console.log(`\n[${step}/${total}] ${message}`);
}

function logDetail(message: string): void {
  console.log(`      ${message}`);
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

function findFile(dir: string, candidates: string[]): string | undefined {
  return candidates.find(candidate => fileExists(path.join(dir, candidate)));
}

function walkFiles(dir: string, depth = 0): string[] {
  if (depth > MAX_SEARCH_DEPTH || !fileExists(dir)) {
    return [];
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (EXCLUDED_DIRS.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath, depth + 1));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function relativeToCwd(cwd: string, filePath: string): string {
  return path.relative(cwd, filePath).replaceAll(path.sep, '/');
}

async function askUser(question: string, options: string[]): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = options.map((opt, i) => `  ${i + 1}) ${opt}`).join('\n');

  return new Promise(resolve => {
    rl.question(`${question}\n${prompt}\n> `, answer => {
      rl.close();
      const index = parseInt(answer, 10) - 1;
      const selected = options[index];
      resolve(selected ?? options[0]!);
    });
  });
}

function detectFramework(cwd: string): Framework | null {
  const nextConfigs = ['next.config.ts', 'next.config.js', 'next.config.mjs'];
  const viteConfigs = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs'];

  if (findFile(cwd, nextConfigs)) {
    return 'nextjs';
  }
  if (findFile(cwd, viteConfigs)) {
    return 'vite';
  }
  return null;
}

function detectPackageManager(cwd: string): PackageManager {
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

function getInstalledPackageMap(
  packageJson: Record<string, unknown> | null
): Record<string, string> {
  const installed: Record<string, string> = {};

  if (!packageJson) {
    return installed;
  }

  const fields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ] as const;
  for (const field of fields) {
    const deps = packageJson[field];
    if (deps && typeof deps === 'object') {
      Object.assign(installed, deps);
    }
  }

  return installed;
}

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

function themeV2ToDefinition(theme: ThemeV2): ThemeDefinition {
  const semantic = theme.tokens.semantic;
  const surfaceRaw = semantic.background?.surface;
  const brandRaw = semantic.background?.brand;
  const borderRaw = semantic.border;
  const textRaw = (
    semantic as ThemeV2['tokens']['semantic'] & {
      text?: { primary?: string; secondary?: string; muted?: string };
    }
  ).text;

  return {
    id: theme.id,
    name: theme.name,
    schemaVersion: theme.schemaVersion,
    tokens: {
      atomic: {
        color: theme.tokens.atomic.color as ThemeDefinition['tokens']['atomic']['color'],
        spacing: theme.tokens.atomic.spacing,
        radius: theme.tokens.atomic.radius,
      },
      semantic: {
        background: {
          canvas: semantic.background?.canvas ?? 'atomic.color.neutral.50',
          surface: {
            subtle: surfaceRaw?.subtle ?? 'atomic.color.neutral.100',
            default: surfaceRaw?.default ?? 'atomic.color.neutral.white',
            emphasis: surfaceRaw?.emphasis ?? 'atomic.color.neutral.200',
          },
          brand: {
            subtle: brandRaw?.subtle ?? 'atomic.color.brand.100',
            default: brandRaw?.default ?? 'atomic.color.brand.500',
            emphasis: brandRaw?.emphasis ?? 'atomic.color.brand.700',
          },
        },
        border: {
          default: {
            subtle: borderRaw?.default?.subtle ?? 'atomic.color.neutral.100',
            default: borderRaw?.default?.default ?? 'atomic.color.neutral.200',
            emphasis: borderRaw?.default?.emphasis ?? 'atomic.color.neutral.300',
          },
        },
        text: {
          primary: textRaw?.primary ?? 'atomic.color.neutral.900',
          secondary: textRaw?.secondary ?? 'atomic.color.neutral.600',
          muted: textRaw?.muted ?? 'atomic.color.neutral.400',
        },
      },
    },
    stateLayer: theme.stateLayer
      ? {
          hover: theme.stateLayer.hover
            ? { opacity: theme.stateLayer.hover.opacity ?? 0.08 }
            : undefined,
          disabled: theme.stateLayer.disabled
            ? {
                opacity: theme.stateLayer.disabled.opacity ?? 0.38,
                contentOpacity: theme.stateLayer.disabled.contentOpacity ?? 0.38,
              }
            : undefined,
        }
      : undefined,
    typography: theme.typography
      ? {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeight,
        }
      : undefined,
  };
}

function serializeThemeModule(theme: ThemeDefinition): string {
  return `const framinguiTheme = ${JSON.stringify(theme, null, 2)} as const;\n\nexport default framinguiTheme;\n`;
}

function upsertImport(content: string, statement: string): string {
  if (content.includes(statement)) {
    return content;
  }

  const importMatches = [...content.matchAll(/^import\s.+;$/gm)];
  if (importMatches.length > 0) {
    const lastImport = importMatches[importMatches.length - 1]!;
    const insertIndex = lastImport.index! + lastImport[0].length;
    return `${content.slice(0, insertIndex)}\n${statement}${content.slice(insertIndex)}`;
  }

  return `${statement}\n${content}`;
}

function runInstallCommand(cwd: string, command: string): boolean {
  logDetail(command);
  try {
    execSync(command, { cwd, stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

function installPackages(
  cwd: string,
  pm: PackageManager
): { ok: boolean; command: string; reason?: string } {
  const packageJson = readProjectPackageJson(cwd);
  const installed = getInstalledPackageMap(packageJson);

  const runtimeMissing = SCREEN_GENERATION_RUNTIME_PACKAGES.filter(pkg => !installed[pkg]);
  const tailwindVersion = installed.tailwindcss;
  const tailwindV4 = usesTailwindV4(tailwindVersion);

  const toolchainMissing = tailwindV4
    ? []
    : Object.entries(TAILWIND_V3_TOOLCHAIN_PACKAGES)
        .filter(([pkg]) => !installed[pkg])
        .map(([pkg, version]) => `${pkg}@${version}`);

  const commands: string[] = [];
  if (runtimeMissing.length > 0) {
    commands.push(`${pm} add ${runtimeMissing.join(' ')}`);
  }
  if (toolchainMissing.length > 0) {
    commands.push(`${pm} add -D ${toolchainMissing.join(' ')}`);
  }

  if (commands.length === 0) {
    logDetail(
      tailwindV4
        ? 'All FramingUI runtime packages are already installed for the detected Tailwind v4 project'
        : 'All FramingUI runtime and Tailwind v3 toolchain packages are already installed'
    );
    return { ok: true, command: '' };
  }

  const ok = commands.every(command => runInstallCommand(cwd, command));
  return { ok, command: commands.join(' && ') };
}

const TAILWIND_CONFIG_CANDIDATES = [
  'tailwind.config.ts',
  'tailwind.config.js',
  'tailwind.config.mjs',
  'tailwind.config.cjs',
];

export function setupTailwind(cwd: string): string | undefined {
  const configName = findFile(cwd, TAILWIND_CONFIG_CANDIDATES);

  if (configName) {
    const configPath = path.join(cwd, configName);
    let content = fs.readFileSync(configPath, 'utf-8');

    if (!content.includes('@framingui/ui')) {
      content = content.replace(/(content\s*:\s*\[)/, `$1\n    '${FRAMINGUI_UI_CONTENT_PATH}',`);
    }

    if (!content.includes('tailwindcss-animate')) {
      if (/plugins\s*:\s*\[/.test(content)) {
        content = content.replace(/(plugins\s*:\s*\[)/, `$1\n    require('tailwindcss-animate'),`);
      } else {
        content = content.replace(
          /(content\s*:\s*\[[\s\S]*?\]\s*,?)/,
          `$1\n  plugins: [require('tailwindcss-animate')],`
        );
      }
    }

    fs.writeFileSync(configPath, content, 'utf-8');
    logDetail(`${configName} updated`);
    return configPath;
  }

  const template = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '${FRAMINGUI_UI_CONTENT_PATH}',
  ],
  plugins: [require('tailwindcss-animate')],
};

export default config;
`;

  const newPath = path.join(cwd, 'tailwind.config.ts');
  fs.writeFileSync(newPath, template, 'utf-8');
  logDetail('tailwind.config.ts created');
  return newPath;
}

function stylesheetPriority(relativePath: string, framework: Framework): number {
  const normalized = relativePath.replaceAll('\\', '/');
  const priorities =
    framework === 'nextjs'
      ? [
          'app/globals.css',
          'src/app/globals.css',
          'styles/globals.css',
          'app/globals.scss',
          'src/app/globals.scss',
        ]
      : ['src/index.css', 'src/main.css', 'index.css', 'src/index.scss', 'src/main.scss'];

  const exactIndex = priorities.findIndex(candidate => normalized.endsWith(candidate));
  if (exactIndex >= 0) {
    return exactIndex;
  }

  if (normalized.endsWith('globals.css') || normalized.endsWith('globals.scss')) {
    return 20;
  }
  if (normalized.endsWith('index.css') || normalized.endsWith('index.scss')) {
    return 30;
  }
  if (normalized.endsWith('main.css') || normalized.endsWith('main.scss')) {
    return 40;
  }
  if (normalized.endsWith('.css') || normalized.endsWith('.scss')) {
    return 100;
  }
  return 999;
}

export function findBestStylesheet(cwd: string, framework: Framework): string | undefined {
  const files = walkFiles(cwd)
    .filter(filePath => /\.(css|scss)$/.test(filePath))
    .map(filePath => relativeToCwd(cwd, filePath))
    .sort((a, b) => stylesheetPriority(a, framework) - stylesheetPriority(b, framework));

  return files[0];
}

export function setupCSS(cwd: string, framework: Framework): string | undefined {
  const cssFile = findBestStylesheet(cwd, framework);

  if (!cssFile) {
    logDetail('No stylesheet file found for FramingUI styles import');
    return undefined;
  }

  const cssPath = path.join(cwd, cssFile);
  const content = fs.readFileSync(cssPath, 'utf-8');

  if (content.includes(FRAMINGUI_STYLE_IMPORT)) {
    logDetail(`${cssFile} (already configured)`);
    return cssPath;
  }

  fs.writeFileSync(cssPath, `${FRAMINGUI_STYLE_IMPORT}\n\n${content}`, 'utf-8');
  logDetail(`${cssFile} updated`);
  return cssPath;
}

function ensureNextRootLayout(cwd: string): string {
  const candidates = [
    path.join(cwd, 'app/layout.tsx'),
    path.join(cwd, 'app/layout.jsx'),
    path.join(cwd, 'src/app/layout.tsx'),
    path.join(cwd, 'src/app/layout.jsx'),
  ];
  const existing = candidates.find(fileExists);
  if (existing) {
    return existing;
  }

  const appDir = fileExists(path.join(cwd, 'src/app'))
    ? path.join(cwd, 'src/app')
    : path.join(cwd, 'app');
  fs.mkdirSync(appDir, { recursive: true });

  const layoutPath = path.join(appDir, 'layout.tsx');
  const globalsImport = fileExists(path.join(appDir, 'globals.css'))
    ? "import './globals.css';\n"
    : '';
  const template = `${globalsImport}import { FramingUIProvider } from '@framingui/ui';\nimport framinguiTheme from './framingui-theme';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>\n        <FramingUIProvider theme={framinguiTheme}>{children}</FramingUIProvider>\n      </body>\n    </html>\n  );\n}\n`;
  fs.writeFileSync(layoutPath, template, 'utf-8');
  return layoutPath;
}

function ensureViteEntry(cwd: string): string {
  const candidates = [
    path.join(cwd, 'src/main.tsx'),
    path.join(cwd, 'src/main.jsx'),
    path.join(cwd, 'src/main.ts'),
    path.join(cwd, 'src/main.js'),
  ];
  const existing = candidates.find(fileExists);
  if (existing) {
    return existing;
  }

  const srcDir = path.join(cwd, 'src');
  fs.mkdirSync(srcDir, { recursive: true });

  const entryPath = path.join(srcDir, 'main.tsx');
  const template = `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport './index.css';\nimport App from './App';\nimport { FramingUIProvider } from '@framingui/ui';\nimport framinguiTheme from './framingui-theme';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <FramingUIProvider theme={framinguiTheme}>\n      <App />\n    </FramingUIProvider>\n  </React.StrictMode>\n);\n`;
  fs.writeFileSync(entryPath, template, 'utf-8');
  return entryPath;
}

export function setupThemeBootstrap(
  cwd: string,
  framework: Framework,
  themeId = DEFAULT_THEME_ID
): { entryPath?: string; themeModulePath?: string } {
  const loadedTheme = loadThemeV2(themeId);
  if (!loadedTheme) {
    logDetail(`Unable to load bundled theme "${themeId}" for provider bootstrap`);
    return {};
  }

  const theme = themeV2ToDefinition(loadedTheme);

  if (framework === 'nextjs') {
    const layoutPath = ensureNextRootLayout(cwd);
    const themeModulePath = path.join(path.dirname(layoutPath), 'framingui-theme.ts');

    if (!fileExists(themeModulePath)) {
      fs.writeFileSync(themeModulePath, serializeThemeModule(theme), 'utf-8');
    }

    let content = fs.readFileSync(layoutPath, 'utf-8');
    content = upsertImport(content, "import { FramingUIProvider } from '@framingui/ui';");
    content = upsertImport(content, "import framinguiTheme from './framingui-theme';");

    if (!content.includes('<FramingUIProvider theme={framinguiTheme}>')) {
      content = content.replace(
        /\{children\}/,
        '<FramingUIProvider theme={framinguiTheme}>{children}</FramingUIProvider>'
      );
    }

    fs.writeFileSync(layoutPath, content, 'utf-8');
    logDetail(`${relativeToCwd(cwd, layoutPath)} configured with FramingUIProvider`);
    return { entryPath: layoutPath, themeModulePath };
  }

  const entryPath = ensureViteEntry(cwd);
  const themeModulePath = path.join(path.dirname(entryPath), 'framingui-theme.ts');

  if (!fileExists(themeModulePath)) {
    fs.writeFileSync(themeModulePath, serializeThemeModule(theme), 'utf-8');
  }

  let content = fs.readFileSync(entryPath, 'utf-8');
  content = upsertImport(content, "import { FramingUIProvider } from '@framingui/ui';");
  content = upsertImport(content, "import framinguiTheme from './framingui-theme';");

  if (!content.includes('<FramingUIProvider theme={framinguiTheme}>')) {
    content = content.replace(
      /<App\s*\/>/,
      '<FramingUIProvider theme={framinguiTheme}><App /></FramingUIProvider>'
    );
  }

  fs.writeFileSync(entryPath, content, 'utf-8');
  logDetail(`${relativeToCwd(cwd, entryPath)} configured with FramingUIProvider`);
  return { entryPath, themeModulePath };
}

export function setupMCP(cwd: string): void {
  const mcpPath = path.join(cwd, '.mcp.json');

  if (fileExists(mcpPath)) {
    const raw = fs.readFileSync(mcpPath, 'utf-8');
    const config = JSON.parse(raw) as McpConfig;
    const result = upsertFraminguiServerConfig(config);

    if (!result.updated) {
      logDetail('.mcp.json already uses the latest FramingUI server config');
      return;
    }

    fs.writeFileSync(mcpPath, JSON.stringify(result.config, null, 2) + '\n', 'utf-8');
    logDetail(result.created ? '.mcp.json updated' : '.mcp.json FramingUI server refreshed');
    return;
  }

  const result = upsertFraminguiServerConfig({});
  fs.writeFileSync(mcpPath, JSON.stringify(result.config, null, 2) + '\n', 'utf-8');
  logDetail('.mcp.json created');
}

function setupGuide(cwd: string, framework: Framework): void {
  const guidePath = path.join(cwd, 'FRAMINGUI-GUIDE.md');

  if (fileExists(guidePath)) {
    logDetail('FRAMINGUI-GUIDE.md already exists');
    return;
  }

  fs.writeFileSync(guidePath, generateGuide(framework), 'utf-8');
  logDetail('FRAMINGUI-GUIDE.md created');
}

function setupAgentMd(cwd: string, framework: Framework): void {
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const claudeSection = generateClaudeMdSection(framework);

  if (fileExists(claudeMdPath)) {
    const existingContent = fs.readFileSync(claudeMdPath, 'utf-8');
    if (existingContent.includes('## FramingUI Workflow')) {
      logDetail('CLAUDE.md already contains the FramingUI section');
    } else {
      fs.appendFileSync(claudeMdPath, `\n${claudeSection}`, 'utf-8');
      logDetail('CLAUDE.md FramingUI section appended');
    }
  } else {
    fs.writeFileSync(claudeMdPath, `# Project Instructions\n${claudeSection}`, 'utf-8');
    logDetail('CLAUDE.md created');
  }

  const agentsMdPath = path.join(cwd, 'AGENTS.md');
  const agentsSection = generateAgentsMdSection(framework);

  if (fileExists(agentsMdPath)) {
    const existingContent = fs.readFileSync(agentsMdPath, 'utf-8');
    if (existingContent.includes('## FramingUI Workflow')) {
      logDetail('AGENTS.md already contains the FramingUI section');
    } else {
      fs.appendFileSync(agentsMdPath, `\n${agentsSection}`, 'utf-8');
      logDetail('AGENTS.md FramingUI section appended');
    }
  } else {
    fs.writeFileSync(agentsMdPath, `# AI Agent Instructions\n${agentsSection}`, 'utf-8');
    logDetail('AGENTS.md created');
  }
}

function readProjectPackageJson(cwd: string): Record<string, unknown> | null {
  const packageJsonPath = path.join(cwd, 'package.json');
  if (!fileExists(packageJsonPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as Record<string, unknown>;
}

function getInstalledPackageNames(packageJson: Record<string, unknown> | null): Set<string> {
  return new Set(Object.keys(getInstalledPackageMap(packageJson)));
}

export function verifyInitSetup(cwd: string): InitVerification {
  const packageJson = readProjectPackageJson(cwd);
  const installed = getInstalledPackageNames(packageJson);
  const installedVersions = getInstalledPackageMap(packageJson);
  const detectedTailwindVersion = installedVersions.tailwindcss;
  const tailwindV4 = usesTailwindV4(detectedTailwindVersion);
  const requiredPackages = tailwindV4
    ? SCREEN_GENERATION_RUNTIME_PACKAGES
    : SCREEN_GENERATION_PACKAGES;
  const missingPackages = requiredPackages.filter(pkg => !installed.has(pkg));
  const tailwindVersionOk = true;

  const stylesheets = walkFiles(cwd).filter(filePath => /\.(css|scss)$/.test(filePath));
  const stylesheetWithImport = stylesheets.find(filePath =>
    fs.readFileSync(filePath, 'utf-8').includes(FRAMINGUI_STYLE_IMPORT)
  );
  const providerEntries = walkFiles(cwd).filter(filePath =>
    /(app\/layout\.(t|j)sx?|src\/app\/layout\.(t|j)sx?|src\/main\.(t|j)sx?)$/.test(
      filePath.replaceAll(path.sep, '/')
    )
  );
  const providerEntry = providerEntries.find(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    return (
      content.includes('FramingUIProvider') &&
      content.includes('framinguiTheme') &&
      content.includes('theme={framinguiTheme}')
    );
  });
  const themeModule = walkFiles(cwd).find(filePath =>
    /framingui-theme\.(t|j)sx?$/.test(filePath.replaceAll(path.sep, '/'))
  );

  const tailwind = readTailwindConfig(cwd);
  const warnings: string[] = [];

  if (missingPackages.length > 0) {
    warnings.push(`Missing packages: ${missingPackages.join(', ')}`);
  }
  if (!stylesheetWithImport) {
    warnings.push(`Missing ${FRAMINGUI_STYLE_IMPORT} in a global stylesheet`);
  }
  if (!providerEntry) {
    warnings.push('Missing FramingUIProvider bootstrap in app root (layout.tsx or main.tsx)');
  }
  if (!themeModule) {
    warnings.push('Missing framingui-theme module for runtime theme injection');
  }
  if (!tailwind.found) {
    warnings.push('Tailwind config not found');
  } else {
    if (!tailwind.hasUiContentPath) {
      warnings.push('Tailwind config is missing @framingui/ui content paths');
    }
    if (!tailwind.hasAnimatePlugin) {
      warnings.push('Tailwind config is missing the tailwindcss-animate plugin');
    }
  }
  if (tailwindV4) {
    warnings.push(
      `Detected tailwindcss@${detectedTailwindVersion}. FramingUI init will skip Tailwind v3-only toolchain setup and rely on your existing Tailwind v4 CSS-first configuration`
    );
  }

  return {
    installedPackagesOk: missingPackages.length === 0,
    missingPackages,
    styleImportOk: Boolean(stylesheetWithImport),
    styleImportPath: stylesheetWithImport,
    providerBootstrapOk: Boolean(providerEntry),
    providerEntryPath: providerEntry,
    themeModuleOk: Boolean(themeModule),
    themeModulePath: themeModule,
    tailwindFound: tailwind.found,
    tailwindUiContentOk: tailwind.hasUiContentPath,
    tailwindAnimatePluginOk: tailwind.hasAnimatePlugin,
    tailwindVersionOk,
    detectedTailwindVersion,
    tailwindConfigPath: tailwind.configPath,
    warnings,
  };
}

function printResult(pm: PackageManager, verification: InitVerification): void {
  if (verification.warnings.length === 0) {
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FramingUI setup completed.

  Verified:
  - screen-generation runtime packages installed
  - Tailwind content paths updated
  - tailwindcss-animate configured
  - @import '@framingui/ui/styles'; present

  Next steps:
  1. Run: framingui-mcp login
  2. Restart your MCP client
  3. Start with: get-screen-generation-context

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    return;
  }

  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FramingUI setup is incomplete.

  Problems:
  - ${verification.warnings.join('\n  - ')}

  Recovery:
  - Re-run package install:
    ${pm} add ${SCREEN_GENERATION_RUNTIME_PACKAGES.join(' ')}
    ${
      verification.detectedTailwindVersion && usesTailwindV4(verification.detectedTailwindVersion)
        ? '(Tailwind v4 detected: keeping your existing Tailwind toolchain)'
        : `${pm} add -D ${Object.entries(TAILWIND_V3_TOOLCHAIN_PACKAGES)
            .map(([pkg, version]) => `${pkg}@${version}`)
            .join(' ')}`
    }
  - Ensure a global stylesheet imports:
    ${FRAMINGUI_STYLE_IMPORT}
  - Ensure your root entry wraps the app with:
    <FramingUIProvider theme={framinguiTheme}>...</FramingUIProvider>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const totalSteps = 10;

  console.log('\n@framingui/mcp-server init\n');

  if (!fileExists(path.join(cwd, 'package.json'))) {
    console.error('package.json not found. Run this command from the project root.');
    process.exit(1);
  }

  log(1, totalSteps, 'Detecting project...');
  let framework = detectFramework(cwd);

  if (!framework) {
    const answer = await askUser('Could not detect the framework. Choose one:', [
      'Next.js',
      'Vite',
    ]);
    framework = answer === 'Vite' ? 'vite' : 'nextjs';
  }

  logDetail(`Detected ${framework === 'nextjs' ? 'Next.js' : 'Vite'} project`);

  log(2, totalSteps, 'Installing FramingUI screen-generation runtime...');
  const pm = detectPackageManager(cwd);
  const installResult = installPackages(cwd, pm);
  if (!installResult.ok) {
    console.error('Package installation failed.');
    if (installResult.reason) {
      console.error(installResult.reason);
    }
  }

  log(3, totalSteps, 'Configuring Tailwind CSS...');
  try {
    setupTailwind(cwd);
  } catch {
    console.error('Failed to update Tailwind CSS configuration.');
  }

  log(4, totalSteps, 'Adding FramingUI styles import...');
  try {
    const cssPath = setupCSS(cwd, framework);
    if (!cssPath) {
      console.error(`Could not find a stylesheet to update with ${FRAMINGUI_STYLE_IMPORT}`);
    }
  } catch {
    console.error('Failed to update the stylesheet import.');
  }

  log(5, totalSteps, 'Bootstrapping FramingUIProvider...');
  try {
    setupThemeBootstrap(cwd, framework);
  } catch {
    console.error('Failed to configure FramingUIProvider bootstrap.');
  }

  log(6, totalSteps, 'Configuring MCP server...');
  try {
    setupMCP(cwd);
  } catch {
    console.error('Failed to update .mcp.json.');
  }

  log(7, totalSteps, 'Generating project guide...');
  try {
    setupGuide(cwd, framework);
  } catch {
    console.error('Failed to generate FRAMINGUI-GUIDE.md.');
  }

  log(8, totalSteps, 'Updating AI agent guides...');
  try {
    setupAgentMd(cwd, framework);
  } catch {
    console.error('Failed to update CLAUDE.md / AGENTS.md.');
  }

  log(9, totalSteps, 'Verifying FramingUI setup...');
  const verification = verifyInitSetup(cwd);
  if (verification.styleImportPath) {
    logDetail(`Styles import found in ${relativeToCwd(cwd, verification.styleImportPath)}`);
  }
  if (verification.providerEntryPath) {
    logDetail(
      `FramingUIProvider bootstrap found in ${relativeToCwd(cwd, verification.providerEntryPath)}`
    );
  }
  if (verification.themeModulePath) {
    logDetail(`Theme module found at ${relativeToCwd(cwd, verification.themeModulePath)}`);
  }
  if (verification.tailwindConfigPath) {
    logDetail(`Tailwind config verified at ${relativeToCwd(cwd, verification.tailwindConfigPath)}`);
  }

  log(10, totalSteps, verification.warnings.length === 0 ? 'Setup complete' : 'Setup incomplete');
  printResult(pm, verification);

  if (!installResult.ok || verification.warnings.length > 0) {
    process.exitCode = 1;
  }
}
