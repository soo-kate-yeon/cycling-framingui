#!/usr/bin/env node

/**
 * Framingui MCP CLI 라우터
 * 서브커맨드: help, guide, commands, login, logout, status, init, update, server
 */

export {};

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case '--help':
  case '-h':
  case 'help': {
    const { printHelp } = await import('./help.js');
    printHelp();
    break;
  }

  case 'guide': {
    const { printGuide } = await import('./help.js');
    printGuide();
    break;
  }

  case '--version':
  case '-v': {
    const { printVersion } = await import('./version.js');
    printVersion();
    break;
  }

  case 'commands': {
    const { commandsCommand } = await import('./commands.js');
    commandsCommand(args);
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

  case 'update': {
    const { updateCommand } = await import('./update.js');
    try {
      updateCommand(args);
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
    break;
  }

  case 'server': {
    await import('../index.js');
    break;
  }

  case undefined: {
    const { isInteractiveTerminal, printGuide } = await import('./help.js');

    if (isInteractiveTerminal()) {
      printGuide();
      break;
    }

    await import('../index.js');
    break;
  }

  default: {
    const { printHelp } = await import('./help.js');
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
    break;
  }
}
