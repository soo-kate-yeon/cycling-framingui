/**
 * Global authentication state for MCP server
 * SPEC-DEPLOY-001 Phase 4.1: MCP Server Authentication Layer
 */

import type { VerifyResponse } from './verify.js';
import { MemoryCache } from './cache.js';
import { info } from '../utils/logger.js';
import { isMasterAccount } from './theme-access.js';
import { loadCredentials } from '../cli/credentials.js';

// Cache TTL: 5 minutes (300,000 milliseconds)
const CACHE_TTL_MS = 5 * 60 * 1000;

interface FraminguiAuthState {
  authCache: MemoryCache<VerifyResponse>;
  currentAuthData: VerifyResponse | null;
  authStateExplicitlySet: boolean;
  rawApiKey: string | null;
}

declare global {
  var __framinguiAuthState: FraminguiAuthState | undefined;
}

function getGlobalAuthState(): FraminguiAuthState {
  globalThis.__framinguiAuthState ??= {
    authCache: new MemoryCache<VerifyResponse>(),
    currentAuthData: null,
    authStateExplicitlySet: false,
    rawApiKey: null,
  };

  return globalThis.__framinguiAuthState;
}

/**
 * Set authentication data and cache it
 * @param authData - Verification response from API
 */
export function setAuthData(authData: VerifyResponse | null): void {
  const state = getGlobalAuthState();
  state.currentAuthData = authData;
  state.authStateExplicitlySet = true;

  if (authData && authData.valid) {
    state.authCache.set('auth', authData, CACHE_TTL_MS);
    info('Authentication data cached for 5 minutes');
  }
}

/**
 * Get current authentication data
 * @returns Current authentication data or null if not authenticated
 */
export function getAuthData(): VerifyResponse | null {
  const state = getGlobalAuthState();

  // Try to get from cache first
  const cachedAuth = state.authCache.get('auth');

  if (cachedAuth) {
    info('Using cached authentication data');
    return cachedAuth;
  }

  if (!state.authStateExplicitlySet) {
    const credentials = loadCredentials();
    if (credentials?.api_key) {
      state.rawApiKey = state.rawApiKey ?? credentials.api_key;
      state.currentAuthData = {
        valid: true,
        user: {
          id: 'credentials-user',
          email: credentials.user_email,
          plan: 'pro',
        },
        themes: { licensed: [] },
      };
      return state.currentAuthData;
    }
  }

  // Return current state
  return state.currentAuthData;
}

/**
 * Whether auth state was explicitly injected via login/verify/test helpers.
 * When false, the server is operating on credential-file fallback only.
 */
export function isAuthStateExplicitlySet(): boolean {
  return getGlobalAuthState().authStateExplicitlySet;
}

/**
 * Store raw API key for data-client API calls
 */
export function setRawApiKey(apiKey: string | null): void {
  getGlobalAuthState().rawApiKey = apiKey;
}

/**
 * Get raw API key for data-client API calls
 */
export function getRawApiKey(): string | null {
  const state = getGlobalAuthState();

  if (!state.rawApiKey) {
    const credentials = loadCredentials();
    if (credentials?.api_key) {
      state.rawApiKey = credentials.api_key;
    }
  }
  return state.rawApiKey;
}

/**
 * Clear authentication data and cache
 */
export function clearAuthData(): void {
  const state = getGlobalAuthState();
  state.currentAuthData = null;
  state.rawApiKey = null;
  state.authStateExplicitlySet = false;
  state.authCache.clear();
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
