/**
 * E2E Tests: MCP Verify Endpoint
 * SPEC-DEPLOY-001 Phase 2.5: MCP 검증 엔드포인트 테스트
 *
 * 테스트 시나리오:
 * 1. 유효한 API Key로 GET /api/mcp/verify 호출
 * 2. 응답에 valid: true 확인
 * 3. user 정보 (id, email, plan) 확인
 * 4. licenses 배열 확인
 * 5. themes 객체 확인
 * 6. 무효한 API Key로 401 에러 확인
 * 7. 만료된 API Key로 401 에러 확인
 */

import { test, expect } from '@playwright/test';
import {
  createTestUser,
  deleteTestUser,
  createTestApiKey,
  deleteTestApiKey,
  getSupabaseTestClient,
  hasSupabaseTestEnv,
} from '../fixtures/auth';
import { FREE_THEMES } from '../fixtures/test-data';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

test.describe('MCP Verify Endpoint E2E', () => {
  test.skip(!hasSupabaseTestEnv(), 'Supabase test environment is not configured');

  let userId: string;
  let userEmail: string;
  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  // 테스트 시작 전: 테스트 사용자 생성
  test.beforeAll(async () => {
    const { user, userId: id } = await createTestUser();
    userId = id;
    userEmail = user.email;
    // userPassword는 현재 사용하지 않지만 향후 사용 가능

    console.log('[E2E] Test user created:', { userId, email: userEmail });
  });

  // 테스트 종료 후: 테스트 사용자 삭제
  test.afterAll(async () => {
    if (userId) {
      await deleteTestUser(userId);
      console.log('[E2E] Test user deleted:', userId);
    }
  });

  test('should verify valid API key and return user info', async () => {
    // 1. 테스트용 API Key 생성
    const { id: apiKeyId, key: apiKey } = await createTestApiKey(userId, 'MCP Verify Test Key');

    try {
      // 2. /api/mcp/verify 호출
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // 3. 응답 상태 확인
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);

      // 4. 응답 body 파싱
      const data = await response.json();

      console.log('[E2E] MCP verify response:', {
        valid: data.valid,
        userId: data.user?.id,
        plan: data.user?.plan,
        themesCount: data.themes?.free?.length + data.themes?.licensed?.length,
      });

      // 5. valid: true 확인
      expect(data.valid).toBe(true);

      // 6. user 정보 확인
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe(userId);
      expect(data.user.email).toBe(userEmail);
      expect(data.user.plan).toBeDefined(); // 'free', 'pro', 'creator' 중 하나

      // 7. licenses 배열 확인
      expect(data.licenses).toBeDefined();
      expect(Array.isArray(data.licenses)).toBe(true);

      // 8. themes 객체 확인
      expect(data.themes).toBeDefined();
      expect(data.themes.free).toBeDefined();
      expect(data.themes.licensed).toBeDefined();
      expect(Array.isArray(data.themes.free)).toBe(true);
      expect(Array.isArray(data.themes.licensed)).toBe(true);

      // 9. 무료 테마 목록 확인
      expect(data.themes.free).toEqual(expect.arrayContaining(FREE_THEMES));

      console.log('[E2E] MCP verify test passed');
    } finally {
      // 10. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });

  test('should return 401 for invalid API key', async () => {
    // 1. 무효한 API Key로 요청
    const invalidApiKey = 'tk_live_invalidinvalidinvalidinvalid';

    const response = await fetch(`${baseUrl}/api/mcp/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${invalidApiKey}`,
      },
    });

    // 2. 401 응답 확인
    expect(response.status).toBe(401);

    // 3. 응답 body 확인
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.error).toBe('unauthorized');
    expect(data.message).toBeDefined();

    console.log('[E2E] Invalid API key returned 401:', data.message);
  });

  test('should return 401 for missing Authorization header', async () => {
    // 1. Authorization 헤더 없이 요청
    const response = await fetch(`${baseUrl}/api/mcp/verify`, {
      method: 'GET',
    });

    // 2. 401 응답 확인
    expect(response.status).toBe(401);

    // 3. 응답 body 확인
    const data = await response.json();
    expect(data.valid).toBe(false);
    expect(data.error).toBe('unauthorized');
    expect(data.message).toContain('Missing or invalid Authorization header');

    console.log('[E2E] Missing auth header returned 401');
  });

  test('should return 401 for malformed Authorization header', async () => {
    // 1. Bearer 없이 요청
    const response = await fetch(`${baseUrl}/api/mcp/verify`, {
      method: 'GET',
      headers: {
        Authorization: 'tk_live_invalidinvalidinvalidinvalid',
      },
    });

    // 2. 401 응답 확인
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.valid).toBe(false);

    console.log('[E2E] Malformed auth header returned 401');
  });

  test('should return 401 for invalid API key format', async () => {
    // 1. 잘못된 형식의 API Key
    const invalidFormats = [
      'tk_test_1234567890123456789012345678', // 잘못된 prefix
      'tk_live_short', // 너무 짧음
      'tk_live_' + 'a'.repeat(100), // 너무 김
    ];

    for (const invalidKey of invalidFormats) {
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${invalidKey}`,
        },
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.valid).toBe(false);

      console.log(`[E2E] Invalid format "${invalidKey.substring(0, 20)}..." returned 401`);
    }
  });

  test('should return 401 for revoked API key', async () => {
    // 1. 테스트용 API Key 생성
    const { id: apiKeyId, key: apiKey } = await createTestApiKey(userId, 'Revoked Key Test');

    try {
      // 2. API Key를 revoke (soft delete)
      const supabase = getSupabaseTestClient();
      await supabase
        .from('api_keys')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', apiKeyId);

      console.log('[E2E] API key revoked:', apiKeyId);

      // 3. revoked API Key로 요청
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // 4. 401 응답 확인
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.valid).toBe(false);
      expect(data.error).toBe('unauthorized');

      console.log('[E2E] Revoked API key returned 401');
    } finally {
      // 5. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });

  test('should return 401 for expired API key', async () => {
    // 1. 만료된 API Key 생성
    const supabase = getSupabaseTestClient();

    const randomHex = crypto.randomBytes(16).toString('hex');
    const apiKey = `tk_live_${randomHex}`;
    const hash = await bcrypt.hash(apiKey, 10);
    const prefix = apiKey.substring(0, 12);

    // expires_at을 과거로 설정
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1); // 1일 전

    const { data: insertedKey, error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: userId,
        name: 'Expired Key Test',
        key_hash: hash,
        key_prefix: prefix,
        expires_at: expiredDate.toISOString(),
      })
      .select('id')
      .single();

    if (insertError || !insertedKey) {
      throw new Error(`Failed to create expired API key: ${insertError?.message}`);
    }

    try {
      // 2. 만료된 API Key로 요청
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      // 3. 401 응답 확인
      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.valid).toBe(false);
      expect(data.message).toContain('expired');

      console.log('[E2E] Expired API key returned 401');
    } finally {
      // 4. 정리: 만료된 API Key 삭제
      await deleteTestApiKey(insertedKey.id);
    }
  });

  test('should include Rate-Limit headers in response', async () => {
    // 1. 테스트용 API Key 생성
    const { id: apiKeyId, key: apiKey } = await createTestApiKey(userId, 'Rate Limit Test Key');

    try {
      // 2. /api/mcp/verify 호출
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      expect(response.ok).toBe(true);

      // 3. Rate Limit 헤더 확인
      const rateLimitLimit = response.headers.get('X-RateLimit-Limit');
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      expect(rateLimitLimit).toBeDefined();
      expect(rateLimitRemaining).toBeDefined();
      expect(rateLimitReset).toBeDefined();

      console.log('[E2E] Rate limit headers:', {
        limit: rateLimitLimit,
        remaining: rateLimitRemaining,
        reset: rateLimitReset,
      });
    } finally {
      // 4. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });
});
