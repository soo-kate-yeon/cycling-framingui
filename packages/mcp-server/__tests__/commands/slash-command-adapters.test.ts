import { describe, expect, it } from 'vitest';

import { renderSlashCommandAdapter } from '../../src/commands/slash-command-adapters.ts';

describe('slash command adapters', () => {
  it('renders json output for clients', () => {
    const output = renderSlashCommandAdapter({
      format: 'json',
      client: 'codex',
    });
    const parsed = JSON.parse(output) as {
      client: string;
      title: string;
      integrationTarget: string;
      notes: string[];
      commands: Array<{ name: string }>;
    };

    expect(parsed.client).toBe('codex');
    expect(parsed.title).toContain('Codex');
    expect(parsed.integrationTarget).toContain('AGENTS.md');
    expect(parsed.notes.length).toBeGreaterThan(0);
    expect(parsed.commands.some(command => command.name === '/screen')).toBe(true);
    expect(parsed.commands.some(command => command.name === '/responsive')).toBe(true);
  });

  it('renders markdown help for a single command', () => {
    const output = renderSlashCommandAdapter({
      format: 'markdown',
      client: 'cursor',
      command: '/responsive',
    });

    expect(output).toContain('FramingUI adapter for Cursor');
    expect(output).toContain('## Adapter notes');
    expect(output).toContain('## /responsive');
    expect(output).toContain('Usage: `/responsive <target>');
  });

  it('renders text help for a client adapter', () => {
    const output = renderSlashCommandAdapter({
      format: 'text',
      client: 'claude-code',
      command: '/update',
    });

    expect(output).toContain('FramingUI adapter for Claude Code');
    expect(output).toContain('Integration target:');
    expect(output).toContain('Notes:');
    expect(output).toContain('/update');
  });
});
