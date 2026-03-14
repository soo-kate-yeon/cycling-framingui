import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/api/data-client.js', () => ({
  fetchTheme: vi.fn(async () => ({ ok: false })),
  fetchComponent: vi.fn(async (componentId: string) => ({
    ok: true,
    data: {
      id: componentId,
      name: componentId
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(''),
      category: 'core',
      description: 'Component',
      importStatement: "import { Button } from '@framingui/ui';",
      props: [],
      variants: [],
    },
  })),
  fetchScreenExamples: vi.fn(async () => ({ ok: true, data: [] })),
  fetchTemplate: vi.fn(async () => ({
    ok: true,
    data: {
      skeleton: {},
      requiredComponents: ['Button', 'Text', 'Table'],
    },
  })),
}));

vi.mock('../../src/data/template-matcher.js', () => ({
  matchTemplates: vi.fn(() => [
    {
      templateId: 'auth.login',
      templateName: 'Auth Login',
      category: 'auth',
      confidence: 92,
      matchedKeywords: ['login'],
    },
  ]),
}));

vi.mock('../../src/data/recipe-resolver.js', () => ({
  getAllRecipes: vi.fn(async () => ({})),
}));

vi.mock('../../src/data/hint-generator.js', () => ({
  generateHints: vi.fn(() => []),
}));

import { getScreenGenerationContextTool } from '../../src/tools/get-screen-generation-context.ts';

describe('getScreenGenerationContextTool react-native platform', () => {
  it('returns a react-native direct-write workflow without web screen-definition requirements', async () => {
    const result = await getScreenGenerationContextTool({
      description: 'Login screen with email and password fields',
      platform: 'react-native',
      includeExamples: false,
    });

    expect(result.success).toBe(true);
    expect(result.targetPlatform).toBe('react-native');
    expect(result.workflow?.title).toBe('React Native Direct-Write Workflow');
    expect(result.schema).toBeUndefined();
    expect(result.definitionStarter).toBeUndefined();
    expect(result.directWrite?.runtime).toBe('react-native');
    expect(result.components?.find(component => component.name === 'Button')?.importStatement).toBe(
      "import { Button } from '@framingui/react-native';"
    );
    expect(result.components?.some(component => component.name === 'Table')).toBe(false);
    expect(result.hints?.[0]?.message).toContain('@framingui/react-native');
  });
});
