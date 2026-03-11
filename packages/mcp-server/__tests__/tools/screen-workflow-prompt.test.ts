import { describe, expect, it } from 'vitest';
import { getScreenWorkflowPrompt } from '../../src/prompts/screen-workflow.ts';

describe('screen-workflow prompt', () => {
  it('describes guarded direct-write and forbids transcript parsing', () => {
    const prompt = getScreenWorkflowPrompt();
    const text = prompt.messages[0]?.content.type === 'text' ? prompt.messages[0].content.text : '';

    expect(text).toContain('guarded direct write');
    expect(text).toContain('Do **not** parse rendered transcript blocks');
    expect(text).toContain('includeExamples: false');
    expect(text).toContain('generate_screen');
    expect(text).not.toContain('This tool is the **theme application engine**');
    expect(text).not.toContain('do NOT write code manually');
  });
});
