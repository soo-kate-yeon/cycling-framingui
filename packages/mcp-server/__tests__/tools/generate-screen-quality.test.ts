import { describe, expect, it, vi } from 'vitest';

const { mockApplyRecipeToNode } = vi.hoisted(() => ({
  mockApplyRecipeToNode: vi.fn(async (node: any) => node),
}));

vi.mock('../../src/data/recipe-resolver.js', () => ({
  applyRecipeToNode: mockApplyRecipeToNode,
}));

import { generateScreenTool } from '../../src/tools/generate-screen.js';

describe('Phase 4: generate_screen quality', () => {
  it('does not emit synthetic Tailwind classes derived from typography token paths', async () => {
    const result = await generateScreenTool({
      screenDefinition: {
        id: 'quality-heading',
        name: 'Quality Heading',
        shell: 'shell.web.app',
        page: 'page.detail',
        sections: [
          {
            id: 'main',
            pattern: 'section.container',
            components: [
              {
                type: 'Heading',
                props: {
                  children: 'Generated Heading',
                },
              },
            ],
          },
        ],
      },
      outputFormat: 'react',
    });

    expect(result.success).toBe(true);
    expect(result.code).not.toContain('text-headingxl-fontSize');
    expect(result.code).not.toContain('font-headingxl-fontWeight');
  });

  it('renders props.children text instead of self-closing the generated element', async () => {
    const result = await generateScreenTool({
      screenDefinition: {
        id: 'quality-text',
        name: 'Quality Text',
        shell: 'shell.web.app',
        page: 'page.detail',
        sections: [
          {
            id: 'main',
            pattern: 'section.container',
            components: [
              {
                type: 'Text',
                props: {
                  children: 'This text disappears in generated JSX',
                },
              },
            ],
          },
        ],
      },
      outputFormat: 'react',
    });

    expect(result.success).toBe(true);
    expect(result.code).toContain('This text disappears in generated JSX');
    expect(result.code).not.toMatch(/<span[^>]*\/>/);
  });

  it('applies theme recipes before generation when themeId is present', async () => {
    mockApplyRecipeToNode.mockImplementationOnce(async (node: any) => ({
      ...node,
      props: {
        ...(node.props ?? {}),
        className: 'bg-white rounded-[32px] p-6 shadow-sm border-none',
      },
    }));

    const result = await generateScreenTool({
      screenDefinition: {
        id: 'quality-recipe',
        name: 'Quality Recipe',
        shell: 'shell.web.app',
        page: 'page.detail',
        themeId: 'pebble',
        sections: [
          {
            id: 'main',
            pattern: 'section.container',
            components: [
              {
                type: 'Card',
                props: {
                  children: 'Recipe card',
                },
              },
            ],
          },
        ],
      },
      outputFormat: 'react',
    });

    expect(result.success).toBe(true);
    expect(mockApplyRecipeToNode).toHaveBeenCalled();
    expect(result.code).toContain('bg-white');
    expect(result.code).toContain('rounded-[32px]');
  });
});
