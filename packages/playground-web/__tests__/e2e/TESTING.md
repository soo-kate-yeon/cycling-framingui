# E2E Quick Start

Use `pnpm test:e2e:smoke` for CI-safe smoke coverage.
Use `pnpm test:e2e` for the full local suite when Supabase test credentials are available.

---

## ⚡ 5분 안에 테스트 실행하기

### 1. 환경변수 설정 (1분)

`.env.local` 파일을 프로젝트 루트에 생성하고 다음을 추가하세요:

```bash
# Supabase (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # ⚠️ 테스트 환경 전용!

# Playwright (선택사항)
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3001
PLAYWRIGHT_HEADLESS=true
```

### 2. 개발 서버 시작 (1분)

```bash
cd packages/playground-web
pnpm dev
```

서버가 `http://localhost:3001`에서 실행되는지 확인하세요.

### 3. 테스트 실행 (3분)

새 터미널에서:

```bash
# CI-safe smoke tests
pnpm test:e2e:smoke

# Full local E2E suite
pnpm test:e2e

# 또는 특정 테스트만 실행
pnpm test:e2e api-keys/mcp-verify.spec.ts
```

---

## 📊 테스트 결과 확인

테스트가 완료되면 HTML 리포트를 확인하세요:

```bash
pnpm playwright show-report
```

---

## 🎯 주요 테스트 시나리오

### 1. API Key 생성 및 검증

```bash
pnpm test:e2e api-keys/create-api-key.spec.ts
pnpm test:e2e api-keys/mcp-verify.spec.ts
```

**예상 결과**:

- ✅ API Key가 `tk_live_` 형식으로 생성됨
- ✅ MCP 검증 엔드포인트에서 유효한 응답 반환
- ✅ user, licenses, themes 정보 확인

### 2. API Key 목록 및 삭제

```bash
pnpm test:e2e api-keys/list-api-keys.spec.ts
pnpm test:e2e api-keys/revoke-api-key.spec.ts
```

**예상 결과**:

- ✅ API Key 목록에 생성된 키 표시 (prefix만)
- ✅ 삭제 후 목록에서 제거
- ✅ Revoked 키로 MCP 검증 시 401 에러

### 3. 보안 테스트

```bash
pnpm test:e2e api-keys/security.spec.ts
```

**예상 결과**:

- ✅ 인증 없이 API 호출 시 401 에러
- ✅ Rate Limiting 동작 (10/min, 60/min)
- ✅ SQL Injection, XSS 방어 확인

---

## 🔧 트러블슈팅

### 문제: Supabase 연결 오류

```
Error: Missing Supabase environment variables
```

**해결**:

1. `.env.local` 파일이 `packages/playground-web/` 디렉토리에 있는지 확인
2. 환경변수가 올바르게 설정되었는지 확인
3. 개발 서버 재시작

### 문제: Rate Limiting 테스트 실패

**해결**:
Rate Limit이 리셋될 때까지 60초 대기 후 재실행

```bash
# 60초 대기 후 재실행
sleep 60 && pnpm test:e2e api-keys/security.spec.ts
```

### 문제: 포트 충돌 (3001)

**해결**:
`playwright.config.ts`에서 포트 변경

```typescript
use: {
  baseURL: 'http://localhost:3002',  // 변경
},
```

그리고 `.env.local`에서도 변경:

```bash
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3002
```

---

## 🎬 브라우저 UI로 테스트 보기

테스트가 실행되는 모습을 직접 보고 싶다면:

```bash
PLAYWRIGHT_HEADLESS=false pnpm test:e2e
```

또는 디버그 모드:

```bash
pnpm playwright test --debug api-keys/create-api-key.spec.ts
```

---

## 📈 CI/CD 통합

GitHub Actions에서 자동 실행:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4

      - run: pnpm install
      - run: pnpm --filter @framingui/playground-web build

      - name: Run E2E Tests
        run: pnpm --filter @framingui/playground-web test:e2e:smoke
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          PLAYWRIGHT_HEADLESS: true

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: packages/playground-web/playwright-report/
```

---

## ✅ 체크리스트

테스트 실행 전 확인:

- [ ] `.env.local` 파일에 Supabase 환경변수 설정
- [ ] 개발 서버가 `localhost:3001`에서 실행 중
- [ ] Supabase 프로젝트가 정상 작동 중
- [ ] `pnpm install` 완료

테스트 완료 후 확인:

- [ ] 모든 테스트가 통과했는지 확인
- [ ] HTML 리포트에서 실패한 테스트 없는지 확인
- [ ] 테스트 사용자가 정리되었는지 확인 (Supabase Dashboard)

---

## 📞 문제 해결이 안 되면?

1. **로그 확인**: 터미널 출력에서 `[E2E]` 로그 확인
2. **스크린샷 확인**: `playwright-report/` 디렉토리에서 실패 시점 스크린샷 확인
3. **이슈 보고**: GitHub Issues에 테스트 로그와 함께 이슈 생성

---

**Last Updated**: 2026-02-06
**SPEC**: SPEC-DEPLOY-001 Phase 2.5
