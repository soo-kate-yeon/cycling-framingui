/**
 * data-client.ts 테스트 (v2 - ApiResult 기반)
 * SPEC-MCP-007 Phase 2 - fetchTemplateList, fetchTemplate, fetchComponentList,
 * fetchComponent, fetchTokenList, fetchCSSVariables, fetchScreenExamples
 *
 * 테스트 시나리오:
 * 1. 캐시 미스: fetch 호출 → ApiResult 성공 반환
 * 2. API 실패 + 캐시 없음: ApiResult 에러 반환
 * 3. 인증 없음: fetch 호출 없이 NOT_AUTHENTICATED 에러 반환
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
vi.mock('../auth/cache.js', () => {
  return {
    MemoryCache: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockReturnValue(null),
      getStale: vi.fn().mockReturnValue(null),
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
// 테스트 대상 import
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

function makeErrorResponse(status: number, body: unknown) {
  return {
    ok: false,
    status,
    statusText: 'Error',
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
  it('API 성공 시 ok: true와 템플릿 목록을 반환한다', async () => {
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]!.id).toBe('dashboard');
    }
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

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchTemplateList();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('SERVER_ERROR');
    }
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchTemplateList();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });

  it('인증 없는 상태에서 NOT_AUTHENTICATED를 반환한다', async () => {
    mockGetAuthData.mockReturnValue(null);

    const result = await fetchTemplateList();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NOT_AUTHENTICATED');
    }
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchTemplate
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchTemplate()', () => {
  it('API 성공 시 ok: true와 템플릿 상세를 반환한다', async () => {
    const template = { id: 'dashboard', name: 'Dashboard', sections: [] };
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, template }));

    const result = await fetchTemplate('dashboard');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe('dashboard');
    }
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchTemplate('nonexistent');

    expect(result.ok).toBe(false);
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchTemplate('dashboard');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
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
  it('API 성공 시 ok: true와 컴포넌트 목록을 반환한다', async () => {
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0]!.id).toBe('button');
    }
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchComponentList();

    expect(result.ok).toBe(false);
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchComponentList();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchComponent
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchComponent()', () => {
  it('API 성공 시 ok: true와 컴포넌트 상세를 반환한다', async () => {
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.id).toBe('button');
      expect(result.data.props).toBeDefined();
    }
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchComponent('nonexistent');

    expect(result.ok).toBe(false);
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchComponent('button');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// fetchTokenList
// ─────────────────────────────────────────────────────────────────────────────
describe('fetchTokenList()', () => {
  it('type=all 요청 시 ok: true와 shells/pages/sections를 반환한다', async () => {
    const responseBody = {
      success: true,
      shells: [{ id: 'shell.web.dashboard' }],
      pages: [{ id: 'page.dashboard' }],
      sections: [{ id: 'section.container' }],
      metadata: { total: 3 },
    };
    mockFetch.mockResolvedValueOnce(makeOkResponse(responseBody));

    const result = await fetchTokenList('all');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.metadata.total).toBe(3);
      expect(result.data.shells).toHaveLength(1);
      expect(result.data.pages).toHaveLength(1);
      expect(result.data.sections).toHaveLength(1);
    }
  });

  it('type=shell 쿼리파라미터가 전달된다', async () => {
    mockFetch.mockResolvedValueOnce(
      makeOkResponse({ success: true, shells: [], metadata: { total: 0 } })
    );

    await fetchTokenList('shell');

    const calledUrl = mockFetch.mock.calls[0]![0] as string;
    expect(calledUrl).toContain('type=shell');
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchTokenList('all');

    expect(result.ok).toBe(false);
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
  it('API 성공 시 ok: true와 CSS 문자열을 반환한다', async () => {
    const css = ':root { --color-brand-500: oklch(0.5 0.2 240); }';
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, css }));

    const result = await fetchCSSVariables('square-minimalism');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBe(css);
      expect(result.data).toContain(':root');
    }
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false, error: 'not found' }));

    const result = await fetchCSSVariables('nonexistent');

    expect(result.ok).toBe(false);
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('timeout'));

    const result = await fetchCSSVariables('square-minimalism');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
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
  it('API 성공 시 ok: true와 스크린 예제 목록을 반환한다', async () => {
    const examples = [
      { name: 'Team Grid', description: 'Grid layout', definition: { id: 'team-grid' } },
      { name: 'Login Form', description: 'Auth screen', definition: { id: 'login-screen' } },
    ];
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: true, examples }));

    const result = await fetchScreenExamples();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.data[0]!.name).toBe('Team Grid');
      expect(result.data[1]!.definition.id).toBe('login-screen');
    }
  });

  it('API 응답 success: false 시 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeOkResponse({ success: false }));

    const result = await fetchScreenExamples();

    expect(result.ok).toBe(false);
  });

  it('fetch 네트워크 오류 시 NETWORK_ERROR를 반환한다', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchScreenExamples();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('NETWORK_ERROR');
    }
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

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data[0]!).toHaveProperty('name');
      expect(result.data[0]!).toHaveProperty('description');
      expect(result.data[0]!).toHaveProperty('definition');
      expect(result.data[0]!.definition.shell).toBe('shell.web.dashboard');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HTTP 에러 코드 분류 테스트
// ─────────────────────────────────────────────────────────────────────────────
describe('HTTP 에러 코드 분류', () => {
  it('401 응답 시 AUTH_FAILED 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(401, { error: 'unauthorized' }));

    const result = await fetchTemplate('pebble');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('AUTH_FAILED');
      expect(result.error.status).toBe(401);
    }
  });

  it('403 응답 시 FORBIDDEN 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(
      makeErrorResponse(403, { error: 'Theme "pebble" is not included in your license.' })
    );

    const result = await fetchTemplate('pebble');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('FORBIDDEN');
      expect(result.error.message).toContain('not included');
    }
  });

  it('429 응답 시 RATE_LIMITED 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(429, { error: 'Too many requests' }));

    const result = await fetchTemplate('pebble');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('RATE_LIMITED');
    }
  });

  it('500 응답 시 SERVER_ERROR 에러를 반환한다', async () => {
    mockFetch.mockResolvedValueOnce(makeErrorResponse(500, { error: 'Internal server error' }));

    const result = await fetchTemplate('pebble');

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe('SERVER_ERROR');
      expect(result.error.status).toBe(500);
    }
  });
});
