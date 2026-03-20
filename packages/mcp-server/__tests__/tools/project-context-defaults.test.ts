import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/api/data-client.js', () => ({
  fetchTheme: vi.fn(async () => ({ ok: false })),
  fetchComponentList: vi.fn(async () => ({
    ok: true,
    data: [
      {
        id: 'button',
        name: 'Button',
        category: 'core',
        tier: 1,
        description: 'Action button',
        variantsCount: 2,
        hasSubComponents: false,
      },
      {
        id: 'dialog',
        name: 'Dialog',
        category: 'complex',
        tier: 2,
        description: 'Dialog surface',
        variantsCount: 1,
        hasSubComponents: true,
      },
    ],
  })),
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
      tier: 1,
      importStatement: `import { ${componentId} } from '@framingui/ui';`,
      props: [],
      variants: [],
      dependencies: { internal: [], external: ['@framingui/ui'] },
      examples: [],
      subComponents: [],
      accessibility: 'Accessible',
    },
  })),
  fetchScreenExamples: vi.fn(async () => ({ ok: true, data: [] })),
  fetchTemplate: vi.fn(async () => ({
    ok: true,
    data: {
      skeleton: {},
      requiredComponents: ['Button', 'Dialog'],
    },
  })),
}));

vi.mock('../../src/data/template-matcher.js', () => ({
  matchTemplates: vi.fn(() => [
    {
      templateId: 'auth.login',
      templateName: 'Auth Login',
      category: 'auth',
      confidence: 90,
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

import {
  clearActiveProjectContext,
  setActiveProjectContext,
} from '../../src/project-context-state.js';
import { getScreenGenerationContextTool } from '../../src/tools/get-screen-generation-context.ts';
import { listComponentsTool } from '../../src/tools/list-components.js';
import { previewComponentTool } from '../../src/tools/preview-component.js';

describe('project context session defaults', () => {
  beforeEach(() => {
    clearActiveProjectContext();
  });

  it('uses detected session defaults for list-components when platform is omitted', async () => {
    setActiveProjectContext({
      projectPath: '/tmp/expo-app',
      packageJsonPath: '/tmp/expo-app/package.json',
      platform: 'react-native',
      environment: {
        runtime: 'expo',
        projectType: 'expo',
        packageManager: 'pnpm',
      },
    });

    const result = await listComponentsTool({ category: 'all' });

    expect(result.success).toBe(true);
    expect(
      result.components?.every(component => component.platforms?.includes('react-native') === true)
    ).toBe(true);
  });

  it('uses detected session defaults for preview-component when platform is omitted', async () => {
    setActiveProjectContext({
      projectPath: '/tmp/expo-app',
      packageJsonPath: '/tmp/expo-app/package.json',
      platform: 'react-native',
      environment: {
        runtime: 'expo',
        projectType: 'expo',
        packageManager: 'pnpm',
      },
    });

    const result = await previewComponentTool({
      componentId: 'button',
      includeDependencies: true,
    });

    expect(result.success).toBe(true);
    expect(result.component?.platformSupport?.target).toBe('react-native');
    expect(result.component?.importStatement).not.toContain('@framingui/ui');
    expect(result.component?.dependencies?.external?.length).toBeGreaterThan(0);
  });

  it('uses detected session defaults for get-screen-generation-context when platform is omitted', async () => {
    setActiveProjectContext({
      projectPath: '/tmp/expo-app',
      packageJsonPath: '/tmp/expo-app/package.json',
      platform: 'react-native',
      environment: {
        runtime: 'expo',
        projectType: 'expo',
        packageManager: 'pnpm',
      },
    });

    const result = await getScreenGenerationContextTool({
      description: 'Login screen with email and password fields',
      includeExamples: false,
    });

    expect(result.success).toBe(true);
    expect(result.targetPlatform).toBe('react-native');
    expect(result.workflow?.title).toBe('React Native Direct-Write Workflow');
  });

  it('preserves explicit platform overrides over session defaults', async () => {
    setActiveProjectContext({
      projectPath: '/tmp/expo-app',
      packageJsonPath: '/tmp/expo-app/package.json',
      platform: 'react-native',
      environment: {
        runtime: 'expo',
        projectType: 'expo',
        packageManager: 'pnpm',
      },
    });

    const previewResult = await previewComponentTool({
      componentId: 'button',
      platform: 'web',
      includeDependencies: true,
    });
    const contextResult = await getScreenGenerationContextTool({
      description: 'Marketing landing page',
      platform: 'web',
      includeExamples: false,
    });

    expect(previewResult.success).toBe(true);
    expect(previewResult.component?.platformSupport?.target).toBe('web');
    expect(previewResult.component?.importStatement).toContain('@framingui/ui');
    expect(contextResult.success).toBe(true);
    expect(contextResult.targetPlatform).toBe('web');
  });

  it('falls back to legacy web behavior when no session default exists', async () => {
    const previewResult = await previewComponentTool({
      componentId: 'button',
      includeDependencies: true,
    });
    const contextResult = await getScreenGenerationContextTool({
      description: 'Dashboard screen',
      includeExamples: false,
    });

    expect(previewResult.success).toBe(true);
    expect(previewResult.component?.platformSupport?.target).toBe('web');
    expect(previewResult.component?.importStatement).toContain('@framingui/ui');
    expect(contextResult.success).toBe(true);
    expect(contextResult.targetPlatform).toBe('web');
  });
});
