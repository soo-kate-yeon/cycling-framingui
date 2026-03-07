import { listSlashCommands } from '../commands/slash-command-registry.js';

export function getSlashCommandsPrompt() {
  const commandLines = listSlashCommands()
    .map(command => `- \`${command.name}\` - ${command.summary}\n  Usage: \`${command.usage}\``)
    .join('\n');

  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# FramingUI Slash Commands

FramingUI exposes an intent-level command registry on top of MCP tools. Clients with slash menus or tab completion can render these commands directly. Clients without native command UX can use this registry for \`--help\` style guidance.

## Command catalog

${commandLines}

## Notes

- \`/responsive\` includes density control via \`--density preserve|denser|lighter\`
- \`/screen\` and \`/section\` require a style-contract preflight (\`validate-environment\` with \`checkStyles: true\`) when project path is known
- \`/update\` refreshes installed FramingUI packages in a target project
- There is no standalone \`/density\`, \`/hierarchy\`, \`/palette\`, or \`/tone\` command in this phase
- Use the \`command-help\` prompt with a command name to get detailed help for one command`,
        },
      },
    ],
  };
}
