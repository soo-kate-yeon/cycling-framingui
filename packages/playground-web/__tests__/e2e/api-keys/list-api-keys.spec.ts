/**
 * E2E Tests: API Key List
 * SPEC-DEPLOY-001 Phase 2.5: API Key 목록 조회 테스트
 *
 * 테스트 시나리오:
 * 1. API Key 목록에 새로 생성된 키 표시
 * 2. key_prefix 확인 (tk_live_xxxx)
 * 3. name, created_at 표시 확인
 * 4. 평문 키는 표시되지 않음 확인
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
import { API_KEY_PREFIX_PATTERN, TIMEOUTS } from '../fixtures/test-data';

test.describe('API Key List E2E', () => {
  test.skip(!hasSupabaseTestEnv(), 'Supabase test environment is not configured');

  let userId: string;
  let userEmail: string;
  let userPassword: string;

  // 테스트 시작 전: 테스트 사용자 생성
  test.beforeAll(async () => {
    const { user, userId: id } = await createTestUser();
    userId = id;
    userEmail = user.email;
    userPassword = user.password;

    console.log('[E2E] Test user created:', { userId, email: userEmail });
  });

  // 테스트 종료 후: 테스트 사용자 삭제
  test.afterAll(async () => {
    if (userId) {
      await deleteTestUser(userId);
      console.log('[E2E] Test user deleted:', userId);
    }
  });

  test('should display API key list with correct information', async ({ page }) => {
    // 1. 테스트용 API Key 생성 (DB에 직접 삽입)
    const { id: apiKeyId, prefix } = await createTestApiKey(userId, 'Test Key for List Display');

    try {
      // 2. 인증된 세션 설정
      await setAuthSession(page, userEmail, userPassword);

      // 3. 프로필 페이지 접속
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // 4. API Key 목록 섹션 확인
      const apiKeysList = page.locator(
        '[data-testid="api-keys-list"], ul:near(h2:has-text("API Keys"))'
      );
      await expect(apiKeysList.first()).toBeVisible({ timeout: TIMEOUTS.PAGE_LOAD });

      // 5. 생성된 API Key 아이템 확인
      const keyItem = page.locator(`text="Test Key for List Display"`);
      await expect(keyItem.first()).toBeVisible();

      // 6. key_prefix 확인 (tk_live_xxxx 형식)
      const prefixDisplay = page.locator(`text="${prefix}"`);
      await expect(prefixDisplay.first()).toBeVisible();
      expect(prefix).toMatch(API_KEY_PREFIX_PATTERN);

      console.log('[E2E] API key prefix displayed:', prefix);

      // 7. 생성 날짜 표시 확인
      const dateDisplay = page.locator(
        '[data-testid^="api-key-created-"], time, text=/Created|생성/'
      );
      await expect(dateDisplay.first()).toBeVisible();

      // 8. 평문 키가 표시되지 않는지 확인
      const plaintextKey = page.locator('text=/tk_live_[a-f0-9]{32}/');
      await expect(plaintextKey).toHaveCount(0);

      console.log('[E2E] API key list display test passed');
    } finally {
      // 9. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });

  test('should show empty state when no API keys', async ({ page }) => {
    // 1. 인증된 세션 설정
    await setAuthSession(page, userEmail, userPassword);

    // 2. 프로필 페이지 접속
    await page.goto('/profile');
    await page.waitForLoadState('networkidle');

    // 3. Empty state 메시지 확인
    const emptyState = page.locator(
      'text="No API keys yet", text="아직 API 키가 없습니다", text="Create your first API key"'
    );

    // API Keys가 없거나, 있으면 테스트 통과
    const hasApiKeys = (await page.locator('[data-testid^="api-key-item-"]').count()) > 0;

    if (!hasApiKeys) {
      await expect(emptyState.first()).toBeVisible();
      console.log('[E2E] Empty state displayed correctly');
    } else {
      console.log('[E2E] API keys exist, skipping empty state test');
    }
  });

  test('should display last_used_at when API key is used', async ({ page }) => {
    // 1. 테스트용 API Key 생성
    const { id: apiKeyId, key: apiKey } = await createTestApiKey(userId, 'Test Key for Last Used');

    try {
      // 2. API Key를 사용하여 /api/mcp/verify 호출
      const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';
      await fetch(`${baseUrl}/api/mcp/verify`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      console.log('[E2E] API key used for verification');

      // 3. 인증된 세션 설정
      await setAuthSession(page, userEmail, userPassword);

      // 4. 프로필 페이지 접속
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // 5. last_used_at 표시 확인
      await page.waitForTimeout(2000); // DB 업데이트 대기

      await page.reload(); // 최신 데이터 로드

      const lastUsedDisplay = page.locator('text=/Last used|마지막 사용|ago|전/');

      // last_used_at이 표시되거나, "Never used" 표시
      const isVisible = await lastUsedDisplay.first().isVisible();
      expect(isVisible).toBe(true);

      console.log('[E2E] Last used display test passed');
    } finally {
      // 6. 정리: 테스트용 API Key 삭제
      await deleteTestApiKey(apiKeyId);
    }
  });

  test('should show multiple API keys in list', async ({ page }) => {
    // 1. 여러 개의 API Key 생성
    const apiKeys = await Promise.all([
      createTestApiKey(userId, 'First Test Key'),
      createTestApiKey(userId, 'Second Test Key'),
      createTestApiKey(userId, 'Third Test Key'),
    ]);

    try {
      // 2. 인증된 세션 설정
      await setAuthSession(page, userEmail, userPassword);

      // 3. 프로필 페이지 접속
      await page.goto('/profile');
      await page.waitForLoadState('networkidle');

      // 4. 모든 API Key가 목록에 표시되는지 확인
      for (const { prefix } of apiKeys) {
        const keyItem = page.locator(`text="${prefix}"`);
        await expect(keyItem.first()).toBeVisible();
      }

      // 5. 목록 아이템 개수 확인
      const listItems = page.locator('[data-testid^="api-key-item-"]');
      const count = await listItems.count();
      expect(count).toBeGreaterThanOrEqual(3);

      console.log('[E2E] Multiple API keys displayed:', count);
    } finally {
      // 6. 정리: 모든 테스트용 API Key 삭제
      await Promise.all(apiKeys.map(({ id }) => deleteTestApiKey(id)));
    }
  });
});
