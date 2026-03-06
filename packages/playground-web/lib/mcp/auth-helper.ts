/**
 * MCP API 공통 인증 헬퍼 (v2 - 인증 캐시 포함)
 *
 * 변경 이력:
 * - v1: 매 요청마다 전체 bcrypt + Supabase 조회 반복 (N개 키 × bcrypt = 수백ms)
 * - v2: API key → 인증 결과 캐시 (5분 TTL) + 만료 시 자동 재검증
 *
 * 이점:
 * - MCP 서버가 whoami → preview-theme 연속 호출 시 두 번째부터 캐시 히트
 * - bcrypt 풀 스캔 제거로 응답 시간 대폭 단축
 * - Supabase 쿼리 횟수 감소 (rate limit 소진 방지)
 */

import { createClient as createServerClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import {
  rateLimitMcpVerify,
  createRateLimitErrorResponse,
  createRateLimitHeaders,
} from '@/lib/security/rate-limit';

interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  revoked_at: string | null;
  expires_at: string | null;
  last_used_at: string | null;
}

interface UserLicense {
  id: string;
  user_id: string;
  theme_id: string;
  tier: string;
  type: 'trial' | 'individual' | 'creator';
  is_active: boolean;
  expires_at: string | null;
}

interface UserProfile {
  id: string;
  plan: string;
}

export interface McpAuthResult {
  valid: true;
  userId: string;
  email: string;
  plan: string;
  licensedThemes: string[];
  rateLimitHeaders: Record<string, string>;
}

export interface McpAuthError {
  valid: false;
  response: NextResponse | Response;
}

// ============================================================================
// 인증 캐시 (서버 인스턴스 수명 동안 유지)
// ============================================================================

interface CachedAuth {
  userId: string;
  email: string;
  plan: string;
  licensedThemes: string[];
  apiKeyId: string;
  expiresAt: number; // Date.now() + TTL
}

// API key → 인증 결과 캐시 (5분 TTL)
const AUTH_CACHE = new Map<string, CachedAuth>();
const AUTH_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * API key에서 캐시 키 생성 (보안: 전체 키 저장하지 않음)
 * 첫 16자 + 마지막 8자를 사용하여 충돌 가능성 최소화
 */
function getCacheKey(apiKey: string): string {
  return `${apiKey.substring(0, 16)}...${apiKey.substring(apiKey.length - 8)}`;
}

/**
 * 캐시에서 인증 결과 조회
 */
function getCachedAuth(apiKey: string): CachedAuth | null {
  const key = getCacheKey(apiKey);
  const cached = AUTH_CACHE.get(key);

  if (!cached) {
    return null;
  }

  // TTL 만료 확인
  if (Date.now() > cached.expiresAt) {
    AUTH_CACHE.delete(key);
    return null;
  }

  return cached;
}

/**
 * 인증 결과를 캐시에 저장
 */
function setCachedAuth(apiKey: string, auth: Omit<CachedAuth, 'expiresAt'>): void {
  const key = getCacheKey(apiKey);
  AUTH_CACHE.set(key, {
    ...auth,
    expiresAt: Date.now() + AUTH_CACHE_TTL_MS,
  });

  // 오래된 캐시 엔트리 정리 (100개 초과 시)
  if (AUTH_CACHE.size > 100) {
    const now = Date.now();
    for (const [k, v] of AUTH_CACHE) {
      if (now > v.expiresAt) {
        AUTH_CACHE.delete(k);
      }
    }
  }
}

// ============================================================================
// 공개 API
// ============================================================================

/**
 * MCP API 요청 인증 처리 (v2: 캐시 활용)
 *
 * 흐름:
 * 1. Bearer 토큰 추출 + 형식 검증
 * 2. 캐시 확인 → 히트 시 즉시 반환 (bcrypt 스킵)
 * 3. 캐시 미스 시 전체 인증 수행 → 결과 캐시
 */
