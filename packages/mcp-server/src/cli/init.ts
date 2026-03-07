/**
 * framingui-mcp init 명령어
 * 프로젝트에 FramingUI 디자인 시스템을 한 줄로 설정
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import readline from 'node:readline';
import { generateGuide, type Framework } from './guide-template.js';
import { generateClaudeMdSection, generateAgentsMdSection } from './agent-md-templates.js';
import { upsertFraminguiServerConfig, type McpConfig } from './mcp-config.js';

// ─── 상수 ──────────────────────────────────────────────

const FRAMINGUI_UI_CONTENT_PATH = './node_modules/@framingui/ui/dist/**/*.{js,mjs}';
const FRAMINGUI_STYLE_IMPORT = "@import '@framingui/ui/styles';";
const PACKAGES_TO_INSTALL = ['@framingui/ui', 'tailwindcss-animate'];

// ─── 유틸리티 ──────────────────────────────────────────

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
  return candidates.find(c => fileExists(path.join(dir, c)));
}

/**
 * stdin에서 사용자 선택을 받음
 */
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

// ─── Step 1: 프로젝트 감지 ─────────────────────────────

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

// ─── Step 2: 패키지 매니저 감지 및 설치 ─────────────────

type PackageManager = 'pnpm' | 'yarn' | 'bun' | 'npm';

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

function installPackages(cwd: string, pm: PackageManager): void {
  const cmd = `${pm} add ${PACKAGES_TO_INSTALL.join(' ')}`;
  logDetail(cmd);
  execSync(cmd, { cwd, stdio: 'inherit' });
}

// ─── Step 3: Tailwind CSS 설정 ──────────────────────────

const TAILWIND_CONFIG_CANDIDATES = [
  'tailwind.config.ts',
  'tailwind.config.js',
  'tailwind.config.mjs',
  'tailwind.config.cjs',
];

