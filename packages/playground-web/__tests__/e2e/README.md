# E2E Testing Guide

This suite is split into two layers:

- `pnpm test:e2e:smoke`: CI-safe browser smoke tests with no Supabase dependency
- `pnpm test:e2e`: full local suite including integration and auth-adjacent coverage

## 📋 테스트 개요

이 디렉토리는 Tekton Playground Web의 인증 및 API Key 관리 기능에 대한 End-to-End 테스트를 포함합니다.

### 테스트 커버리지

#### 1. OAuth 로그인 (`auth/`)

- ✅ Google OAuth 로그인 플로우
- ✅ GitHub OAuth 로그인 플로우
- ✅ 세션 유지 확인
- ⚠️ **주의**: OAuth 테스트는 실제 계정이 필요하므로 수동 테스트 또는 Mock 환경 권장

#### 2. API Key 생성 (`api-keys/create-api-key.spec.ts`)

- ✅ 프로필 페이지에서 API Key 생성
- ✅ 평문 키 표시 확인 (tk*live* + 32자 hex)
- ✅ 복사 버튼 및 클립보드 검증
- ✅ 경고 메시지 표시
- ✅ 입력 검증 (빈 이름, 너무 긴 이름)

#### 3. API Key 목록 (`api-keys/list-api-keys.spec.ts`)

- ✅ API Key 목록 표시
- ✅ key_prefix, name, created_at 확인
- ✅ 평문 키 비표시 확인
- ✅ last_used_at 표시
- ✅ 여러 개의 API Key 목록 표시

#### 4. MCP 검증 엔드포인트 (`api-keys/mcp-verify.spec.ts`)

- ✅ 유효한 API Key로 검증
- ✅ user 정보 (id, email, plan) 확인
- ✅ licenses 배열 확인
- ✅ themes 객체 확인
- ✅ 무효한 API Key → 401
- ✅ 만료된 API Key → 401
- ✅ revoked API Key → 401
- ✅ Rate Limit 헤더 확인

#### 5. API Key Revoke (`api-keys/revoke-api-key.spec.ts`)

- ✅ 프로필 페이지에서 API Key 삭제
- ✅ 확인 다이얼로그 표시
- ✅ 삭제 후 목록에서 제거 확인
- ✅ Revoked API Key로 MCP 검증 시 401
- ✅ 삭제 취소 처리
- ✅ 권한 검증 (다른 사용자의 키 삭제 불가)

#### 6. 보안 테스트 (`api-keys/security.spec.ts`)

- ✅ 세션 없이 API 호출 → 401
- ✅ Rate Limiting (API Key 생성: 10/min, MCP 검증: 60/min)
- ✅ SQL Injection 방어
- ✅ XSS 방어
- ✅ API Key 형식 검증
- ✅ Timing Attack 방어 (bcrypt)

---

## 🚀 테스트 실행

### 1. 환경변수 설정

`.env.local` 파일에 다음 환경변수를 설정하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ⚠️ E2E 테스트용

# Playwright (선택사항)
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3001
PLAYWRIGHT_HEADLESS=true  # false로 설정하면 브라우저 UI 표시
```

⚠️ **보안 주의**: `SUPABASE_SERVICE_ROLE_KEY`는 E2E 테스트 환경에서만 사용하세요. 프로덕션 키를 절대 사용하지 마세요.

### 2. 테스트 실행 명령어

#### CI-safe smoke tests

```bash
pnpm test:e2e:smoke
```

#### Full local E2E suite

```bash
pnpm test:e2e
```

#### Specific test files

```bash
# API Key 생성 테스트만 실행
pnpm test:e2e api-keys/create-api-key.spec.ts

# MCP 검증 테스트만 실행
pnpm test:e2e api-keys/mcp-verify.spec.ts

# 보안 테스트만 실행
pnpm test:e2e api-keys/security.spec.ts
```

#### Headless 모드 비활성화 (브라우저 UI 표시)

```bash
PLAYWRIGHT_HEADLESS=false pnpm test:e2e
```

#### 특정 브라우저만 테스트

```bash
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

#### 디버그 모드 실행

```bash
pnpm playwright test --debug
```

---

## 🧪 OAuth 테스트 (수동)

OAuth 로그인 테스트는 실제 Google/GitHub 계정이 필요합니다.

### 수동 테스트 방법

1. **환경변수 설정**

   ```bash
   export TEST_GOOGLE_EMAIL=your-test@gmail.com
   export TEST_GITHUB_EMAIL=your-test@users.noreply.github.com
   ```

2. **Headless 모드 비활성화**

   ```bash
   PLAYWRIGHT_HEADLESS=false pnpm test:e2e auth/
   ```

3. **브라우저가 열리면 수동으로 로그인**

4. **테스트가 자동으로 진행됩니다**

### Mock OAuth (추후 구현)

실제 계정 없이 테스트하려면 Supabase Auth Mock을 사용할 수 있습니다:

```typescript
// 추후 구현 예정
await mockSupabaseAuth({
  provider: 'google',
  email: 'test@example.com',
  user_id: 'test-user-id',
});
```

---

## 📊 테스트 리포트

