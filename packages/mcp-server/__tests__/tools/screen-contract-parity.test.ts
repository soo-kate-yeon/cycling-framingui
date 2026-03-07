import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockFetchComponentList, mockFetchComponent } = vi.hoisted(() => ({
  mockFetchComponentList: vi.fn(),
  mockFetchComponent: vi.fn(),
}));

vi.mock('../../src/api/data-client.ts', () => ({
  fetchComponent: mockFetchComponent,
  fetchComponentList: mockFetchComponentList,
}));

import { validateScreenDefinition as validateCoreScreenDefinition } from '@framingui/core';
import { generateScreenTool } from '../../src/tools/generate-screen.ts';
import { validateScreenDefinitionTool } from '../../src/tools/validate-screen-definition.ts';

const SCREEN_FIXTURE = {
  id: 'contract-parity',
  name: 'Contract Parity',
  shell: 'shell.web.app',
  page: 'page.detail',
  sections: [
    {
      id: 'main',
      pattern: 'section.container',
      slot: 'main',
      components: [
        {
          type: 'Heading',
          props: {
            level: 1,
            children: 'Parity Heading',
          },
        },
        {
          type: 'Text',
          props: {
            children: 'Parity Body',
          },
        },
      ],
    },
  ],
};

describe('Phase 3: screen contract parity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchComponentList.mockResolvedValue({ ok: true, data: [] });

    mockFetchComponent.mockResolvedValue({
      ok: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Component not found',
      },
    });
  });

  it('accepts Heading and Text because validate-screen-definition now uses the shared screen contract', async () => {
    const coreValidation = validateCoreScreenDefinition(SCREEN_FIXTURE);
    const mcpValidation = await validateScreenDefinitionTool({
      definition: SCREEN_FIXTURE,
      strict: true,
    });

    expect(coreValidation.valid).toBe(true);
    expect(mcpValidation.success).toBe(true);
    expect(mcpValidation.valid).toBe(true);
    expect(mcpValidation.errors).toBeUndefined();
  });

  it('rejects unsupported compound components consistently in validate-screen-definition and generate_screen', async () => {
    const unsupportedFixture = {
      ...SCREEN_FIXTURE,
      sections: [
        {
          id: 'main',
          pattern: 'section.container',
          slot: 'main',
          components: [
            {
              type: 'CardHeader',
              props: {
                children: 'Header only',
              },
            },
          ],
        },
      ],
    };

    const validation = await validateScreenDefinitionTool({
      definition: unsupportedFixture,
      strict: true,
    });
    const generation = await generateScreenTool({
      screenDefinition: unsupportedFixture,
      outputFormat: 'react',
    });

    expect(validation.success).toBe(true);
    expect(validation.valid).toBe(false);
    expect(validation.errors?.some(error => error.code === 'UNKNOWN_COMPONENT')).toBe(true);

    expect(generation.success).toBe(false);
    expect(generation.errors?.[0]).toContain('CardHeader');
  });
});
