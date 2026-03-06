/**
 * MCP 서버 API 데이터 클라이언트 (v2 - ApiResult 기반)
 *
 * 변경 이력:
 * - v1: T | null 반환 → 모든 실패가 null로 통일되어 에러 유형 구분 불가
 * - v2: ApiResult<T> 반환 → 에러 코드 기반 분류로 tool이 적절한 메시지 제공
 *
 * 기존 인프라 재사용:
 * - resolveFraminguiApiUrl(): base URL 결정
 * - getAuthData(): 인증 상태 확인
 * - getRawApiKey(): Bearer 토큰
 * - MemoryCache: 인메모리 캐시 (TTL: 10분, stale fallback 지원)
 */

import { resolveFraminguiApiUrl } from '../utils/api-url.js';
import { getAuthData, getRawApiKey } from '../auth/state.js';
import { MemoryCache } from '../auth/cache.js';
import { info, error as logError } from '../utils/logger.js';
import type { ApiResult } from './api-result.js';
import { mapStatusToErrorCode } from './api-result.js';

// 캐시 TTL: 10분
const CACHE_TTL_MS = 10 * 60 * 1000;

// ============================================================================
// 타입 정의
// ============================================================================

export interface ThemeMeta {
  id: string;
  name: string;
  description?: string;
  brandTone: string;
  schemaVersion: string;
}

export interface IconLibMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  license: string;
  totalIcons: number;
  categories: string[];
}

export interface ComponentMeta {
  id: string;
  name: string;
  category: string;
  tier: number;
  description: string;
  variantsCount: number;
  hasSubComponents: boolean;
}

export interface ComponentDetail extends ComponentMeta {
  props?: any[];
  variants?: any[];
  subComponents?: string[];
  importStatement?: string;
  dependencies?: { internal: string[]; external: string[] };
  examples?: any[];
  accessibility?: string;
}

export interface TemplateMeta {
  id: string;
  name: string;
  category: string;
  description: string;
  requiredComponentsCount: number;
  layoutType?: string;
  version?: string;
  tags?: string[];
}

export interface TokenListResponse {
  shells?: any[];
  pages?: any[];
  sections?: any[];
  metadata: { total: number };
}

export interface ScreenExample {
  name: string;
  description: string;
  definition: any;
}

// ============================================================================
// 캐시 인스턴스
// ============================================================================

const themeListCache = new MemoryCache<ThemeMeta[]>();
const themeCache = new MemoryCache<any>();
const iconLibListCache = new MemoryCache<IconLibMeta[]>();
const iconLibCache = new MemoryCache<any>();
const templateListCache = new MemoryCache<TemplateMeta[]>();
const templateCache = new MemoryCache<any>();
const componentListCache = new MemoryCache<ComponentMeta[]>();
const componentCache = new MemoryCache<ComponentDetail>();
const tokenCache = new MemoryCache<TokenListResponse>();
const cssCache = new MemoryCache<string>();
const screenExamplesCache = new MemoryCache<ScreenExample[]>();

// ============================================================================
// API 요청 핵심 함수
// ============================================================================

/**
 * API 요청 공통 헬퍼 (v2: ApiResult 반환)
 *
 * 기존 null 반환 대신 에러 유형을 명확히 구분:
 * - NOT_AUTHENTICATED: 로컬 인증 미완료
 * - AUTH_FAILED (401): API key 만료/무효
 * - FORBIDDEN (403): 라이선스 미보유
 * - NOT_FOUND (404): 리소스 없음
 * - RATE_LIMITED (429): 요청 한도 초과
 * - SERVER_ERROR (5xx): 서버 오류
 * - NETWORK_ERROR: 네트워크 연결 실패
 */
