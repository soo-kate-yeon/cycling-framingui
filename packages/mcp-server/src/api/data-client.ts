/**
 * MCP 서버 API 데이터 클라이언트
 * 로컬 파일 시스템 읽기를 framingui.com API fetch로 대체
 *
 * 기존 인프라 재사용:
 * - resolveFraminguiApiUrl(): base URL 결정
 * - getAuthData(): API key 가져오기
 * - MemoryCache: 인메모리 캐시 (TTL: 10분)
 */

import { resolveFraminguiApiUrl } from '../utils/api-url.js';
import { getAuthData, getRawApiKey } from '../auth/state.js';
import { MemoryCache } from '../auth/cache.js';
import { info, error as logError } from '../utils/logger.js';

// 캐시 TTL: 10분
const CACHE_TTL_MS = 10 * 60 * 1000;

// 테마 메타데이터 타입 (API 응답에서 사용)
export interface ThemeMeta {
  id: string;
  name: string;
  description?: string;
  brandTone: string;
  schemaVersion: string;
}

// 아이콘 라이브러리 메타데이터 타입
export interface IconLibMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  license: string;
  totalIcons: number;
  categories: string[];
}

// 인메모리 캐시 인스턴스
const themeListCache = new MemoryCache<ThemeMeta[]>();
const themeCache = new MemoryCache<any>(); // ThemeV2 전체 JSON
const iconLibListCache = new MemoryCache<IconLibMeta[]>();
const iconLibCache = new MemoryCache<any>(); // IconLibrary 전체 JSON

/**
 * API 요청 공통 헬퍼
 */
async function apiFetch<T>(path: string): Promise<T | null> {
  const authData = getAuthData();
  if (!authData?.valid) {
    logError(`[data-client] Not authenticated, cannot fetch ${path}`);
    return null;
  }

  const apiKey = getRawApiKey();
  if (!apiKey) {
    logError('[data-client] No raw API key available');
    return null;
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
      logError(`[data-client] API error: ${response.status} ${response.statusText} for ${path}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logError(`[data-client] Network error for ${path}: ${msg}`);
    return null;
  }
}

/**
 * 테마 목록 조회 (라이선스 보유 테마만)
 */
export async function fetchThemeList(): Promise<ThemeMeta[]> {
  // 캐시 확인
  const cached = themeListCache.get('list');
  if (cached) {
    info('[data-client] Using cached theme list');
    return cached;
  }

  const data = await apiFetch<{ success: boolean; themes?: ThemeMeta[]; error?: string }>(
    '/api/mcp/themes'
  );

  if (!data?.success || !data.themes) {
    logError(`[data-client] Failed to fetch theme list: ${data?.error || 'unknown'}`);
    return [];
  }

  themeListCache.set('list', data.themes, CACHE_TTL_MS);
  info(`[data-client] Cached ${data.themes.length} themes`);
  return data.themes;
}

/**
 * 단일 테마 상세 조회 (전체 ThemeV2 JSON)
 */
export async function fetchTheme(themeId: string): Promise<any | null> {
  // 캐시 확인
  const cached = themeCache.get(themeId);
  if (cached) {
    info(`[data-client] Using cached theme: ${themeId}`);
    return cached;
  }

  const data = await apiFetch<{ success: boolean; theme?: any; error?: string }>(
    `/api/mcp/themes/${encodeURIComponent(themeId)}`
  );

  if (!data?.success || !data.theme) {
    logError(`[data-client] Failed to fetch theme "${themeId}": ${data?.error || 'unknown'}`);
    return null;
  }

  themeCache.set(themeId, data.theme, CACHE_TTL_MS);
  info(`[data-client] Cached theme: ${themeId}`);
  return data.theme;
}

/**
 * 아이콘 라이브러리 목록 조회
 */
export async function fetchIconLibraryList(): Promise<IconLibMeta[]> {
  const cached = iconLibListCache.get('list');
  if (cached) {
    info('[data-client] Using cached icon library list');
    return cached;
  }

  const data = await apiFetch<{ success: boolean; libraries?: IconLibMeta[]; error?: string }>(
    '/api/mcp/icon-libraries'
  );

  if (!data?.success || !data.libraries) {
    logError(`[data-client] Failed to fetch icon library list: ${data?.error || 'unknown'}`);
    return [];
  }

  iconLibListCache.set('list', data.libraries, CACHE_TTL_MS);
  info(`[data-client] Cached ${data.libraries.length} icon libraries`);
  return data.libraries;
}

/**
 * 단일 아이콘 라이브러리 상세 조회 (전체 IconLibrary JSON)
 */
export async function fetchIconLibrary(libraryId: string): Promise<any | null> {
  const cached = iconLibCache.get(libraryId);
  if (cached) {
    info(`[data-client] Using cached icon library: ${libraryId}`);
    return cached;
  }

  const data = await apiFetch<{ success: boolean; library?: any; error?: string }>(
    `/api/mcp/icon-libraries/${encodeURIComponent(libraryId)}`
  );

  if (!data?.success || !data.library) {
    logError(
      `[data-client] Failed to fetch icon library "${libraryId}": ${data?.error || 'unknown'}`
    );
    return null;
  }

  iconLibCache.set(libraryId, data.library, CACHE_TTL_MS);
  info(`[data-client] Cached icon library: ${libraryId}`);
  return data.library;
}
