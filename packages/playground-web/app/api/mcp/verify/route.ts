/**
 * MCP API Key Verification Endpoint
 * SPEC-DEPLOY-001 Phase 2.3-2.4: API Key 검증 + Rate Limiting
 *
 * [TAG-DEPLOY-001-E003] MCP 서버가 API Key를 검증하고 사용자 라이선스를 조회
 * [SECURITY-S2] bcrypt 해싱 + timing-safe 비교
 * [SECURITY-S3] Rate Limiting: 분당 60회
 *
 * WHY: MCP 서버가 사용자의 구매한 테마를 확인하여 접근 권한 제어
 * IMPACT: API Key 기반 인증으로 무료/유료 테마 구분 가능
 */

import { createClient as createServerClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import {
  rateLimitMcpVerify,
  createRateLimitErrorResponse,
  createRateLimitHeaders,
} from '@/lib/security/rate-limit';
import { normalizeLicensedThemes } from '@/lib/mcp/theme-entitlements';

/**
 * API 검증 성공 응답
 */
interface VerifySuccessResponse {
  valid: true;
  user: {
    id: string;
    email: string;
    plan: string;
  };
  licenses: Array<{
    themeId: string;
    resolvedThemeIds?: string[];
    tier: string;
    type: 'trial' | 'individual' | 'creator';
    isActive: boolean;
    expiresAt: string | null;
  }>;
  themes: {
    licensed: string[];
  };
  quotaEntitlement: {
    planId: string;
    status: string;
    includedUnits: number;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    totalAllocatedUnits: number;
    topUpAllocatedUnits: number;
  } | null;
}

/**
 * API 검증 실패 응답
 */
interface VerifyErrorResponse {
  valid: false;
  error: string;
  message: string;
}

/**
 * Database: api_keys 테이블 타입
 */
interface ApiKey {
  id: string;
  user_id: string;
  key_hash: string;
  revoked_at: string | null;
  expires_at: string | null;
  last_used_at: string | null;
}

/**
 * Database: user_licenses 테이블 타입
 */
interface UserLicense {
  id: string;
  user_id: string;
  theme_id: string;
  tier: string;
  type: 'trial' | 'individual' | 'creator';
  is_active: boolean;
  expires_at: string | null;
}

/**
 * Database: user_profiles 테이블 타입
 */
interface UserProfile {
  id: string;
  plan: string;
}

interface QuotaEntitlementRow {
  user_id: string;
  plan_id: string;
  status: string;
  included_units: number;
  current_period_start: string | null;
  current_period_end: string | null;
}

interface QuotaAllocationRow {
  units: number;
  allocation_type: 'plan' | 'top_up' | 'migration' | 'adjustment';
}

// 모든 테마 유료 - FREE_THEMES 제거됨 (SPEC-DEPLOY-001)

/**
 * GET /api/mcp/verify
 *
 * MCP 서버가 API Key를 검증하고 사용자 라이선스를 조회합니다.
 *
 * [TAG-DEPLOY-001-E003] API Key 검증 및 라이선스 조회
 *
 * @param request Next.js 요청 객체
 * @returns 사용자 정보 및 라이선스 목록
 *
 * @example
 * GET /api/mcp/verify
 * Headers: { Authorization: "Bearer tk_live_a1b2c3d4..." }
 *
 * Success Response (200):
 * {
 *   "valid": true,
 *   "user": { "id": "uuid", "email": "user@example.com", "plan": "pro" },
 *   "licenses": [
 *     { "themeId": "dark-boldness-v2", "tier": "single", "isActive": true, "expiresAt": null }
 *   ],
 *   "themes": {
 *     "free": ["minimal-starter", "basic-dashboard"],
 *     "licensed": ["dark-boldness-v2"]
 *   }
 * }
 *
 * Error Response (401):
 * {
 *   "valid": false,
 *   "error": "unauthorized",
 *   "message": "Invalid or expired API key"
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authorization 헤더에서 Bearer 토큰 추출
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'unauthorized',
          message: 'Missing or invalid Authorization header',
        },
        { status: 401 }
      );
    }

    const apiKey = authHeader.substring(7); // "Bearer " 제거

    // 2. Rate Limiting (API Key 기반, 분당 60회)
    // SECURITY-S3: Rate limiting으로 무차별 대입 공격 방지
    const rateLimitResult = await rateLimitMcpVerify(apiKey);

    if (!rateLimitResult.success) {
      console.warn('[MCP Verify] Rate limit exceeded:', {
        apiKey: apiKey.substring(0, 15) + '...',
        remaining: rateLimitResult.remaining,
        reset: new Date(rateLimitResult.reset).toISOString(),
      });

      return createRateLimitErrorResponse(rateLimitResult);
    }

    // 3. API Key 형식 검증 (tk_live_ + 64자 hex = 72자)
    // SECURITY: 형식 검증으로 불필요한 DB 쿼리 방지
    if (!apiKey.startsWith('tk_live_') || apiKey.length !== 72) {
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'unauthorized',
          message: 'Invalid API key format',
        },
        { status: 401 }
      );
    }

    // 4. Supabase 서버 클라이언트 생성 (Service Role 사용)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('[MCP Verify] Missing Supabase environment variables');
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'internal_server_error',
          message: 'Server configuration error',
        },
        { status: 500 }
      );
    }

    // Service Role 클라이언트 생성 (RLS 우회)
    const supabase = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 3. api_keys 테이블에서 해시 조회
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('id, user_id, key_hash, revoked_at, expires_at, last_used_at')
      .is('revoked_at', null) // revoked 되지 않은 키만
      .returns<ApiKey[]>();

    if (apiKeysError) {
      console.error('[MCP Verify] Database query failed:', apiKeysError);
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'internal_server_error',
          message: 'Database query failed',
        },
        { status: 500 }
      );
    }

    if (!apiKeys || apiKeys.length === 0) {
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'unauthorized',
          message: 'Invalid API key',
        },
        { status: 401 }
      );
    }

    // 4. bcrypt로 해시 비교 (timing-safe)
    let matchedKey: ApiKey | null = null;

    for (const key of apiKeys) {
      const isMatch = await bcrypt.compare(apiKey, key.key_hash);
      if (isMatch) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'unauthorized',
          message: 'Invalid API key',
        },
        { status: 401 }
      );
    }

    // 5. expires_at 확인
    if (matchedKey.expires_at) {
      const expiresAt = new Date(matchedKey.expires_at);
      if (expiresAt < new Date()) {
        return NextResponse.json<VerifyErrorResponse>(
          {
            valid: false,
            error: 'unauthorized',
            message: 'API key has expired',
          },
          { status: 401 }
        );
      }
    }

    // 6. 사용자 정보 조회 (Supabase Admin API 사용)
    const {
      data: { user: authUser },
      error: authUserError,
    } = await supabase.auth.admin.getUserById(matchedKey.user_id);

    if (authUserError || !authUser || !authUser.email) {
      console.error('[MCP Verify] User not found:', authUserError);
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'unauthorized',
          message: 'User not found',
        },
        { status: 401 }
      );
    }

    // 7. 사용자 프로필 조회
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id, plan')
      .eq('id', matchedKey.user_id)
      .single<UserProfile>();

    const userPlan = profile?.plan || 'free';

    // 8. user_licenses 조회
    const { data: licenses, error: licensesError } = await supabase
      .from('user_licenses')
      .select('id, user_id, theme_id, tier, type, is_active, expires_at')
      .eq('user_id', matchedKey.user_id)
      .eq('is_active', true)
      .returns<UserLicense[]>();

    if (licensesError) {
      console.error('[MCP Verify] Failed to fetch licenses:', licensesError);
      return NextResponse.json<VerifyErrorResponse>(
        {
          valid: false,
          error: 'internal_server_error',
          message: 'Failed to fetch licenses',
        },
        { status: 500 }
      );
    }

    // 9. 라이선스 필터링 (만료되지 않은 것만)
    const activeLicenses = (licenses || []).filter((license) => {
      if (!license.expires_at) {
        return true;
      } // 영구 라이선스
      return new Date(license.expires_at) > new Date();
    });

    // 10. 응답 구성
    const normalizedEntitlements = normalizeLicensedThemes(activeLicenses, { logger: console });
    const licensedThemes = normalizedEntitlements.licensedThemes;

    const { data: quotaEntitlement } = await supabase
      .from('quota_entitlements')
      .select('user_id, plan_id, status, included_units, current_period_start, current_period_end')
      .eq('user_id', matchedKey.user_id)
      .maybeSingle<QuotaEntitlementRow>();

    const { data: quotaAllocations } = await supabase
      .from('quota_allocations')
      .select('units, allocation_type')
      .eq('user_id', matchedKey.user_id)
      .returns<QuotaAllocationRow[]>();

    const totalAllocatedUnits = (quotaAllocations ?? []).reduce((sum, row) => sum + row.units, 0);
    const topUpAllocatedUnits = (quotaAllocations ?? [])
      .filter((row) => row.allocation_type === 'top_up')
      .reduce((sum, row) => sum + row.units, 0);

    const response: VerifySuccessResponse = {
      valid: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        plan: userPlan,
      },
      licenses: normalizedEntitlements.licenses.map((license) => ({
        themeId: license.theme_id,
        ...(license.normalization !== 'canonical'
          ? { resolvedThemeIds: license.resolvedThemeIds }
          : {}),
        tier: license.tier,
        type: license.type,
        isActive: license.is_active,
        expiresAt: license.expires_at,
      })),
      themes: {
        licensed: licensedThemes,
      },
      quotaEntitlement: quotaEntitlement
        ? {
            planId: quotaEntitlement.plan_id,
            status: quotaEntitlement.status,
            includedUnits: quotaEntitlement.included_units,
            currentPeriodStart: quotaEntitlement.current_period_start,
            currentPeriodEnd: quotaEntitlement.current_period_end,
            totalAllocatedUnits,
            topUpAllocatedUnits,
          }
        : null,
    };

    // 11. last_used_at 비동기 업데이트 (응답 지연 없이)
    supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', matchedKey.id)
      .then(({ error }) => {
        if (error) {
          console.error('[MCP Verify] Failed to update last_used_at:', error);
        }
      });

    // 12. 성공 응답 반환 (Rate Limit 헤더 포함)
    return NextResponse.json<VerifySuccessResponse>(response, {
      status: 200,
      headers: createRateLimitHeaders(rateLimitResult),
    });
  } catch (error) {
    // 13. 예상치 못한 에러 처리
    console.error('[MCP Verify] Unexpected error:', error);

    return NextResponse.json<VerifyErrorResponse>(
      {
        valid: false,
        error: 'internal_server_error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/mcp/verify
 *
 * CORS preflight 요청 처리
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 24시간
    },
  });
}