async function apiFetch<T>(path: string): Promise<ApiResult<T>> {
  const authData = getAuthData();
  if (!authData?.valid) {
    logError(`[data-client] Not authenticated, cannot fetch ${path}`);
    return {
      ok: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'Not authenticated. Run whoami first.',
      },
    };
  }

  const apiKey = getRawApiKey();
  if (!apiKey) {
    logError('[data-client] No raw API key available');
    return {
      ok: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'No API key available. Run whoami or re-authenticate.',
      },
    };
  }

  const { apiUrl } = resolveFraminguiApiUrl(process.env.FRAMINGUI_API_URL);
  const url = `${apiUrl}${path}`;

  try {
    info(`[data-client] Fetching: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorCode = mapStatusToErrorCode(response.status);
      let message = `${response.status} ${response.statusText}`;

      // API 응답 본문에서 상세 에러 메시지 추출
      try {
        const body = (await response.json()) as Record<string, unknown>;
        if (typeof body.error === 'string') {
          message = body.error;
        } else if (typeof body.message === 'string') {
          message = body.message;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 유지
      }

      logError(`[data-client] API error for ${path}: [${errorCode}] ${message}`);
      return {
        ok: false,
        error: { code: errorCode, status: response.status, message },
      };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logError(`[data-client] Network error for ${path}: ${msg}`);
    return {
      ok: false,
      error: { code: 'NETWORK_ERROR', message: msg },
    };
  }
}

// ============================================================================
// 캐시 + Stale Fallback 헬퍼
// ============================================================================

/**
 * 캐시 조회 → API 호출 → stale fallback 통합 패턴
 */
async function fetchWithCache<TApi, TResult>(options: {
  cache: MemoryCache<TResult>;
  cacheKey: string;
  apiPath: string;
  extract: (data: TApi) => TResult | null;
  validate?: (data: TApi) => boolean;
}): Promise<ApiResult<TResult>> {
  const { cache, cacheKey, apiPath, extract, validate } = options;

  // 1. 캐시 확인
  const cached = cache.get(cacheKey);
  if (cached !== null) {
    info(`[data-client] Cache hit: ${cacheKey}`);
    return { ok: true, data: cached };
  }

  // 2. API 호출
  const result = await apiFetch<TApi>(apiPath);

  if (!result.ok) {
    // 3. API 실패 시 stale 캐시 fallback
    const stale = cache.getStale(cacheKey);
    if (stale !== null) {
      info(`[data-client] Using stale cache fallback: ${cacheKey}`);
      return { ok: true, data: stale };
    }
    return result;
  }

  // 4. API 응답 검증
  const data = result.data;
  if (validate && !validate(data)) {
    const stale = cache.getStale(cacheKey);
    if (stale !== null) {
      info(`[data-client] API response invalid, using stale: ${cacheKey}`);
      return { ok: true, data: stale };
    }
    return {
      ok: false,
      error: { code: 'SERVER_ERROR', message: `Invalid API response for ${apiPath}` },
    };
  }

  // 5. 데이터 추출 + 캐시 저장
  const extracted = extract(data);
  if (extracted === null) {
    return {
      ok: false,
      error: { code: 'NOT_FOUND', message: `No data returned from ${apiPath}` },
    };
  }

  cache.set(cacheKey, extracted, CACHE_TTL_MS);
  info(`[data-client] Cached: ${cacheKey}`);
  return { ok: true, data: extracted };
}

// ============================================================================
// Public API 함수들
// ============================================================================

/**
 * 테마 목록 조회 (라이선스 보유 테마만)
 */
export async function fetchThemeList(): Promise<ApiResult<ThemeMeta[]>> {
  return fetchWithCache<{ success: boolean; themes?: ThemeMeta[]; error?: string }, ThemeMeta[]>({
    cache: themeListCache,
    cacheKey: 'list',
    apiPath: '/api/mcp/themes',
    validate: data => data.success === true,
    extract: data => data.themes ?? null,
  });
}

/**
 * 단일 테마 상세 조회 (전체 ThemeV2 JSON)
 */
export async function fetchTheme(themeId: string): Promise<ApiResult<any>> {
  return fetchWithCache<{ success: boolean; theme?: any; error?: string }, any>({
    cache: themeCache,
    cacheKey: themeId,
    apiPath: `/api/mcp/themes/${encodeURIComponent(themeId)}`,
    validate: data => data.success === true,
    extract: data => data.theme ?? null,
  });
}

/**
 * 아이콘 라이브러리 목록 조회
 */
export async function fetchIconLibraryList(): Promise<ApiResult<IconLibMeta[]>> {
  return fetchWithCache<
    { success: boolean; libraries?: IconLibMeta[]; error?: string },
    IconLibMeta[]
  >({
    cache: iconLibListCache,
    cacheKey: 'list',
    apiPath: '/api/mcp/icon-libraries',
    validate: data => data.success === true,
    extract: data => data.libraries ?? null,
  });
}

/**
 * 단일 아이콘 라이브러리 상세 조회
 */
export async function fetchIconLibrary(libraryId: string): Promise<ApiResult<any>> {
  return fetchWithCache<{ success: boolean; library?: any; error?: string }, any>({
    cache: iconLibCache,
    cacheKey: libraryId,
    apiPath: `/api/mcp/icon-libraries/${encodeURIComponent(libraryId)}`,
    validate: data => data.success === true,
    extract: data => data.library ?? null,
  });
}

/**
 * 스크린 템플릿 목록 조회
 */
export async function fetchTemplateList(params?: {
  category?: string;
  search?: string;
}): Promise<ApiResult<TemplateMeta[]>> {
  const queryParams = new URLSearchParams();
  if (params?.category) {
    queryParams.set('category', params.category);
  }
  if (params?.search) {
    queryParams.set('search', params.search);
  }
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const cacheKey = params?.category
    ? `list:${params.category}${params.search ? `:${params.search}` : ''}`
    : 'list';

  return fetchWithCache<
    { success: boolean; templates?: TemplateMeta[]; error?: string },
    TemplateMeta[]
  >({
    cache: templateListCache,
    cacheKey,
    apiPath: `/api/mcp/templates${query}`,
    validate: data => data.success === true,
    extract: data => data.templates ?? null,
  });
}

/**
 * 단일 스크린 템플릿 상세 조회
 */
export async function fetchTemplate(templateId: string): Promise<ApiResult<any>> {
  return fetchWithCache<{ success: boolean; template?: any; error?: string }, any>({
    cache: templateCache,
    cacheKey: templateId,
    apiPath: `/api/mcp/templates/${encodeURIComponent(templateId)}`,
    validate: data => data.success === true,
    extract: data => data.template ?? null,
  });
}

/**
 * UI 컴포넌트 목록 조회
 */
export async function fetchComponentList(): Promise<ApiResult<ComponentMeta[]>> {
  return fetchWithCache<
    { success: boolean; components?: ComponentMeta[]; error?: string },
    ComponentMeta[]
  >({
    cache: componentListCache,
    cacheKey: 'list',
    apiPath: '/api/mcp/components',
    validate: data => data.success === true,
    extract: data => data.components ?? null,
  });
}

/**
 * 단일 컴포넌트 상세 조회
 */
export async function fetchComponent(componentId: string): Promise<ApiResult<ComponentDetail>> {
  return fetchWithCache<
    { success: boolean; component?: ComponentDetail; error?: string },
    ComponentDetail
  >({
    cache: componentCache,
    cacheKey: componentId,
    apiPath: `/api/mcp/components/${encodeURIComponent(componentId)}`,
    validate: data => data.success === true,
    extract: data => data.component ?? null,
  });
}

/**
 * 레이아웃 토큰 목록 조회
 */
export async function fetchTokenList(
  tokenType?: 'shell' | 'page' | 'section' | 'all'
): Promise<ApiResult<TokenListResponse>> {
  const type = tokenType ?? 'all';

  return fetchWithCache<
    { success: boolean; error?: string } & Partial<TokenListResponse>,
    TokenListResponse
  >({
    cache: tokenCache,
    cacheKey: type,
    apiPath: `/api/mcp/tokens?type=${type}`,
    validate: data => data.success === true,
    extract: data => ({
      shells: data.shells,
      pages: data.pages,
      sections: data.sections,
      metadata: data.metadata ?? { total: 0 },
    }),
  });
}

/**
 * 테마 CSS 변수 문자열 조회
 */
export async function fetchCSSVariables(themeId: string): Promise<ApiResult<string>> {
  return fetchWithCache<{ success: boolean; css?: string; error?: string }, string>({
    cache: cssCache,
    cacheKey: themeId,
    apiPath: `/api/mcp/themes/${encodeURIComponent(themeId)}/css`,
    validate: data => data.success === true,
    extract: data => data.css ?? null,
  });
}

/**
 * 스크린 예제 정의 목록 조회
 */
export async function fetchScreenExamples(): Promise<ApiResult<ScreenExample[]>> {
  return fetchWithCache<
    { success: boolean; examples?: ScreenExample[]; error?: string },
    ScreenExample[]
  >({
    cache: screenExamplesCache,
    cacheKey: 'list',
    apiPath: '/api/mcp/examples/screens',
    validate: data => data.success === true,
    extract: data => data.examples ?? null,
  });
}
