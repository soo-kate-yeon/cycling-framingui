import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  generateAgentsMdSection,
  generateClaudeMdSection,
} from '../../src/cli/agent-md-templates.ts';
import { generateGuide } from '../../src/cli/guide-template.ts';
import { getInitSuccessMessage } from '../../src/cli/init.ts';
import { getGettingStartedPrompt } from '../../src/prompts/getting-started.ts';
import { getScreenWorkflowPrompt } from '../../src/prompts/screen-workflow.ts';

describe('project-context guidance', () => {
  it('updates generated guide templates to recommend detect-project-context first', () => {
    const guide = generateGuide('nextjs');
    const claude = generateClaudeMdSection('nextjs');
    const agents = generateAgentsMdSection('vite');

    expect(guide).toContain('detect-project-context');
    expect(guide).toContain('do not repeat `platform: "react-native"`');
    expect(guide).toContain('shadow quota snapshot');
    expect(claude).toContain('call `detect-project-context`');
    expect(claude).toContain('shadow quota snapshot');
    expect(claude).toContain('without repeating `platform`');
    expect(agents).toContain('call `detect-project-context` first');
    expect(agents).toContain('quota visibility');
    expect(agents).toContain('stored session default');
  });

  it('updates prompts to present detection-first bootstrap with explicit override fallback', () => {
    const gettingStarted = getGettingStartedPrompt();
    const gettingStartedText =
      gettingStarted.messages[0]?.content.type === 'text'
        ? gettingStarted.messages[0].content.text
        : '';
    const workflow = getScreenWorkflowPrompt();
    const workflowText =
      workflow.messages[0]?.content.type === 'text' ? workflow.messages[0].content.text : '';

    expect(gettingStartedText).toContain('detect-project-context');
    expect(gettingStartedText).toContain('detected default platform/runtime');
    expect(gettingStartedText).toContain('Shadow quota usage snapshot');
    expect(workflowText).toContain('detect-project-context');
    expect(workflowText).toContain('shadow quota snapshot');
    expect(workflowText).toContain('If the project path is known');
    expect(workflowText).toContain('platform: "react-native"');
  });

  it('updates init and README guidance to describe the detection-first path', () => {
    const message = getInitSuccessMessage('/tmp/demo-app');
    const readme = readFileSync(path.resolve(process.cwd(), '..', '..', 'README.md'), 'utf8');

    expect(message).toContain('detect-project-context');
    expect(message).toContain('projectPath: /tmp/demo-app');
    expect(readme).toContain('detect-project-context');
    expect(readme).toContain('default platform/runtime');
  });
});
