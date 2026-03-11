import { describe, expect, it } from 'vitest';
import {
  getSlashCommand,
  listSlashCommands,
  normalizeSlashCommandName,
} from '../../src/commands/slash-command-registry.ts';

describe('slash-command registry', () => {
  it('lists the expected command surface', () => {
    const commands = listSlashCommands().map(command => command.name);

    expect(commands).toEqual([
      '/screen',
      '/section',
      '/draft',
      '/responsive',
      '/a11y',
      '/theme-swap',
      '/doctor',
      '/install-check',
      '/export',
      '/update',
    ]);
  });

  it('normalizes command names and resolves aliases without a leading slash', () => {
    expect(normalizeSlashCommandName('screen')).toBe('/screen');
    expect(getSlashCommand('screen')?.name).toBe('/screen');
    expect(getSlashCommand('/draft')?.promptRecipe).toBe('screen-workflow');
  });
});
