/**
 * List Screen Templates Tool Tests
 * SPEC-MCP-003: AC-003 List Screen Templates
 * [TAG-MCP003-008] API 기반 템플릿 목록 조회
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { listScreenTemplatesTool } from '../../src/tools/list-screen-templates.ts';
import { fetchTemplateList } from '../../src/api/data-client.ts';

vi.mock('../../src/api/data-client.ts', () => ({
  fetchTemplateList: vi.fn(),
}));

const mockFetchTemplateList = vi.mocked(fetchTemplateList);

const allTemplates = [
  {
    id: 'auth.login',
    name: 'Login',
    category: 'auth',
    description: 'Login screen with authentication',
    requiredComponentsCount: 5,
    layoutType: 'centered',
    version: '1.0.0',
    tags: ['auth', 'login'],
  },
  {
    id: 'feedback.loading',
    name: 'Loading',
    category: 'feedback',
    description: 'Loading state screen',
    requiredComponentsCount: 2,
    layoutType: 'centered',
    version: '1.0.0',
    tags: ['feedback', 'loading'],
  },
  {
    id: 'dashboard.overview',
    name: 'Dashboard Overview',
    category: 'dashboard',
    description: 'Main dashboard overview',
    requiredComponentsCount: 3,
    layoutType: 'sidebar',
    version: '1.0.0',
    tags: ['dashboard', 'overview'],
  },
];

describe('listScreenTemplatesTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns template metadata with category counts', async () => {
    mockFetchTemplateList
      .mockResolvedValueOnce({ ok: true, data: allTemplates })
      .mockResolvedValueOnce({ ok: true, data: allTemplates });

    const result = await listScreenTemplatesTool({});

    expect(result.success).toBe(true);
    expect(result.count).toBe(3);
    expect(result.templates).toEqual([
      {
        id: 'auth.login',
        name: 'Login',
        category: 'auth',
        description: 'Login screen with authentication',
        requiredComponentsCount: 5,
        layoutType: 'centered',
        version: '1.0.0',
        tags: ['auth', 'login'],
      },
      {
        id: 'feedback.loading',
        name: 'Loading',
        category: 'feedback',
        description: 'Loading state screen',
        requiredComponentsCount: 2,
        layoutType: 'centered',
        version: '1.0.0',
        tags: ['feedback', 'loading'],
      },
      {
        id: 'dashboard.overview',
        name: 'Dashboard Overview',
        category: 'dashboard',
        description: 'Main dashboard overview',
        requiredComponentsCount: 3,
        layoutType: 'sidebar',
        version: '1.0.0',
        tags: ['dashboard', 'overview'],
      },
    ]);
    expect(result.categories).toEqual({
      auth: 1,
      dashboard: 1,
      form: 0,
      marketing: 0,
      feedback: 1,
    });
    expect(mockFetchTemplateList).toHaveBeenNthCalledWith(1, {});
    expect(mockFetchTemplateList).toHaveBeenNthCalledWith(2);
  });

  it('passes category and search filters to the API', async () => {
    mockFetchTemplateList
      .mockResolvedValueOnce({ ok: true, data: [allTemplates[0]] })
      .mockResolvedValueOnce({ ok: true, data: allTemplates });

    const result = await listScreenTemplatesTool({
      category: 'auth',
      search: 'login',
    });

    expect(result.success).toBe(true);
    expect(result.count).toBe(1);
    expect(mockFetchTemplateList).toHaveBeenNthCalledWith(1, {
      category: 'auth',
      search: 'login',
    });
  });

  it('formats API errors for callers', async () => {
    mockFetchTemplateList.mockResolvedValueOnce({
      ok: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'Not authenticated. Run whoami first.',
      },
    });

    const result = await listScreenTemplatesTool({});

    expect(result).toEqual({
      success: false,
      error: 'Authentication failed. Check your login session or API key and try again.',
    });
  });
});
