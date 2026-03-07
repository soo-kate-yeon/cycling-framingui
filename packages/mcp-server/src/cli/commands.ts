import {
  renderSlashCommandAdapter,
  type SlashCommandAdapterClient,
} from '../commands/slash-command-adapters.js';

function readOption(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

export function commandsCommand(args: string[]): void {
  const formatArg = readOption(args, '--format') ?? 'text';
  const clientArg = (readOption(args, '--client') ?? 'generic') as SlashCommandAdapterClient;
  const commandArg = readOption(args, '--command');

  const output = renderSlashCommandAdapter({
    format: formatArg === 'json' || formatArg === 'markdown' ? formatArg : 'text',
    client: clientArg,
    command: commandArg,
  });

  console.log(output);
}
