/**
 * Preview Screen Template Tool Tests
 * SPEC-MCP-003: AC-004 Preview Screen Template
 * [TAG-MCP003-009] API 기반 템플릿 상세 조회
 * [TAG-MCP003-013] Template not found error handling
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { previewScreenTemplateTool } from '../../src/tools/preview-screen-template.ts';
import { fetchTemplate, fetchTemplateList } from '../../src/api/data-client.ts';

vi.mock('../../src/api/data-client.ts', () => ({
  fetchTemplate: vi.fn(),
  fetchTemplateList: vi.fn(),
}));

const mockFetchTemplate = vi.mocked(fetchTemplate);
const mockFetchTemplateList = vi.mocked(fetchTemplateList);

const loginTemplate = {
  id: 'auth.login',
  name: 'Login',
  category: 'auth',
  description: 'Login screen with authentication',
  version: '1.0.0',
  skeleton: {
    shell: 'centered-card',
    page: 'auth-page',
    sections: [
      { id: 'header', name: 'Header', slot: 'header', required: true },
      { id: 'form', name: 'Form', slot: 'content', required: true },
      { id: 'footer', name: 'Footer', slot: 'footer', required: false },
    ],
  },
  layout: {
    type: 'centered',
    responsive: {
      mobile: { padding: '1rem', gap: '1rem', columns: 1 },
      tablet: { padding: '2rem', gap: '1.5rem', columns: 1 },
      desktop: { padding: '3rem', gap: '2rem', columns: 1 },
    },
  },
  customizable: {
    texts: ['title', 'subtitle', 'button_label'],
    optional: ['social_login', 'remember_me'],
    slots: ['logo', 'forgotPassword', 'socialLogin', 'footer'],
  },
  requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-01T00:00:00Z',
  tags: ['auth', 'login'],
};

describe('previewScreenTemplateTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns template details with the templates subpath import statement', async () => {
    mockFetchTemplate.mockResolvedValueOnce({ ok: true, data: loginTemplate });

    const result = await previewScreenTemplateTool({ templateId: 'auth.login' });

    expect(result.success).toBe(true);
    expect(result.template).toMatchObject({
      id: 'auth.login',
      name: 'Login',
      category: 'auth',
      requiredComponents: ['Button', 'Input', 'Form', 'Card', 'Label'],
      importStatement: "import { LoginTemplate } from '@framingui/ui/templates';",
    });
    expect(result.template?.skeleton.sections).toHaveLength(3);
    expect(result.template?.layout.responsive?.mobile.columns).toBe(1);
  });

  it('omits responsive layout tokens when includeLayoutTokens=false', async () => {
    mockFetchTemplate.mockResolvedValueOnce({ ok: true, data: loginTemplate });

    const result = await previewScreenTemplateTool({
      templateId: 'auth.login',
      includeLayoutTokens: false,
    });

    expect(result.success).toBe(true);
    expect(result.template?.layout).toEqual({
      type: 'centered',
      responsive: undefined,
    });
  });

  it('returns available template ids when the API reports not found', async () => {
    mockFetchTemplate.mockResolvedValueOnce({
      ok: false,
      error: { code: 'NOT_FOUND', message: 'missing template' },
    });
    mockFetchTemplateList.mockResolvedValueOnce({
      ok: true,
      data: [{ id: 'auth.login' }, { id: 'dashboard.overview' }],
    });

    const result = await previewScreenTemplateTool({ templateId: 'auth.unknown' });

    expect(result).toEqual({
      success: false,
      error:
        'Template not found: auth.unknown. Available templates: auth.login, dashboard.overview',
    });
  });

  it('formats upstream API errors', async () => {
    mockFetchTemplate.mockResolvedValueOnce({
      ok: false,
      error: { code: 'FORBIDDEN', message: 'License does not include templates.' },
    });

    const result = await previewScreenTemplateTool({ templateId: 'auth.login' });

    expect(result).toEqual({
      success: false,
      error: 'License does not include templates.',
    });
  });

  it('surfaces unexpected thrown errors', async () => {
    mockFetchTemplate.mockRejectedValueOnce(new Error('network down'));

    const result = await previewScreenTemplateTool({ templateId: 'auth.login' });

    expect(result).toEqual({
      success: false,
      error: 'network down',
    });
  });
});
