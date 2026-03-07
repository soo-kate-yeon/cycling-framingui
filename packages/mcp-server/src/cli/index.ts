#!/usr/bin/env node

/**
 * Framingui MCP CLI 라우터
 * 서브커맨드: login, logout, status, (없으면 MCP 서버 시작)
 */

export {};

const command = process.argv[2];

switch (command) {
  case '--version':
  case '-v': {
    const { printVersion } = await import('./version.js');
    printVersion();
    break;
  }

  case 'login': {
    const { loginCommand } = await import('./login.js');
    try {
      await loginCommand();
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
    break;
  }

  case 'logout': {
    const { logoutCommand } = await import('./logout.js');
    logoutCommand();
    break;
  }

  case 'status': {
    const { statusCommand } = await import('./status.js');
    statusCommand();
    break;
  }

  case 'init': {
    const { initCommand } = await import('./init.js');
    await initCommand();
    break;
  }

  default: {
    // 서브커맨드 없음 → MCP stdio 서버 시작 (기존 동작 유지)
    await import('../index.js');
    break;
  }
}
