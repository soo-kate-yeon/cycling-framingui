import {
  type SlashCommandDefinition,
  getSlashCommand,
  listSlashCommands,
} from './slash-command-registry.js';

export type SlashCommandAdapterFormat = 'json' | 'markdown' | 'text';
export type SlashCommandAdapterClient = 'generic' | 'codex' | 'claude-code' | 'cursor';

export interface SlashCommandAdapterOptions {
  format: SlashCommandAdapterFormat;
  client?: SlashCommandAdapterClient;
  command?: string;
}

interface ClientAdapterMeta {
  title: string;
  integrationTarget: string;
  notes: string[];
}

function getCommands(command?: string): SlashCommandDefinition[] {
  if (!command) {
    return listSlashCommands();
  }

  const resolved = getSlashCommand(command);
  return resolved ? [resolved] : [];
}

function getClientAdapterMeta(client: SlashCommandAdapterClient): ClientAdapterMeta {
  switch (client) {
    case 'codex':
      return {
        title: 'FramingUI adapter for Codex',
        integrationTarget: 'AGENTS.md or a Codex-specific command manifest',
        notes: [
          'Render each command in slash completion and show `summary` plus `usage` on tab.',
          'When a command is selected, use `promptRecipe` as the fallback workflow guide.',
          'For focused help, request `command-help` with the command name.',
        ],
      };
    case 'claude-code':
      return {
        title: 'FramingUI adapter for Claude Code',
        integrationTarget: 'CLAUDE.md, command palette glue, or MCP prompt helpers',
        notes: [
          'Surface slash commands from the canonical registry instead of hardcoding them.',
          'Use `slash-commands` as the catalog fallback when native slash UI is unavailable.',
          'Preserve MCP workflow order from the `workflow` field.',
        ],
      };
    case 'cursor':
      return {
        title: 'FramingUI adapter for Cursor',
        integrationTarget: '.cursor rules, custom command palette wiring, or MCP helper layer',
        notes: [
          'Render short summaries in the command palette and full `usage` on selection.',
          'Use the registry `examples` to seed autocomplete or example prompts.',
          'Map `promptRecipe` into a fallback prompt path when command UX is limited.',
        ],
      };
    case 'generic':
    default:
      return {
        title: 'FramingUI generic command adapter',
        integrationTarget: 'Any slash-command capable MCP client',
        notes: [
          'Render `summary` in command lists and `usage` in inline help.',
          'Use `examples` for discoverability.',
          'Use `promptRecipe` and `command-help` as fallback guidance.',
        ],
      };
  }
}

function renderMarkdown(
  commands: SlashCommandDefinition[],
  client: SlashCommandAdapterClient
): string {
  const meta = getClientAdapterMeta(client);

  if (commands.length === 0) {
    return `# ${meta.title}\n\nNo matching commands.`;
  }

  return [
    `# ${meta.title}`,
    '',
    `Integration target: ${meta.integrationTarget}`,
    '',
    '## Adapter notes',
    '',
    ...meta.notes.map(note => `- ${note}`),
    ...commands.flatMap(command => [
      '',
      `## ${command.name}`,
      '',
      command.summary,
      '',
      `- Usage: \`${command.usage}\``,
      `- Prompt fallback: \`${command.promptRecipe}\``,
      `- Workflow: ${command.workflow.map(step => `\`${step}\``).join(' -> ')}`,
      `- Required preflight: ${
        command.preflight
          ? `\`${command.preflight.steps.join(' -> ')}\` (${command.preflight.when})`
          : 'none'
      }`,
      `- Examples: ${command.examples.map(example => `\`${example}\``).join(', ')}`,
    ]),
  ].join('\n');
}

function renderText(commands: SlashCommandDefinition[], client: SlashCommandAdapterClient): string {
  const meta = getClientAdapterMeta(client);

  if (commands.length === 0) {
    return `${meta.title}\n\nNo matching commands.`;
  }

  return [
    meta.title,
    `Integration target: ${meta.integrationTarget}`,
    '',
    'Notes:',
    ...meta.notes.map(note => `  - ${note}`),
    '',
    ...commands.map(
      command =>
        `${command.name}\n  ${command.summary}\n  Usage: ${command.usage}\n  Prompt: ${command.promptRecipe}\n  Preflight: ${
          command.preflight ? `${command.preflight.steps.join(' -> ')}` : 'none'
        }`
    ),
  ].join('\n');
}

export function renderSlashCommandAdapter(options: SlashCommandAdapterOptions): string {
  const client = options.client ?? 'generic';
  const commands = getCommands(options.command);

  if (options.format === 'json') {
    const meta = getClientAdapterMeta(client);

    return JSON.stringify(
      {
        client,
        title: meta.title,
        integrationTarget: meta.integrationTarget,
        notes: meta.notes,
        commands,
      },
      null,
      2
    );
  }

  if (options.format === 'markdown') {
    return renderMarkdown(commands, client);
  }

  return renderText(commands, client);
}