테스트 실행 후 HTML 리포트가 생성됩니다:

```bash
# 리포트 보기
pnpm playwright show-report
```

리포트에는 다음이 포함됩니다:

- ✅ 테스트 성공/실패 요약
- 📸 스크린샷 (실패 시)
- 🎥 비디오 녹화 (첫 재시도 시)
- 📊 실행 시간 통계

---

## 🛠️ 트러블슈팅

### 1. Supabase connection error

```
Error: Missing Supabase environment variables for E2E tests
```

**Resolution**: set the required Supabase variables in `.env.local`

### 2. Rate Limiting 테스트 실패

Rate Limiting 테스트는 이전 테스트의 영향을 받을 수 있습니다.

**해결**: Rate Limit 리셋 대기 (60초) 후 재실행

### 3. 테스트 사용자 정리 실패

테스트가 중간에 중단되면 테스트 사용자가 남을 수 있습니다.

**해결**: Supabase Dashboard에서 `test-*@tekton-e2e.test` 사용자 수동 삭제

### 4. OAuth 테스트 타임아웃

OAuth 로그인이 60초 이내에 완료되지 않으면 타임아웃됩니다.

**해결**: 테스트를 `.skip()` 처리하거나 타임아웃 증가

---

## 🏗️ 테스트 작성 가이드

### 새 테스트 추가

1. **테스트 파일 생성**

   ```typescript
   // __tests__/e2e/my-feature/my-test.spec.ts
   import { test, expect } from '@playwright/test';
   import { createTestUser, deleteTestUser, setAuthSession } from '../fixtures/auth';

   test.describe('My Feature E2E', () => {
     let userId: string;
     let userEmail: string;
     let userPassword: string;

     test.beforeAll(async () => {
       const { user, userId: id } = await createTestUser();
       userId = id;
       userEmail = user.email;
       userPassword = user.password;
     });

     test.afterAll(async () => {
       if (userId) {
         await deleteTestUser(userId);
       }
     });

     test('should do something', async ({ page }) => {
       await setAuthSession(page, userEmail, userPassword);
       await page.goto('/my-page');
       // ...
     });
   });
   ```

2. **픽스처 활용**
   - `createTestUser()`: 테스트 사용자 생성
   - `deleteTestUser()`: 테스트 사용자 삭제
   - `setAuthSession()`: 인증 세션 설정
   - `createTestApiKey()`: 테스트 API Key 생성
   - `deleteTestApiKey()`: 테스트 API Key 삭제

3. **테스트 실행**
   ```bash
   pnpm test:e2e my-feature/my-test.spec.ts
   ```

---

## 📝 체크리스트

SPEC-DEPLOY-001 Phase 2.5 완료 체크리스트:

### OAuth 로그인 플로우

- [x] Google OAuth 로그인 테스트 작성
- [x] GitHub OAuth 로그인 테스트 작성
- [ ] OAuth 로그인 수동 테스트 (실제 계정 필요)
- [x] 세션 유지 확인 테스트

### API Key 생성

- [x] 프로필 페이지 접속 테스트
- [x] "새 API Key 생성" 버튼 클릭 테스트
- [x] 이름 입력 테스트
- [x] 평문 키 표시 확인 (tk*live*, 40자)
- [x] "복사" 버튼 및 클립보드 검증 테스트
- [x] 경고 메시지 확인 테스트

### API Key 목록 조회

- [x] API Key 목록에 새로 생성된 키 표시
- [x] key_prefix 확인 (tk_live_xxxx)
- [x] name, created_at 표시 확인
- [x] 평문 키는 표시되지 않음 확인

### MCP 검증 엔드포인트 테스트

- [x] 유효한 API Key로 GET /api/mcp/verify 호출
- [x] 응답에 valid: true 확인
- [x] user 정보 (id, email, plan) 확인
- [x] licenses 배열 확인
- [x] themes 객체 확인

### API Key Revoke

- [x] API Key 목록에서 "삭제" 버튼 클릭
- [x] 확인 다이얼로그 표시
- [x] 삭제 후 목록에서 제거 확인
- [x] Revoked API Key로 MCP 검증 시 401 에러 확인

### 보안 테스트

- [x] 세션 없이 API Key 생성 시도 → 401
- [x] 무효한 API Key로 MCP 검증 → 401
- [x] 만료된 API Key로 MCP 검증 → 401
- [x] Rate Limiting 테스트
- [x] SQL Injection 방어
- [x] XSS 방어

### 테스트 인프라

- [x] Playwright 설정 파일 확인
- [x] E2E 테스트 픽스처 작성
- [x] 테스트 실행 스크립트 확인
- [x] 모든 시나리오 통과 확인
- [ ] CI/CD 통합 (GitHub Actions)

---

## 🔗 관련 문서

- [SPEC-DEPLOY-001](/.moai/specs/SPEC-DEPLOY-001/SPEC-DEPLOY-001.md)
- [Playwright 공식 문서](https://playwright.dev/)
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)

---

**Last Updated**: 2026-02-06
**Author**: expert-testing (MoAI-ADK)
**SPEC**: SPEC-DEPLOY-001 Phase 2.5
