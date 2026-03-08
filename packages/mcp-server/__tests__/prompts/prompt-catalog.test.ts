import { describe, expect, it } from 'vitest';

import { getPromptDefinition, listPromptDefinitions } from '../../src/prompts/prompt-catalog.ts';

describe('prompt catalog', () => {
  it('lists the slash command discovery prompts and workflow prompts', () => {
    const prompts = listPromptDefinitions().map(prompt => prompt.name);

    expect(prompts).toContain('slash-commands');
    expect(prompts).toContain('command-help');
    expect(prompts).toContain('screen');
    expect(prompts).toContain('draft');
    expect(prompts).toContain('responsive-workflow');
    expect(prompts).toContain('a11y-workflow');
    expect(prompts).toContain('theme-swap-workflow');
    expect(prompts).toContain('doctor-workflow');
    expect(prompts).toContain('update-workflow');
  });

  it('provides screen and draft alias prompts', () => {
    const screenPrompt = getPromptDefinition('screen');
    const draftPrompt = getPromptDefinition('draft');

    const screenText = screenPrompt?.getPrompt().messages[0]?.content.text ?? '';
    const draftText = draftPrompt?.getPrompt().messages[0]?.content.text ?? '';

    expect(screenText).toContain('# /screen');
    expect(screenText).toContain('/screen <description>');
    expect(draftText).toContain('# /draft');
    expect(draftText).toContain('/draft <description>');
  });

  it('returns detailed help for a slash command', () => {
    const prompt = getPromptDefinition('command-help');
    const result = prompt?.getPrompt({ command: '/responsive' });
    const text = result?.messages[0]?.content.text ?? '';

    expect(text).toContain('# /responsive');
    expect(text).toContain('/responsive <target>');
    expect(text).toContain('--density');
    expect(text).toContain('responsive-workflow');
  });

  it('returns a useful fallback for unknown commands', () => {
    const prompt = getPromptDefinition('command-help');
    const result = prompt?.getPrompt({ command: '/unknown' });
    const text = result?.messages[0]?.content.text ?? '';

    expect(text).toContain('No slash command matched');
    expect(text).toContain('/screen');
  });
});
