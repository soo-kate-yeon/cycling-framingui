/**
 * Global authentication state for MCP server
 * SPEC-DEPLOY-001 Phase 4.1: MCP Server Authentication Layer
 */

import type { VerifyResponse } from './verify.js';
import { MemoryCache } from './cache.js';
import { info } from '../utils/logger.js';
import { isMasterAccount } from './theme-access.js';

// Cache TTL: 5 minutes (300,000 milliseconds)
const CACHE_TTL_MS = 5 * 60 * 1000;

// Global authentication data cache
const authCache = new MemoryCache<VerifyResponse>();

// Current authentication state
let currentAuthData: VerifyResponse | null = null;

// Raw API key (API 데이터 클라이언트에서 Bearer 헤더로 사용)
let rawApiKey: string | null = null;

/**
 * Set authentication data and cache it
 * @param authData - Verification response from API
 */
export function setAuthData(authData: VerifyResponse | null): void {
  currentAuthData = authData;

  if (authData && authData.valid) {
    authCache.set('auth', authData, CACHE_TTL_MS);
    info('Authentication data cached for 5 minutes');
  }
}

/**
 * Get current authentication data
 * @returns Current authentication data or null if not authenticated
 */
export function getAuthData(): VerifyResponse | null {
  // Try to get from cache first
  const cachedAuth = authCache.get('auth');

  if (cachedAuth) {
    info('Using cached authentication data');
    return cachedAuth;
  }

  // Return current state
  return currentAuthData;
}

/**
 * Store raw API key for data-client API calls
 */
export function setRawApiKey(apiKey: string | null): void {
  rawApiKey = apiKey;
}

/**
 * Get raw API key for data-client API calls
 */
export function getRawApiKey(): string | null {
  return rawApiKey;
}

/**
 * Clear authentication data and cache
 */
export function clearAuthData(): void {
  currentAuthData = null;
  rawApiKey = null;
  authCache.clear();
  info('Authentication data cleared');
}

/**
 * Check if user is authenticated
 * @returns true if authenticated with valid data
 */
export function isAuthenticated(): boolean {
  const authData = getAuthData();
  return authData !== null && authData.valid === true;
}

/**
 * Get accessible theme IDs based on current authentication
 * 마스터 계정: 모든 테마 접근 가능
 * 일반 사용자: 라이선스 보유 테마만 반환
 * @param allThemeIds - All available theme IDs
 * @returns Array of accessible theme IDs
 */
export function getAccessibleThemes(allThemeIds: string[]): string[] {
  const authData = getAuthData();

  // 인증 없음: 접근 가능 테마 없음
  if (!authData || !authData.valid) {
    return [];
  }

  // 마스터 계정: 모든 테마 접근 가능
  const email = authData.user?.email;
  if (email && isMasterAccount(email)) {
    return [...allThemeIds];
  }

  // 일반 사용자: 라이선스 보유 테마만
  const licensedThemes = authData.themes?.licensed || [];
  const accessibleThemes = new Set(licensedThemes);

  // 실제 존재하는 테마만 필터링
  return allThemeIds.filter(id => accessibleThemes.has(id));
}
