import { describe, expect, it, vi } from 'vitest';

const {
  mockFetchTheme,
  mockFetchComponent,
  mockFetchScreenExamples,
  mockFetchTemplate,
  mockGetAllRecipes,
} = vi.hoisted(() => ({
  mockFetchTheme: vi.fn(),
  mockFetchComponent: vi.fn(),
  mockFetchScreenExamples: vi.fn(),
  mockFetchTemplate: vi.fn(),
  mockGetAllRecipes: vi.fn(),
}));

vi.mock('../../src/api/data-client.ts', () => ({
  fetchTheme: mockFetchTheme,
  fetchComponent: mockFetchComponent,
  fetchScreenExamples: mockFetchScreenExamples,
  fetchTemplate: mockFetchTemplate,
}));

vi.mock('../../src/data/recipe-resolver.ts', () => ({
  getAllRecipes: mockGetAllRecipes,
}));

import { getScreenGenerationContextTool } from '../../src/tools/get-screen-generation-context.ts';

describe('Phase 6: get-screen-generation-context quality', () => {
  it('does not force a low-confidence template match into the response', async () => {
    mockFetchTemplate.mockResolvedValue({ ok: false, error: { code: 'NOT_FOUND', message: 'no' } });
    mockFetchScreenExamples.mockResolvedValue({ ok: true, data: [] });
    mockFetchComponent.mockResolvedValue({
      ok: false,
      error: { code: 'NOT_FOUND', message: 'no' },
    });

    const result = await getScreenGenerationContextTool({
      description: 'blog page with editorial articles and reading flow',
      includeExamples: false,
    });

    expect(result.success).toBe(true);
    expect(result.templateMatch).toBeUndefined();
  });

  it('returns richer component guidance from the shared contract and theme recipes', async () => {
    mockFetchTheme.mockResolvedValue({ ok: true, data: { id: 'pebble' } });
    mockGetAllRecipes.mockResolvedValue({
      'recipes.card.default': 'bg-white rounded-[32px]',
      'recipes.badge.default': 'bg-neutral-100',
    });
    mockFetchTemplate.mockResolvedValue({ ok: false, error: { code: 'NOT_FOUND', message: 'no' } });
    mockFetchScreenExamples.mockResolvedValue({ ok: true, data: [] });
    mockFetchComponent.mockImplementation(async (id: string) => ({
      ok: true,
      data: {
        id,
        name:
          id === 'card'
            ? 'Card'
            : id === 'badge'
              ? 'Badge'
              : id === 'button'
                ? 'Button'
                : id === 'heading'
                  ? 'Heading'
                  : 'Text',
        category: 'core',
        description: `${id} component`,
        importStatement: `import { ${id} } from '@framingui/ui';`,
        props: [],
        variants: [],
      },
    }));

    const result = await getScreenGenerationContextTool({
      description: 'blog page with editorial articles and status labels',
      themeId: 'pebble',
      includeExamples: false,
    });

    expect(result.success).toBe(true);
    expect(result.components).toBeDefined();
    expect(result.components?.length).toBeGreaterThan(4);
    expect(result.components?.some(component => component.name === 'Badge')).toBe(true);
    expect(result.themeRecipes?.some(recipe => recipe.componentType === 'badge')).toBe(true);
  });
});