export async function authenticateMcpRequest(
  request: NextRequest
): Promise<McpAuthResult | McpAuthError> {
  // 1. Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'Missing or invalid Authorization header' },
        { status: 401 }
      ),
    };
  }

  const apiKey = authHeader.substring(7);

  // 2. Rate Limiting
  const rateLimitResult = await rateLimitMcpVerify(apiKey);
  if (!rateLimitResult.success) {
    return {
      valid: false,
      response: createRateLimitErrorResponse(rateLimitResult),
    };
  }

  // 3. API Key 형식 검증
  if (!apiKey.startsWith('tk_live_') || apiKey.length !== 72) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'Invalid API key format' },
        { status: 401 }
      ),
    };
  }

  // 4. 캐시 확인 → 히트 시 bcrypt + DB 조회 스킵
  const cached = getCachedAuth(apiKey);
  if (cached) {
    return {
      valid: true,
      userId: cached.userId,
      email: cached.email,
      plan: cached.plan,
      licensedThemes: cached.licensedThemes,
      rateLimitHeaders: createRateLimitHeaders(rateLimitResult),
    };
  }

  // 5. Supabase 서버 클라이언트 생성
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'internal_server_error', message: 'Server configuration error' },
        { status: 500 }
      ),
    };
  }

  const supabase = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 6. API Key 조회 및 bcrypt 비교
  const { data: apiKeys, error: apiKeysError } = await supabase
    .from('api_keys')
    .select('id, user_id, key_hash, revoked_at, expires_at, last_used_at')
    .is('revoked_at', null)
    .returns<ApiKey[]>();

  if (apiKeysError || !apiKeys || apiKeys.length === 0) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'Invalid API key' },
        { status: 401 }
      ),
    };
  }

  let matchedKey: ApiKey | null = null;
  for (const key of apiKeys) {
    const isMatch = await bcrypt.compare(apiKey, key.key_hash);
    if (isMatch) {
      matchedKey = key;
      break;
    }
  }

  if (!matchedKey) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'Invalid API key' },
        { status: 401 }
      ),
    };
  }

  // 7. 만료 확인
  if (matchedKey.expires_at && new Date(matchedKey.expires_at) < new Date()) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'API key has expired' },
        { status: 401 }
      ),
    };
  }

  // 8. 사용자 정보 조회
  const {
    data: { user: authUser },
    error: authUserError,
  } = await supabase.auth.admin.getUserById(matchedKey.user_id);

  if (authUserError || !authUser || !authUser.email) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'User not found' },
        { status: 401 }
      ),
    };
  }

  // 9. 프로필 및 라이선스 조회
  const [{ data: profile }, { data: licenses }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('id, plan')
      .eq('id', matchedKey.user_id)
      .single<UserProfile>(),
    supabase
      .from('user_licenses')
      .select('id, user_id, theme_id, tier, type, is_active, expires_at')
      .eq('user_id', matchedKey.user_id)
      .eq('is_active', true)
      .returns<UserLicense[]>(),
  ]);

  const activeLicenses = (licenses || []).filter((license) => {
    if (!license.expires_at) {
      return true;
    }
    return new Date(license.expires_at) > new Date();
  });

  const licensedThemes = activeLicenses.map((l) => l.theme_id);

  // 10. 인증 결과 캐시 저장
  setCachedAuth(apiKey, {
    userId: authUser.id,
    email: authUser.email,
    plan: profile?.plan || 'free',
    licensedThemes,
    apiKeyId: matchedKey.id,
  });

  // 11. last_used_at 비동기 업데이트
  supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', matchedKey.id)
    .then(({ error }) => {
      if (error) {
        console.error('[MCP Auth] Failed to update last_used_at:', error);
      }
    });

  return {
    valid: true,
    userId: authUser.id,
    email: authUser.email,
    plan: profile?.plan || 'free',
    licensedThemes,
    rateLimitHeaders: createRateLimitHeaders(rateLimitResult),
  };
}