function setupTailwind(cwd: string): void {
  const configName = findFile(cwd, TAILWIND_CONFIG_CANDIDATES);

  if (configName) {
    // 기존 파일 수정
    const configPath = path.join(cwd, configName);
    let content = fs.readFileSync(configPath, 'utf-8');

    // content 배열에 @framingui/ui 경로 추가
    if (!content.includes('@framingui/ui')) {
      content = content.replace(/(content\s*:\s*\[)/, `$1\n    '${FRAMINGUI_UI_CONTENT_PATH}',`);
    }

    // plugins에 tailwindcss-animate 추가
    if (!content.includes('tailwindcss-animate')) {
      // plugins 배열이 있는 경우
      if (/plugins\s*:\s*\[/.test(content)) {
        content = content.replace(/(plugins\s*:\s*\[)/, `$1\n    require('tailwindcss-animate'),`);
      } else {
        // plugins가 없으면 content 닫는 ] 뒤에 추가
        content = content.replace(
          /(content\s*:\s*\[[\s\S]*?\]\s*,?)/,
          `$1\n  plugins: [require('tailwindcss-animate')],`
        );
      }
    }

    fs.writeFileSync(configPath, content, 'utf-8');
    logDetail(`${configName} 업데이트 완료`);
  } else {
    // 새 파일 생성
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
    fs.writeFileSync(path.join(cwd, 'tailwind.config.ts'), template, 'utf-8');
    logDetail('tailwind.config.ts 생성 완료');
  }
}

// ─── Step 4: CSS 임포트 추가 ────────────────────────────

function setupCSS(cwd: string, framework: Framework): void {
  const candidates =
    framework === 'nextjs'
      ? ['app/globals.css', 'src/app/globals.css', 'styles/globals.css']
      : ['src/index.css', 'src/main.css', 'index.css'];

  const cssFile = findFile(cwd, candidates);

  if (!cssFile) {
    logDetail('CSS 파일을 찾을 수 없습니다. 수동으로 추가해 주세요:');
    logDetail(`  ${FRAMINGUI_STYLE_IMPORT}`);
    return;
  }

  const cssPath = path.join(cwd, cssFile);
  const content = fs.readFileSync(cssPath, 'utf-8');

  if (content.includes(FRAMINGUI_STYLE_IMPORT)) {
    logDetail(`${cssFile} (이미 설정됨, skip)`);
    return;
  }

  // 파일 상단에 import 추가
  fs.writeFileSync(cssPath, `${FRAMINGUI_STYLE_IMPORT}\n\n${content}`, 'utf-8');
  logDetail(`${cssFile} 업데이트 완료`);
}

// ─── Step 5: MCP 설정 ──────────────────────────────────

function setupMCP(cwd: string): void {
  const mcpPath = path.join(cwd, '.mcp.json');

  if (fileExists(mcpPath)) {
    const raw = fs.readFileSync(mcpPath, 'utf-8');
    const config = JSON.parse(raw) as McpConfig;
    const result = upsertFraminguiServerConfig(config);

    if (!result.updated) {
      logDetail('.mcp.json (already using latest FramingUI server config)');
      return;
    }

    fs.writeFileSync(mcpPath, JSON.stringify(result.config, null, 2) + '\n', 'utf-8');
    logDetail(
      result.created ? '.mcp.json 업데이트 완료' : '.mcp.json framingui 서버를 latest로 갱신 완료'
    );
  } else {
    const result = upsertFraminguiServerConfig({});
    fs.writeFileSync(mcpPath, JSON.stringify(result.config, null, 2) + '\n', 'utf-8');
    logDetail('.mcp.json 생성 완료');
  }
}

// ─── Step 6: 가이드 문서 생성 ──────────────────────────

function setupGuide(cwd: string, framework: Framework): void {
  const guidePath = path.join(cwd, 'FRAMINGUI-GUIDE.md');

  if (fileExists(guidePath)) {
    logDetail('FRAMINGUI-GUIDE.md (이미 존재함, skip)');
    return;
  }

  const content = generateGuide(framework);
  fs.writeFileSync(guidePath, content, 'utf-8');
  logDetail('FRAMINGUI-GUIDE.md 생성 완료');
}

// ─── Step 7: CLAUDE.md / AGENTS.md 설정 ────────────────

function setupAgentMd(cwd: string, framework: Framework): void {
  // CLAUDE.md 섹션 추가 (기존 파일이 있으면 append, 없으면 생성)
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const claudeSection = generateClaudeMdSection(framework);

  if (fileExists(claudeMdPath)) {
    const existingContent = fs.readFileSync(claudeMdPath, 'utf-8');
    if (existingContent.includes('## FramingUI Workflow')) {
      logDetail('CLAUDE.md (이미 Framingui 섹션 존재, skip)');
    } else {
      fs.appendFileSync(claudeMdPath, `\n${claudeSection}`, 'utf-8');
      logDetail('CLAUDE.md에 Framingui 섹션 추가 완료');
    }
  } else {
    fs.writeFileSync(claudeMdPath, `# Project Instructions\n${claudeSection}`, 'utf-8');
    logDetail('CLAUDE.md 생성 완료');
  }

  // AGENTS.md 섹션 추가 (기존 파일이 있으면 append, 없으면 생성)
  const agentsMdPath = path.join(cwd, 'AGENTS.md');
  const agentsSection = generateAgentsMdSection(framework);

  if (fileExists(agentsMdPath)) {
    const existingContent = fs.readFileSync(agentsMdPath, 'utf-8');
    if (existingContent.includes('## FramingUI Workflow')) {
      logDetail('AGENTS.md (이미 Framingui 섹션 존재, skip)');
    } else {
      fs.appendFileSync(agentsMdPath, `\n${agentsSection}`, 'utf-8');
      logDetail('AGENTS.md에 Framingui 섹션 추가 완료');
    }
  } else {
    fs.writeFileSync(agentsMdPath, `# AI Agent Instructions\n${agentsSection}`, 'utf-8');
    logDetail('AGENTS.md 생성 완료');
  }
}

// ─── Step 8: 완료 메시지 (인증 안내 강화) ─────────────────

function printSuccess(): void {
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FramingUI 설정 완료!

  다음 단계:
  1. 먼저 인증하세요: framingui-mcp login
  2. Claude Code를 재시작하세요
  3. AI에게 요청하세요: "로그인 화면 만들어줘"
  4. FRAMINGUI-GUIDE.md에서 전체 가이드를 확인하세요

  중요: 모든 6개 테마는 인증이 필요합니다

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

// ─── 메인 ──────────────────────────────────────────────

export async function initCommand(): Promise<void> {
  const cwd = process.cwd();
  const totalSteps = 8;

  console.log('\n@framingui/mcp-server init\n');

  // package.json 확인
  if (!fileExists(path.join(cwd, 'package.json'))) {
    console.error('package.json을 찾을 수 없습니다. 프로젝트 루트에서 실행해 주세요.');
    process.exit(1);
  }

  // Step 1: 프로젝트 감지
  log(1, totalSteps, '프로젝트 감지 중...');
  let framework = detectFramework(cwd);

  if (!framework) {
    const answer = await askUser(
      '프로젝트 유형을 감지할 수 없습니다. 프레임워크를 선택해 주세요:',
      ['Next.js', 'Vite']
    );
    framework = answer === 'Vite' ? 'vite' : 'nextjs';
  }

  const frameworkLabel = framework === 'nextjs' ? 'Next.js' : 'Vite';
  logDetail(`${frameworkLabel} 프로젝트`);

  // Step 2: 패키지 설치
  log(2, totalSteps, '패키지 설치 중...');
  const pm = detectPackageManager(cwd);

  try {
    installPackages(cwd, pm);
  } catch {
    console.error('패키지 설치에 실패했습니다. 수동으로 설치해 주세요:');
    console.error(`  ${pm} add ${PACKAGES_TO_INSTALL.join(' ')}`);
  }

  // Step 3: Tailwind CSS 설정
  log(3, totalSteps, 'Tailwind CSS 설정 중...');
  try {
    setupTailwind(cwd);
  } catch {
    console.error('Tailwind CSS 설정에 실패했습니다. 수동으로 설정해 주세요.');
  }

  // Step 4: CSS 토큰 임포트
  log(4, totalSteps, 'CSS 토큰 임포트 추가 중...');
  try {
    setupCSS(cwd, framework);
  } catch {
    console.error('CSS 설정에 실패했습니다. 수동으로 추가해 주세요:');
    console.error(`  ${FRAMINGUI_STYLE_IMPORT}`);
  }

  // Step 5: MCP 설정
  log(5, totalSteps, 'Claude Code MCP 설정 중...');
  try {
    setupMCP(cwd);
  } catch {
    console.error('MCP 설정에 실패했습니다. 수동으로 .mcp.json을 생성해 주세요.');
  }

  // Step 6: 가이드 문서 생성
  log(6, totalSteps, '가이드 문서 생성 중...');
  try {
    setupGuide(cwd, framework);
  } catch {
    console.error('가이드 문서 생성에 실패했습니다.');
  }

  // Step 7: CLAUDE.md / AGENTS.md 설정
  log(7, totalSteps, 'AI 에이전트 가이드 설정 중...');
  try {
    setupAgentMd(cwd, framework);
  } catch {
    console.error('AI 에이전트 가이드 설정에 실패했습니다.');
  }

  // Step 8: 완료 메시지
  log(8, totalSteps, '설정 완료');
  printSuccess();
}
