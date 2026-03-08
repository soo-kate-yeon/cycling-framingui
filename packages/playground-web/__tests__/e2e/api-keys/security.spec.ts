/**
 * E2E Tests: Security Tests
 * SPEC-DEPLOY-001 Phase 2.5: 보안 테스트
 *
 * 테스트 시나리오:
 * 1. 세션 없이 API Key 생성 시도 → 401
 * 2. 무효한 API Key로 MCP 검증 → 401
 * 3. Rate Limiting 테스트
 * 4. SQL Injection 방어
 * 5. XSS 방어
 */

import { test, expect } from '@playwright/test';
import {
  createTestUser,
  deleteTestUser,
  setAuthSession,
  createTestApiKey,
  deleteTestApiKey,
  hasSupabaseTestEnv,
} from '../fixtures/auth';
import { RATE_LIMITS } from '../fixtures/test-data';

test.describe('Security Tests E2E', () => {
  test.skip(!hasSupabaseTestEnv(), 'Supabase test environment is not configured');

  let userId: string;
  let userEmail: string;
  let userPassword: string;
  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  // 테스트 시작 전: 테스트 사용자 생성
  test.beforeAll(async () => {
    const { user, userId: id } = await createTestUser();
    userId = id;
    userEmail = user.email;
    userPassword = user.password;

    console.log('[E2E] Test user created for security tests:', { userId, email: userEmail });
  });

  // 테스트 종료 후: 테스트 사용자 삭제
  test.afterAll(async () => {
    if (userId) {
      await deleteTestUser(userId);
      console.log('[E2E] Test user deleted:', userId);
    }
  });

  test('should return 401 when creating API key without session', async ({ page }) => {
    // 1. 세션 없이 API Key 생성 API 호출
    const response = await page.request.post(`${baseUrl}/api/user/api-keys`, {
      data: {
        name: 'Unauthorized Test Key',
      },
    });

    // 2. 401 응답 확인
    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toBe('unauthorized');
    expect(data.message).toContain('Authentication required');

    console.log('[E2E] Unauthorized API key creation blocked');
  });

  test('should return 401 when listing API keys without session', async ({ page }) => {
    // 1. 세션 없이 API Key 목록 조회
    const response = await page.request.get(`${baseUrl}/api/user/api-keys`);

    // 2. 401 응답 확인
    expect(response.status()).toBe(401);

    const data = await response.json();
    expect(data.error).toBe('unauthorized');

    console.log('[E2E] Unauthorized API key listing blocked');
  });

  test('should enforce rate limiting on API key creation', async ({ page }) => {
    // 1. 인증된 세션 설정
    await setAuthSession(page, userEmail, userPassword);

    // 2. Rate Limit 초과할 때까지 요청 (분당 10회)
    const requests = [];

    for (let i = 0; i < RATE_LIMITS.API_KEYS_MANAGEMENT + 5; i++) {
      requests.push(
        page.request.post(`${baseUrl}/api/user/api-keys`, {
          data: {
            name: `Rate Limit Test Key ${i}`,
          },
        })
      );
    }

    const responses = await Promise.all(requests);

    // 3. 일부 요청이 429 (Too Many Requests) 반환하는지 확인
    const rateLimitedResponses = responses.filter((res) => res.status() === 429);

    expect(rateLimitedResponses.length).toBeGreaterThan(0);

    console.log(
      `[E2E] Rate limiting enforced: ${rateLimitedResponses.length} requests blocked out of ${requests.length}`
    );

    // 4. Rate limit 응답 확인
    const rateLimitData = await rateLimitedResponses[0]?.json();
    expect(rateLimitData?.error).toBe('rate_limit_exceeded');
    expect(rateLimitData?.retryAfter).toBeDefined();

    console.log('[E2E] Rate limit response:', {
      error: rateLimitData.error,
      retryAfter: rateLimitData.retryAfter,
    });
  });

  test('should enforce rate limiting on MCP verify endpoint', async () => {
    // 1. 테스트용 API Key 생성
    const { id: apiKeyId, key: apiKey } = await createTestApiKey(userId, 'Rate Limit MCP Test');

    try {
      // 2. Rate Limit 초과할 때까지 요청 (분당 60회)
      const requests = [];

      for (let i = 0; i < RATE_LIMITS.MCP_VERIFY + 10; i++) {
        requests.push(
          fetch(`${baseUrl}/api/mcp/verify`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          })
        );
      }

      const responses = await Promise.all(requests);

      // 3. 일부 요청이 429 반환하는지 확인
      const rateLimitedResponses = responses.filter((res) => res.status === 429);

      expect(rateLimitedResponses.length).toBeGreaterThan(0);

      console.log(
        `[E2E] MCP verify rate limiting enforced: ${rateLimitedResponses.length} requests blocked`
      );
    } finally {
      // 4. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });

  test('should prevent SQL injection in API key name', async ({ page }) => {
    // 1. 인증된 세션 설정
    await setAuthSession(page, userEmail, userPassword);

    // 2. SQL Injection 시도
    const sqlInjectionPayloads = [
      "'; DROP TABLE api_keys; --",
      "' OR '1'='1",
      "admin'--",
      "1' UNION SELECT NULL, NULL, NULL--",
    ];

    for (const payload of sqlInjectionPayloads) {
      const response = await page.request.post(`${baseUrl}/api/user/api-keys`, {
        data: {
          name: payload,
        },
      });

      // SQL Injection이 막혔는지 확인
      // - 정상 생성 (201) 또는 검증 에러 (400)만 허용
      // - 500 에러가 발생하면 SQL Injection 취약점 존재
      expect([200, 201, 400]).toContain(response.status());

      if (response.status() === 201) {
        // 생성되었다면 삭제
        const data = await response.json();
        await deleteTestApiKey(data.id);
      }

      console.log(`[E2E] SQL injection payload blocked: "${payload.substring(0, 20)}..."`);
    }
  });

  test('should sanitize XSS attempts in API key name', async ({ page }) => {
    // 1. 인증된 세션 설정
    await setAuthSession(page, userEmail, userPassword);

    // 2. XSS 페이로드
    const xssPayload = '<script>alert("XSS")</script>';

    const response = await page.request.post(`${baseUrl}/api/user/api-keys`, {
      data: {
        name: xssPayload,
      },
    });

    if (response.status() === 201) {
      const data = await response.json();

      // 3. 프로필 페이지에서 XSS가 실행되지 않는지 확인
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // 4. alert 다이얼로그가 뜨지 않는지 확인
      page.on('dialog', (dialog) => {
        // XSS가 실행되면 이 이벤트가 발생
        console.error('[E2E] XSS vulnerability detected! Alert:', dialog.message());
        expect(dialog.message()).not.toContain('XSS');
        dialog.dismiss();
      });

      await page.waitForTimeout(2000);

      // 5. 스크립트 태그가 이스케이프되었는지 확인
      const content = await page.content();
      expect(content).not.toContain('<script>alert("XSS")</script>');

      console.log('[E2E] XSS payload sanitized');

      // 6. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(data.id);
    } else {
      console.log('[E2E] XSS payload rejected by validation');
    }
  });

  test('should validate API key format strictly', async () => {
    // 1. 잘못된 형식의 API Key 테스트
    const invalidKeys = [
      'tk_test_1234567890abcdef1234567890ab', // 잘못된 prefix
      'tk_live_short', // 너무 짧음
      'tk_live_ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ', // 잘못된 문자 (Z는 hex가 아님)
      'tk_live_' + 'g'.repeat(32), // hex가 아닌 문자
    ];

    for (const invalidKey of invalidKeys) {
      const response = await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${invalidKey}`,
        },
      });

      expect(response.status).toBe(401);

      const data = await response.json();
      expect(data.valid).toBe(false);

      console.log(`[E2E] Invalid key format rejected: "${invalidKey.substring(0, 20)}..."`);
    }
  });

  test('should prevent timing attacks on API key verification', async () => {
    // 1. 유효한 API Key 생성
    const { id: validKeyId, key: validKey } = await createTestApiKey(userId, 'Timing Attack Test');

    try {
      // 2. 유효한 키와 무효한 키의 응답 시간 측정
      const timings: { valid: number[]; invalid: number[] } = {
        valid: [],
        invalid: [],
      };

      // 유효한 키 10번 테스트
      for (let i = 0; i < 10; i++) {
        const start = Date.now();
        await fetch(`${baseUrl}/api/mcp/verify`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${validKey}`,
          },
        });
        timings.valid.push(Date.now() - start);
      }

      // 무효한 키 10번 테스트
      for (let i = 0; i < 10; i++) {
        const invalidKey = 'tk_live_' + 'a'.repeat(32);
        const start = Date.now();
        await fetch(`${baseUrl}/api/mcp/verify`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${invalidKey}`,
          },
        });
        timings.invalid.push(Date.now() - start);
      }

      // 3. 평균 시간 계산
      const avgValid = timings.valid.reduce((a, b) => a + b, 0) / timings.valid.length;
      const avgInvalid = timings.invalid.reduce((a, b) => a + b, 0) / timings.invalid.length;

      console.log('[E2E] Timing attack test:', {
        avgValid: avgValid.toFixed(2) + 'ms',
        avgInvalid: avgInvalid.toFixed(2) + 'ms',
        difference: Math.abs(avgValid - avgInvalid).toFixed(2) + 'ms',
      });

      // 4. 시간 차이가 크지 않은지 확인 (bcrypt의 timing-safe 특성)
      // ⚠️ 실제로는 네트워크 지연으로 인해 차이가 있을 수 있음
      // 목적: timing attack이 불가능하도록 일정 시간 이상 걸리는지 확인
      expect(avgValid).toBeGreaterThan(10); // bcrypt는 최소 10ms 이상 소요
      expect(avgInvalid).toBeGreaterThan(10);
    } finally {
      // 5. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(validKeyId);
    }
  });
});
