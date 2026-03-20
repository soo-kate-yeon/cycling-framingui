import { describe, expect, it } from 'vitest';
import { getPromptDefinition, listPromptDefinitions } from '../../src/prompts/prompt-catalog.ts';

describe('prompt catalog', () => {
  it('lists slash-command prompts alongside core workflow prompts', () => {
    const names = listPromptDefinitions().map(prompt => prompt.name);

    expect(names).toContain('getting-started');
    expect(names).toContain('screen-workflow');
    expect(names).toContain('screen');
    expect(names).toContain('draft');
    expect(names).toContain('slash-commands');
    expect(names).toContain('command-help');
  });

  it('returns slash command help prompts through the catalog', () => {
    const screenPrompt = getPromptDefinition('screen');
    const helpPrompt = getPromptDefinition('command-help');
    const screenMessage = screenPrompt?.getPrompt().messages[0];
    const helpMessage = helpPrompt?.getPrompt({ command: '/screen' }).messages[0];

    const screenText = screenMessage?.content.type === 'text' ? screenMessage.content.text : '';
    const helpText = helpMessage?.content.type === 'text' ? helpMessage.content.text : '';

    expect(screenText).toContain('# /screen');
    expect(helpText).toContain('## MCP workflow');
    expect(helpText).toContain('validate-screen-definition');
  });
});
