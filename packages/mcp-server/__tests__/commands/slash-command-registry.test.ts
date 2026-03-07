import { describe, expect, it } from 'vitest';

import {
  getSlashCommand,
  listSlashCommands,
  normalizeSlashCommandName,
} from '../../src/commands/slash-command-registry.ts';

describe('slash command registry', () => {
  it('contains the canonical initial command set', () => {
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

  it('does not include deferred commands', () => {
    const commands = listSlashCommands().map(command => command.name);

    expect(commands).not.toContain('/density');
    expect(commands).not.toContain('/hierarchy');
    expect(commands).not.toContain('/palette');
    expect(commands).not.toContain('/tone');
  });

  it('normalizes command names with or without a slash', () => {
    expect(normalizeSlashCommandName('screen')).toBe('/screen');
    expect(normalizeSlashCommandName('/screen')).toBe('/screen');
  });

  it('maps /screen to the validated generation workflow', () => {
    const command = getSlashCommand('/screen');

    expect(command?.workflow).toEqual([
      'get-screen-generation-context',
      'validate-screen-definition',
      'generate_screen',
      'validate-environment',
    ]);
    expect(command?.promptRecipe).toBe('screen-workflow');
  });

  it('absorbs density options into /responsive', () => {
    const command = getSlashCommand('/responsive');
    const densityOption = command?.options.find(option => option.name === '--density');

    expect(densityOption?.values).toEqual(['preserve', 'denser', 'lighter']);
  });
});
