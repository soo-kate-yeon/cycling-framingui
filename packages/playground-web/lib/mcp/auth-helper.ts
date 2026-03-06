/**
 * MCP API 공통 인증 헬퍼
 * Bearer 토큰 추출 → API Key 검증 → 라이선스 조회를 재사용 가능한 함수로 추출
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

/**
 * MCP API 요청 인증 처리
 * verify/route.ts의 인증 로직을 재사용 가능한 함수로 추출
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

  // 4. Supabase 서버 클라이언트 생성
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

  // 5. API Key 조회 및 bcrypt 비교
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

  // 6. 만료 확인
  if (matchedKey.expires_at && new Date(matchedKey.expires_at) < new Date()) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: 'unauthorized', message: 'API key has expired' },
        { status: 401 }
      ),
    };
  }

  // 7. 사용자 정보 조회
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

  // 8. 프로필 및 라이선스 조회
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

  // 9. last_used_at 비동기 업데이트
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
