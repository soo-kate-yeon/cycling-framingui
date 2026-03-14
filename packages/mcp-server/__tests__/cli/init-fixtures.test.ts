import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  SCREEN_GENERATION_PACKAGES,
  findBestStylesheet,
  setupCSS,
  setupMCP,
  setupTailwind,
  setupThemeBootstrap,
  verifyInitSetup,
} from '../../src/cli/init.ts';
import { validateEnvironmentTool } from '../../src/tools/validate-environment.ts';

const tempDirs: string[] = [];

function makeTempProject(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'framingui-fixture-'));
  tempDirs.push(dir);
  return dir;
}

function writeJson(filePath: string, value: unknown): void {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2));
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe('init fixture smoke', () => {
  it('bootstraps a pristine Next.js fixture with Tailwind and FramingUI imports', async () => {
    const dir = makeTempProject();

    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    writeJson(path.join(dir, 'package.json'), {
      name: 'fixture-pristine-next',
      dependencies: Object.fromEntries(
        SCREEN_GENERATION_PACKAGES.filter(
          pkg => !['tailwindcss', 'postcss', 'autoprefixer', 'tailwindcss-animate'].includes(pkg)
        ).map(pkg => [pkg, 'latest'])
      ),
      devDependencies: {
        tailwindcss: '^3.4.17',
        postcss: '^8.4.38',
        autoprefixer: '^10.4.19',
        'tailwindcss-animate': '^1.0.7',
      },
    });
    fs.writeFileSync(path.join(dir, 'app/globals.css'), 'body { margin: 0; }\n');
    fs.writeFileSync(
      path.join(dir, 'app/layout.tsx'),
      `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
    );

    const tailwindPath = setupTailwind(dir);
    const stylesheetPath = setupCSS(dir, 'nextjs');
    const bootstrap = setupThemeBootstrap(dir, 'nextjs');
    setupMCP(dir);

    expect(tailwindPath).toBe(path.join(dir, 'tailwind.config.ts'));
    expect(stylesheetPath).toBe(path.join(dir, 'app/globals.css'));
    expect(bootstrap.entryPath).toBe(path.join(dir, 'app/layout.tsx'));
    expect(bootstrap.themeModulePath).toBe(path.join(dir, 'app/framingui-theme.ts'));

    const cssContent = fs.readFileSync(path.join(dir, 'app/globals.css'), 'utf8');
    expect(cssContent.startsWith("@import '@framingui/ui/styles';")).toBe(true);
    const layoutContent = fs.readFileSync(path.join(dir, 'app/layout.tsx'), 'utf8');
    expect(layoutContent).toContain("import { FramingUIProvider } from '@framingui/ui';");
    expect(layoutContent).toContain("import framinguiTheme from './framingui-theme';");
    expect(layoutContent).toContain(
      '<FramingUIProvider theme={framinguiTheme}>{children}</FramingUIProvider>'
    );
    const themeModule = fs.readFileSync(path.join(dir, 'app/framingui-theme.ts'), 'utf8');
    expect(themeModule).toContain('const framinguiTheme =');
    expect(themeModule).toContain('"id": "neutral-workspace"');

    const mcpConfig = JSON.parse(fs.readFileSync(path.join(dir, '.mcp.json'), 'utf8')) as {
      mcpServers?: Record<string, unknown>;
    };
    expect(mcpConfig.mcpServers?.framingui).toBeDefined();

    const verifyResult = verifyInitSetup(dir);
    expect(verifyResult.warnings).toHaveLength(0);
    expect(verifyResult.providerBootstrapOk).toBe(true);
    expect(verifyResult.themeModuleOk).toBe(true);

    const envResult = await validateEnvironmentTool({
      projectPath: dir,
      requiredPackages: ['@framingui/ui', '@framingui/core', 'tailwindcss-animate'],
      checkTailwind: true,
    });
    expect(envResult.success).toBe(true);
    expect(envResult.missing).toEqual([]);
    expect(envResult.tailwind?.issues).toEqual([]);
  });

  it('injects FramingUI styles into an existing CSS project without overwriting host styles', () => {
    const dir = makeTempProject();

    fs.mkdirSync(path.join(dir, 'styles'), { recursive: true });
    writeJson(path.join(dir, 'package.json'), {
      name: 'fixture-existing-css',
      dependencies: {
        '@framingui/ui': 'latest',
        '@framingui/core': 'latest',
        '@framingui/tokens': 'latest',
      },
      devDependencies: {
        tailwindcss: '^3.4.17',
        postcss: '^8.4.38',
        autoprefixer: '^10.4.19',
        'tailwindcss-animate': '^1.0.7',
      },
    });
    fs.writeFileSync(
      path.join(dir, 'styles/globals.css'),
      ':root {\n  --brand-accent: hotpink;\n}\n\nbody {\n  font-family: system-ui;\n}\n'
    );
    fs.writeFileSync(
      path.join(dir, 'tailwind.config.ts'),
      `export default { content: ['./pages/**/*.{ts,tsx}'], plugins: [] };`
    );

    expect(findBestStylesheet(dir, 'nextjs')).toBe('styles/globals.css');

    setupTailwind(dir);
    setupCSS(dir, 'nextjs');

    const cssContent = fs.readFileSync(path.join(dir, 'styles/globals.css'), 'utf8');
    expect(cssContent).toContain("@import '@framingui/ui/styles';");
    expect(cssContent).toContain('--brand-accent: hotpink;');
    expect(cssContent).toContain('font-family: system-ui;');

    const verifyResult = verifyInitSetup(dir);
    expect(verifyResult.styleImportOk).toBe(true);
    expect(verifyResult.tailwindUiContentOk).toBe(true);
    expect(verifyResult.tailwindAnimatePluginOk).toBe(true);
  });

  it('bootstraps a Vite fixture with FramingUIProvider and a generated theme module', () => {
    const dir = makeTempProject();

    fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
    writeJson(path.join(dir, 'package.json'), {
      name: 'fixture-vite',
      dependencies: Object.fromEntries(
        SCREEN_GENERATION_PACKAGES.filter(
          pkg => !['tailwindcss', 'postcss', 'autoprefixer', 'tailwindcss-animate'].includes(pkg)
        ).map(pkg => [pkg, 'latest'])
      ),
      devDependencies: {
        tailwindcss: '^3.4.17',
        postcss: '^8.4.38',
        autoprefixer: '^10.4.19',
        'tailwindcss-animate': '^1.0.7',
      },
    });
    fs.writeFileSync(path.join(dir, 'src/index.css'), 'body { margin: 0; }\n');
    fs.writeFileSync(
      path.join(dir, 'src/main.tsx'),
      `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
    );

    setupTailwind(dir);
    setupCSS(dir, 'vite');
    const bootstrap = setupThemeBootstrap(dir, 'vite');

    expect(bootstrap.entryPath).toBe(path.join(dir, 'src/main.tsx'));
    expect(bootstrap.themeModulePath).toBe(path.join(dir, 'src/framingui-theme.ts'));

    const entryContent = fs.readFileSync(path.join(dir, 'src/main.tsx'), 'utf8');
    expect(entryContent).toContain("import { FramingUIProvider } from '@framingui/ui';");
    expect(entryContent).toContain("import framinguiTheme from './framingui-theme';");
    expect(entryContent).toContain(
      '<FramingUIProvider theme={framinguiTheme}><App /></FramingUIProvider>'
    );

    const verifyResult = verifyInitSetup(dir);
    expect(verifyResult.providerBootstrapOk).toBe(true);
    expect(verifyResult.themeModuleOk).toBe(true);
  });

  it('keeps validate-environment actionable when the fixture is incomplete', async () => {
    const dir = makeTempProject();

    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    writeJson(path.join(dir, 'package.json'), {
      name: 'fixture-broken',
      dependencies: {
        react: '19.0.0',
      },
    });
    fs.writeFileSync(path.join(dir, 'app/globals.css'), 'body { color: black; }\n');

    const envResult = await validateEnvironmentTool({
      projectPath: dir,
      requiredPackages: ['@framingui/ui', '@framingui/core', 'tailwindcss-animate'],
      checkTailwind: true,
    });

    expect(envResult.success).toBe(true);
    expect(envResult.missing).toEqual(['@framingui/ui', '@framingui/core', 'tailwindcss-animate']);
    expect(envResult.tailwind?.configFound).toBe(false);
    expect(envResult.tailwind?.issues.length).toBeGreaterThan(0);
  });

  it('allows Tailwind v4 projects without reporting an incompatible init flow', async () => {
    const dir = makeTempProject();

    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    writeJson(path.join(dir, 'package.json'), {
      name: 'fixture-tailwind-v4',
      dependencies: {
        '@framingui/ui': 'latest',
        '@framingui/core': 'latest',
        tailwindcss: '^4.1.0',
      },
    });
    fs.writeFileSync(
      path.join(dir, 'tailwind.config.ts'),
      `export default { content: ['./app/**/*.{js,ts,jsx,tsx}'], plugins: [] };`
    );
    fs.writeFileSync(path.join(dir, 'app/globals.css'), "@import '@framingui/ui/styles';\n");

    const verifyResult = verifyInitSetup(dir);
    expect(verifyResult.tailwindVersionOk).toBe(true);
    expect(
      verifyResult.warnings.some(warning => warning.includes('Tailwind v4 CSS-first configuration'))
    ).toBe(true);

    const envResult = await validateEnvironmentTool({
      projectPath: dir,
      requiredPackages: ['@framingui/ui', '@framingui/core'],
      checkTailwind: true,
    });
    expect(envResult.success).toBe(true);
    expect(
      envResult.tailwind?.issues.some(issue => issue.includes('expects Tailwind CSS v3'))
    ).toBe(false);
  });
});
