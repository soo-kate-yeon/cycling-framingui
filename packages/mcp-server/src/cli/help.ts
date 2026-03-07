export function getCliGuideText(): string {
  return `FramingUI MCP Server

FramingUI is a design-system workflow for generating production-ready UI with MCP-aware tools, prompts, and command metadata.

Quick start:
  1. Set up a project: framingui-mcp init
  2. Authenticate:      framingui-mcp login
  3. Check status:      framingui-mcp status
  4. Inspect commands:  framingui-mcp commands --format text
  5. Start MCP server:  framingui-mcp server

What you get:
  - screen generation workflows
  - responsive optimization guidance
  - accessibility and theme-swap workflows
  - environment diagnosis and install checks

Useful commands:
  framingui-mcp help
  framingui-mcp guide
  framingui-mcp commands --command /responsive
  framingui-mcp update --check

In MCP clients, use the built-in prompts:
  - getting-started
  - slash-commands
  - command-help
`;
}

export function printHelp(): void {
  console.log(`Usage: framingui-mcp <command>

Commands:
  help            Show CLI usage and FramingUI overview
  guide           Show first-run onboarding guide
  commands        Export slash command metadata for clients or humans
  init            Configure a project for FramingUI
  login           Authenticate via browser OAuth
  logout          Remove saved credentials
  status          Show current authentication status
  update          Update installed FramingUI packages in a project
  server          Start the MCP stdio server explicitly
  -v, --version   Print the CLI version

Examples:
  framingui-mcp init
  framingui-mcp commands --format markdown
  framingui-mcp commands --command /responsive --format text
  framingui-mcp update --check
  framingui-mcp server`);
}

export function printGuide(): void {
  console.log(getCliGuideText());
}

export function isInteractiveTerminal(): boolean {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}
