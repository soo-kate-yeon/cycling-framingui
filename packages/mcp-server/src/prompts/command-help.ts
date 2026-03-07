import { getSlashCommand } from '../commands/slash-command-registry.js';

function formatValues(values?: string[]): string {
  if (!values || values.length === 0) {
    return '';
  }

  return ` Values: ${values.join(', ')}`;
}

export function getCommandHelpPrompt(commandName?: string) {
  const command = commandName ? getSlashCommand(commandName) : undefined;

  if (!command) {
    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `# FramingUI Command Help

No slash command matched \`${commandName ?? ''}\`.

Use the \`slash-commands\` prompt to inspect the full catalog, then call \`command-help\` again with one of:
- /screen
- /section
- /draft
- /responsive
- /a11y
- /theme-swap
- /doctor
- /install-check
- /export
- /update`,
          },
        },
      ],
    };
  }

  const argLines =
    command.args.length > 0
      ? command.args
          .map(arg => `- \`${arg.name}\`${arg.required ? ' (required)' : ''} - ${arg.description}`)
          .join('\n')
      : '- None';

  const optionLines =
    command.options.length > 0
      ? command.options
          .map(
            option => `- \`${option.name}\` - ${option.description}${formatValues(option.values)}`
          )
          .join('\n')
      : '- None';

  const exampleLines = command.examples.map(example => `- \`${example}\``).join('\n');
  const workflowLines = command.workflow.map(step => `- \`${step}\``).join('\n');
  const preflightLines = command.preflight
    ? [
        `Required: \`${command.preflight.required ? 'yes' : 'no'}\``,
        `When: ${command.preflight.when}`,
        `Steps:`,
        ...command.preflight.steps.map(step => `- \`${step}\``),
        `Blocking conditions:`,
        ...command.preflight.blockingConditions.map(condition => `- ${condition}`),
      ].join('\n')
    : 'None';

  return {
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `# ${command.name}

${command.summary}

## Usage

\`${command.usage}\`

## Arguments

${argLines}

## Options

${optionLines}

## Examples

${exampleLines}

## MCP workflow

${workflowLines}

## Required preflight

${preflightLines}

## Prompt fallback

\`${command.promptRecipe}\``,
        },
      },
    ],
  };
}
