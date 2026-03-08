/**
 * Authentication Test Fixtures
 * SPEC-DEPLOY-001 Phase 2.5: E2E 테스트 헬퍼
 *
 * 인증 관련 테스트 유틸리티 및 픽스처
 */

import { Page } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export function hasSupabaseTestEnv() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Supabase 테스트 클라이언트
 * 환경변수에서 URL과 Service Role Key를 가져옴
 */
export function getSupabaseTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables for E2E tests. ' +
        'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 테스트 사용자 정보
 */
export interface TestUser {
  email: string;
  password: string;
  displayName: string;
}

/**
 * 테스트용 사용자 생성
 *
 * ⚠️ 주의: 실제 Supabase Auth를 사용하므로 테스트 후 정리 필요
 */
export async function createTestUser(): Promise<{ user: TestUser; userId: string }> {
  const supabase = getSupabaseTestClient();

  const timestamp = Date.now();
  const testUser: TestUser = {
    email: `test-${timestamp}@tekton-e2e.test`,
    password: 'Test1234!@#$',
    displayName: `Test User ${timestamp}`,
  };

  // Admin API로 사용자 생성
  const { data, error } = await supabase.auth.admin.createUser({
    email: testUser.email,
    password: testUser.password,
    email_confirm: true, // 이메일 확인 건너뛰기
    user_metadata: {
      display_name: testUser.displayName,
    },
  });

  if (error || !data.user) {
    throw new Error(`Failed to create test user: ${error?.message}`);
  }

  console.log('[E2E] Created test user:', {
    email: testUser.email,
    userId: data.user.id,
  });

  return { user: testUser, userId: data.user.id };
}

/**
 * 테스트 사용자 삭제
 */
export async function deleteTestUser(userId: string): Promise<void> {
  const supabase = getSupabaseTestClient();

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error('[E2E] Failed to delete test user:', error);
  } else {
    console.log('[E2E] Deleted test user:', userId);
  }
}

/**
 * 이메일/비밀번호로 로그인 (Playwright Page)
 *
 * ⚠️ OAuth는 실제 Google/GitHub 계정이 필요하므로 Mock 또는 수동 테스트 권장
 */
export async function loginWithEmailPassword(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  // 로그인 페이지로 이동
  await page.goto('/auth/login');

  // 이메일/비밀번호 입력 (실제 UI 구조에 맞게 수정 필요)
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);

  // 로그인 버튼 클릭
  await page.click('button[type="submit"]');

  // 로그인 성공 확인 (프로필 페이지로 리다이렉트)
  await page.waitForURL('/profile', { timeout: 10000 });
}

/**
 * 세션 쿠키 직접 설정 (Supabase Auth Token)
 *
 * OAuth 테스트를 건너뛰고 인증된 상태로 시작
 */
export async function setAuthSession(page: Page, email: string, password: string): Promise<string> {
  const supabase = getSupabaseTestClient();

  // 사용자 로그인하여 세션 토큰 가져오기
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    throw new Error(`Failed to sign in: ${error?.message}`);
  }

  // Supabase 세션을 브라우저에 직접 주입
  await page.goto('/');

  await page.evaluate(
    ({ accessToken, refreshToken }) => {
      // Supabase Auth 세션을 localStorage에 저장
      const session = {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 3600,
        token_type: 'bearer',
        user: { email: 'test@example.com' },
      };

      localStorage.setItem(
        'sb-' + window.location.hostname.split('.')[0] + '-auth-token',
        JSON.stringify(session)
      );
    },
    {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    }
  );

  console.log('[E2E] Set auth session for user:', email);

  return data.user.id;
}

/**
 * 현재 세션에서 로그아웃
 */
export async function logout(page: Page): Promise<void> {
  await page.goto('/profile');

  // 로그아웃 버튼 클릭 (실제 UI 구조에 맞게 수정 필요)
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("로그아웃")');

  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }

  // 홈페이지로 리다이렉트 확인
  await page.waitForURL('/', { timeout: 5000 });
}

/**
 * API Key가 유효한지 확인
 */
export async function verifyApiKey(apiKey: string): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return false;
  }

  const baseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3001';

  const response = await fetch(`${baseUrl}/api/mcp/verify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  return response.ok;
}

/**
 * 테스트용 API Key 생성 (직접 DB 삽입)
 */
export async function createTestApiKey(
  userId: string,
  name: string = 'Test API Key'
): Promise<{ id: string; key: string; prefix: string }> {
  const supabase = getSupabaseTestClient();

  // API Key 생성 (tk_live_ + 32자 hex = 40자)
  const randomHex = crypto.randomBytes(16).toString('hex'); // 32 characters
  const apiKey = `tk_live_${randomHex}`;
  const prefix = apiKey.substring(0, 12); // "tk_live_xxxx"

  // bcrypt 해시 생성
  const hash = await bcrypt.hash(apiKey, 10);

  // DB에 삽입
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name,
      key_hash: hash,
      key_prefix: prefix,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create test API key: ${error?.message}`);
  }

  console.log('[E2E] Created test API key:', {
    id: data.id,
    prefix,
  });

  return {
    id: data.id,
    key: apiKey,
    prefix,
  };
}

/**
 * 테스트용 API Key 삭제
 */
export async function deleteTestApiKey(apiKeyId: string): Promise<void> {
  const supabase = getSupabaseTestClient();

  const { error } = await supabase.from('api_keys').delete().eq('id', apiKeyId);

  if (error) {
    console.error('[E2E] Failed to delete test API key:', error);
  } else {
    console.log('[E2E] Deleted test API key:', apiKeyId);
  }
}
