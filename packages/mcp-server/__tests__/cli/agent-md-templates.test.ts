import { describe, expect, it } from 'vitest';
import {
  generateAgentsMdSection,
  generateClaudeMdSection,
} from '../../src/cli/agent-md-templates.ts';

describe('agent md templates', () => {
  it('documents the react-native direct-write path', () => {
    const claude = generateClaudeMdSection('nextjs');
    const agents = generateAgentsMdSection('vite');

    expect(claude).toContain('React Native Direct-Write Flow');
    expect(claude).toContain('shadow quota snapshot');
    expect(claude).toContain('platform: "react-native"');
    expect(agents).toContain('React Native Projects');
    expect(agents).toContain('quota visibility');
    expect(agents).toContain('do **not** import `@framingui/ui`');
  });
});
