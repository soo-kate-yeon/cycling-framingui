/**
 * data-client.ts 테스트
 * SPEC-MCP-007 Phase 2 - fetchTemplateList, fetchTemplate, fetchComponentList,
 * fetchComponent, fetchTokenList, fetchCSSVariables, fetchScreenExamples
 *
 * 테스트 시나리오:
 * 1. 캐시 미스: fetch 호출 → 결과 반환
 * 2. API 실패 + 캐시 없음: 빈 배열/null 반환
 * 3. 인증 없음: fetch 호출 없이 빈 배열/null 반환
 * 4. URL 파라미터 전달 확인
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// vi.mock 호이스팅: factory 안에서 참조할 mock 함수를 vi.hoisted()로 선언
// ─────────────────────────────────────────────────────────────────────────────
const { mockGetAuthData, mockGetRawApiKey, mockResolveFraminguiApiUrl } = vi.hoisted(() => ({
  mockGetAuthData: vi.fn(),
  mockGetRawApiKey: vi.fn(),
  mockResolveFraminguiApiUrl: vi.fn(),
}));

// data-client.ts가 .js 확장자로 import하므로 mock도 동일 경로 사용
vi.mock('../auth/state.js', () => ({
  getAuthData: mockGetAuthData,
  getRawApiKey: mockGetRawApiKey,
}));

vi.mock('../utils/api-url.js', () => ({
  resolveFraminguiApiUrl: mockResolveFraminguiApiUrl,
}));

vi.mock('../utils/logger.js', () => ({
  info: vi.fn(),
  error: vi.fn(),
}));

// MemoryCache를 mock으로 교체 - 캐시가 항상 miss인 상태로 테스트
// (data-client.ts의 스코프에서 MemoryCache new 호출 결과를 제어)
vi.mock('../auth/cache.js', () => {
  return {
    MemoryCache: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockReturnValue(null), // 캐시 미스
      getStale: vi.fn().mockReturnValue(null), // stale 캐시도 없음
      set: vi.fn(),
      delete: vi.fn(),
      clear: vi.fn(),
      size: vi.fn().mockReturnValue(0),
    })),
  };
});

// global fetch 목업
const mockFetch = vi.fn();
global.fetch = mockFetch;

// ─────────────────────────────────────────────────────────────────────────────
// 테스트 대상 import (.ts 확장자로 직접 import해서 최신 소스 사용)
// ─────────────────────────────────────────────────────────────────────────────

import {
  fetchTemplateList,
  fetchTemplate,
  fetchComponentList,
  fetchComponent,
  fetchTokenList,
  fetchCSSVariables,
  fetchScreenExamples,
} from '../api/data-client.js';

// ─────────────────────────────────────────────────────────────────────────────
// 헬퍼
// ─────────────────────────────────────────────────────────────────────────────
function makeOkResponse(body: unknown) {
  return {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue(body),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 공통 beforeEach
// ─────────────────────────────────────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
  mockGetAuthData.mockReturnValue({ valid: true });
  mockGetRawApiKey.mockReturnValue(
    'tk_live_test_key_00000000000000000000000000000000000000000000000000000000000000000'
  );
  mockResolveFraminguiApiUrl.mockReturnValue({ apiUrl: 'https://framingui.com' });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchTemplateList
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchTemplateList()', () => {
  it('API 성공 시 템플릿 목록을 반환한다', async () => {
    const templates = [
      {
        id: 'dashboard',
        name: 'Dashboard',
        category: 'web',
        description: '',
        requiredComponentsCount: 3,
      },
    ];
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, templates }));

    const result = await fetchTemplateList();

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('dashboard');
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  it('category 파라미터를 쿼리스트링으로 전달한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, templates: [] }));

    await fetchTemplateList({ category: 'mobile' });

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('category=mobile');
  });

  it('search 파라미터를 쿼리스트링으로 전달한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, templates: [] }));

    await fetchTemplateList({ search: 'login' });

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('search=login');
  });

  it('API 실패 시 빈 배열을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchTemplateList();

    expect(result).toEqual([]);
  });

  it('fetch 네트워크 오류 시 빈 배열을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchTemplateList();

    expect(result).toEqual([]);
  });

  it('인증 없는 상태에서 빈 배열을 반환한다', async () => {
    mockGetAuthData.mockReturnValue(null);

    const result = await fetchTemplateList();

    expect(result).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchTemplate
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchTemplate()', () => {
  it('API 성공 시 템플릿 상세를 반환한다', async () => {
    const template = { id: 'dashboard', name: 'Dashboard', sections: [] };
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, template }));

    const result = await fetchTemplate('dashboard');

    expect(result).not.toBeNull();
    expect(result.id).toBe('dashboard');
  });

  it('API 실패 시 null을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchTemplate('nonexistent');

    expect(result).toBeNull();
  });

  it('fetch 네트워크 오류 시 null을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchTemplate('dashboard');

    expect(result).toBeNull();
  });

  it('ID가 URL 인코딩되어 전달된다', async () => {
    mockFetch.mockResolvedValueOnce(
      makeOkResponse({ success: true, template: { id: 'my template' } })
    );

    await fetchTemplate('my template');

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('my%20template');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchComponentList
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchComponentList()', () => {
  it('API 성공 시 컴포넌트 목록을 반환한다', async () => {
    const components = [
      {
        id: 'button',
        name: 'Button',
        category: 'core',
        tier: 1,
        description: '',
        variantsCount: 6,
        hasSubComponents: false,
      },
    ];
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, components }));

    const result = await fetchComponentList();

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe('button');
  });

  it('API 실패 시 빈 배열을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchComponentList();

    expect(result).toEqual([]);
  });

  it('fetch 네트워크 오류 시 빈 배열을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchComponentList();

    expect(result).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchComponent
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchComponent()', () => {
  it('API 성공 시 컴포넌트 상세를 반환한다', async () => {
    const component = {
      id: 'button',
      name: 'Button',
      category: 'core',
      tier: 1,
      description: 'Button desc',
      variantsCount: 6,
      hasSubComponents: false,
      props: [],
      variants: [],
    };
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, component }));

    const result = await fetchComponent('button');

    expect(result).not.toBeNull();
    expect(result?.id).toBe('button');
    expect(result?.props).toBeDefined();
  });

  it('API 실패 시 null을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchComponent('nonexistent');

    expect(result).toBeNull();
  });

  it('fetch 네트워크 오류 시 null을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchComponent('button');

    expect(result).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchTokenList
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchTokenList()', () => {
  it('type=all 요청 시 shells/pages/sections 포함 응답을 반환한다', async () => {
    const responseBody = {
      success: true,
      shells: [{ id: 'shell.web.dashboard' }],
      pages: [{ id: 'page.dashboard' }],
      sections: [{ id: 'section.container' }],
      metadata: { total: 3 },
    };
    mockFetch.mockResolvedValueOnce(makeOkResponse(responseBody));

    const result = await fetchTokenList('all');

    expect(result.metadata.total).toBe(3);
    expect(result.shells).toHaveLength(1);
    expect(result.pages).toHaveLength(1);
    expect(result.sections).toHaveLength(1);
  });

  it('type=shell 쿼리파라미터가 전달된다', async () => {
    mockFetch.mockResolvedValueOnce(
      makeOkResponse({ success: true, shells: [], metadata: { total: 0 } })
    );

    await fetchTokenList('shell');

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('type=shell');
  });

  it('API 실패 시 빈 metadata를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchTokenList('all');

    expect(result.metadata.total).toBe(0);
    expect(result.shells).toBeUndefined();
  });

  it('tokenType 미지정 시 type=all로 요청된다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, metadata: { total: 0 } }));

    await fetchTokenList();

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('type=all');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchCSSVariables
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchCSSVariables()', () => {
  it('API 성공 시 CSS 문자열을 반환한다', async () => {
    const css = ':root { --color-brand-500: oklch(0.5 0.2 240); }';
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, css }));

    const result = await fetchCSSVariables('square-minimalism');

    expect(result).toBe(css);
    expect(result).toContain(':root');
  });

  it('API 실패 시 null을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchCSSVariables('nonexistent');

    expect(result).toBeNull();
  });

  it('fetch 네트워크 오류 시 null을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchCSSVariables('square-minimalism');

    expect(result).toBeNull();
  });

  it('themeId와 /css 경로가 URL에 포함된다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, css: ':root {}' }));

    await fetchCSSVariables('dark-boldness');

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('dark-boldness');
    expect(calledUrl).toContain('/css');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchScreenExamples
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchScreenExamples()', () => {
  it('API 성공 시 스크린 예제 목록을 반환한다', async () => {
    const examples = [
      { name: 'Team Grid', description: 'Grid layout', definition: { id: 'team-grid' } },
      { name: 'Login Form', description: 'Auth screen', definition: { id: 'login-screen' } },
    ];
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, examples }));

    const result = await fetchScreenExamples();

    expect(result).toHaveLength(2);
    expect(result[0]!.name).toBe('Team Grid');
    expect(result[1]!.definition.id).toBe('login-screen');
  });

  it('API 실패 시 빈 배열을 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchScreenExamples();

    expect(result).toEqual([]);
  });

  it('fetch 네트워크 오류 시 빈 배열을 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchScreenExamples();

    expect(result).toEqual([]);
  });

  it('응답 예제에 name, description, definition이 포함된다', async () => {
    const examples = [
      {
        name: 'Dashboard',
        description: 'Analytics',
        definition: { id: 'dashboard-overview', shell: 'shell.web.dashboard' },
      },
    ];
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, examples }));

    const result = await fetchScreenExamples();

    expect(result[0]!).toHaveProperty('name');
    expect(result[0]!).toHaveProperty('description');
    expect(result[0]!).toHaveProperty('definition');
    expect(result[0]!.definition.shell).toBe('shell.web.dashboard');
  });
});
