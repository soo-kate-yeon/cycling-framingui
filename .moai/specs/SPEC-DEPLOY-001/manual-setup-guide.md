# SPEC-DEPLOY-001 수동 설정 가이드

이 문서는 SPEC-DEPLOY-001 Phase 1 완료를 위해 사용자가 직접 수행해야 하는 작업들을 안내합니다.

## 목차

1. [Supabase DB 마이그레이션](#1-supabase-db-마이그레이션)
2. [npm Organization 생성](#2-npm-organization-생성)
3. [Vercel 프로젝트 생성](#3-vercel-프로젝트-생성)

---

## 1. Supabase DB 마이그레이션

### 1.1 Supabase 연결

**Step 1: Supabase CLI 로그인**

```bash
# Supabase CLI 설치 확인
supabase --version

# 설치되지 않은 경우:
# macOS
brew install supabase/tap/supabase

# 로그인
supabase login
```

브라우저가 열리고 Supabase 계정으로 로그인하세요.

**Step 2: 프로젝트 연결**

```bash
cd packages/playground-web

# 프로젝트 리스트 확인
supabase projects list

# 프로젝트 연결
supabase link --project-ref [YOUR_PROJECT_REF]
```

`[YOUR_PROJECT_REF]`는 Supabase Dashboard URL에서 확인할 수 있습니다:
```
https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]
```

### 1.2 테이블 존재 여부 확인

**Supabase Dashboard 사용:**

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택
3. 좌측 메뉴 > Table Editor 클릭
4. 다음 테이블 확인:
   - `user_profiles`
   - `api_keys`
   - `user_licenses`

**psql 사용 (선택사항):**

```bash
# Supabase에서 연결 문자열 복사
# Dashboard > Project Settings > Database > Connection string

psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 테이블 확인 쿼리
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'api_keys', 'user_licenses');
```

### 1.3 Migration 적용

#### 시나리오 A: 테이블이 없는 경우 (권장)

**Supabase Dashboard SQL Editor 사용:**

1. Dashboard > SQL Editor 이동
2. "New Query" 클릭
3. 다음 파일 내용을 복사:
   ```
   packages/playground-web/supabase/migrations/20260206151505_deploy_001_schema.sql
   ```
4. SQL Editor에 붙여넣기
5. "Run" 버튼 클릭
6. 에러 없이 완료되면 ✅ 성공

**Supabase CLI 사용:**

```bash
cd packages/playground-web

# Migration 적용
supabase db push

# 또는 특정 파일만:
supabase db execute -f supabase/migrations/20260206151505_deploy_001_schema.sql
```

#### 시나리오 B: user_licenses 테이블이 이미 있는 경우

⚠️ **경고**: `user_licenses` 테이블이 SPEC-AUTH-001에서 생성되었을 수 있습니다.

**Option 1: 기존 테이블 업그레이드 (데이터 보존)**

Supabase Dashboard SQL Editor에서 다음 쿼리 실행:

```sql
-- Step 1: 새 컬럼 추가
ALTER TABLE public.user_licenses
  ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Step 2: 컬럼 타입 변경 (VARCHAR → TEXT)
ALTER TABLE public.user_licenses
  ALTER COLUMN theme_id TYPE TEXT,
  ALTER COLUMN tier TYPE TEXT,
  ALTER COLUMN paddle_subscription_id TYPE TEXT;

-- Step 3: UNIQUE 제약조건 업데이트
DROP INDEX IF EXISTS user_licenses_user_id_theme_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_licenses_unique
  ON public.user_licenses(user_id, theme_id)
  WHERE is_active = true;

-- Step 4: 나머지 테이블 생성 (user_profiles, api_keys만)
-- 아래 SQL 실행:
```

그 다음, `20260206151505_deploy_001_schema.sql` 파일을 열고:
- Line 95-134 (`user_licenses` 섹션)을 **제외**하고
- 나머지 부분만 SQL Editor에 붙여넣어 실행

**Option 2: 기존 테이블 삭제 후 재생성 (개발 환경만)**

⚠️ **경고**: 기존 데이터가 모두 삭제됩니다!

```sql
-- 기존 테이블 삭제
DROP TABLE IF EXISTS public.user_licenses CASCADE;

-- 전체 마이그레이션 실행
-- [20260206151505_deploy_001_schema.sql 전체 복사하여 실행]
```

### 1.4 검증

Migration 완료 후 다음을 확인하세요:

**1. 테이블 생성 확인**

```sql
SELECT COUNT(*) AS table_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_profiles', 'api_keys', 'user_licenses');
-- Expected: table_count = 3
```

**2. RLS 활성화 확인**

```sql
SELECT
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'api_keys', 'user_licenses');
-- Expected: 모든 테이블이 rls_enabled = true
```

**3. RLS 정책 확인**

```sql
SELECT
  tablename,
  COUNT(*) AS policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_profiles', 'api_keys', 'user_licenses')
GROUP BY tablename;
```

Expected:
- `user_profiles`: 3개
- `api_keys`: 4개
- `user_licenses`: 2개

**4. 인덱스 생성 확인**

```sql
SELECT
  tablename,
  indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('api_keys', 'user_licenses')
ORDER BY tablename, indexname;
```

Expected:
- `api_keys`: `idx_api_keys_user_id`, `idx_api_keys_key_hash`
- `user_licenses`: `idx_user_licenses_user_id`, `idx_user_licenses_unique`

### 1.5 완료 확인

모든 검증이 통과하면:

- [ ] 3개 테이블 생성 완료
- [ ] RLS 활성화 확인
- [ ] RLS 정책 개수 확인 (총 9개)
- [ ] 인덱스 생성 확인

✅ Supabase DB 마이그레이션 완료!

---

## 2. npm Organization 생성

### 2.1 npm 계정 확인

```bash
# npm 로그인 상태 확인
npm whoami

# 로그인되지 않은 경우
npm login
```

### 2.2 @tekton Organization 생성

**Option A: npm Website 사용 (권장)**

1. https://www.npmjs.com 로그인
2. 우측 상단 프로필 아이콘 클릭
3. "Add Organization" 선택
4. Organization 정보 입력:
   - **Organization Name**: `tekton`
   - **Display Name**: `Tekton Design System`
   - **Email**: 귀하의 이메일
   - **Type**: Unlimited public packages (무료)
5. "Create Organization" 클릭

**Option B: npm CLI 사용**

```bash
# Organization 생성 (인터랙티브)
npm org create tekton

# 멤버 추가 (본인)
npm org set tekton [your-username] developer
```

### 2.3 NPM_TOKEN 발급

**Step 1: Access Token 생성**

1. https://www.npmjs.com 로그인
2. 프로필 아이콘 > "Access Tokens" 클릭
3. "Generate New Token" > "Classic Token" 선택
4. Token 설정:
   - **Token Name**: `tekton-github-actions`
   - **Type**: **Automation** (CI/CD용)
   - **Scope**: Read and write
5. "Generate Token" 클릭
6. **토큰 복사** (다시 표시되지 않음!)

**Step 2: GitHub Secrets 등록**

1. GitHub 저장소 페이지 이동
2. Settings > Secrets and variables > Actions
3. "New repository secret" 클릭
4. 입력:
   - **Name**: `NPM_TOKEN`
   - **Secret**: [복사한 토큰 붙여넣기]
5. "Add secret" 클릭

### 2.4 Organization 멤버 추가 (선택사항)

팀원이 있는 경우:

```bash
# 멤버 추가
npm org add tekton [username] developer

# 멤버 목록 확인
npm org ls tekton
```

### 2.5 검증

```bash
# Organization 정보 확인
npm org ls tekton

# 패키지 퍼블리시 권한 테스트 (dry-run)
cd packages/tokens
npm publish --dry-run
```

에러 없이 완료되면 ✅ npm org 설정 완료!

---

## 3. Vercel 프로젝트 생성

### 3.1 Vercel 계정 준비

1. https://vercel.com 로그인 (GitHub 계정 연동 권장)
2. Dashboard 접속

### 3.2 프로젝트 생성

**Step 1: Import Git Repository**

1. Dashboard에서 "Add New..." > "Project" 클릭
2. GitHub 저장소 선택:
   - Repository: `tekton` (또는 실제 저장소 이름)
3. "Import" 클릭

**Step 2: 프로젝트 설정**

```
Framework Preset: Next.js

Build and Output Settings:
  Root Directory: packages/playground-web
  Build Command: cd ../.. && pnpm install && pnpm --filter @tekton/playground-web build
  Output Directory: .next
  Install Command: pnpm install --frozen-lockfile

Environment Variables: (나중에 설정)
```

4. "Deploy" 클릭
5. 첫 배포 완료 대기 (2-3분)

### 3.3 도메인 연결

**Step 1: 도메인 추가**

1. 프로젝트 설정 > Domains 탭
2. "Add" 버튼 클릭
3. 도메인 입력: `framingui.com`
4. "Add" 클릭

**Step 2: DNS 설정**

도메인 등록 업체(예: Namecheap, GoDaddy)에서:

**A 레코드 추가:**
```
Type: A
Host: @
Value: 76.76.21.21
TTL: 3600
```

**CNAME 레코드 추가 (www):**
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Step 3: DNS 전파 확인**

```bash
# DNS 전파 확인 (10-30분 소요)
dig framingui.com
dig www.framingui.com

# 또는 온라인 도구 사용:
# https://dnschecker.org
```

### 3.4 환경변수 설정

프로젝트 설정 > Environment Variables 탭에서 다음 변수 추가:

#### Production 환경

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=[Supabase Project URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase Anon Key]
SUPABASE_SERVICE_ROLE_KEY=[Supabase Service Role Key]

# App
NEXT_PUBLIC_APP_URL=https://framingui.com

# Feature Flags
NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_PAYMENTS=false

# Paddle (Phase 3에서 추가)
# PADDLE_API_KEY=
# PADDLE_WEBHOOK_SECRET=
# NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=
# NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
```

**Paddle Production 필수 추가 설정**:
- Paddle Dashboard에서 **default payment link / default checkout URL** 을 설정해야 합니다.
- 이 값이 비어 있으면 프로덕션 체크아웃 생성 시 `transaction_default_checkout_url_not_set` 400 오류가 발생합니다.
- `https://framingui.com/pricing` 또는 실제 결제 진입 페이지를 기본 URL로 설정한 뒤 재시도합니다.

**중요**: 각 환경변수는 Supabase Dashboard에서 확인:
- Dashboard > Project Settings > API

#### Preview 환경 (선택사항)

develop 브랜치에서:
```
NEXT_PUBLIC_APP_URL=https://dev.framingui.com
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

### 3.5 배포 확인

**Step 1: Production 배포 트리거**

```bash
# master 브랜치에 푸시
git checkout master
git merge feature/SPEC-DEPLOY-001
git push origin master
```

**Step 2: 배포 모니터링**

1. Vercel Dashboard > Deployments 탭
2. 최신 배포 상태 확인
3. "Visit" 버튼으로 사이트 접속

**Step 3: 도메인 접속 확인**

```bash
# SSL 인증서 확인 (자동 발급)
curl -I https://framingui.com

# 브라우저에서 접속
open https://framingui.com
```

### 3.6 Preview 배포 설정 (선택사항)

1. 프로젝트 설정 > Git 탭
2. "Production Branch": `master`
3. "Preview Branches": `develop`
4. develop 브랜치를 dev.framingui.com으로 설정:
   - Settings > Domains > Add Domain > `dev.framingui.com`

### 3.7 검증

- [ ] https://framingui.com 접속 가능
- [ ] SSL 인증서 정상 (자물쇠 아이콘)
- [ ] www.framingui.com → framingui.com 리다이렉트
- [ ] /studio 페이지 접근 가능
- [ ] Vercel Analytics 작동 확인

✅ Vercel 프로젝트 설정 완료!

---

## 4. Phase 1 완료 체크리스트

모든 작업이 완료되었는지 확인:

### 자동화 작업 (완료됨)

- [x] DB 마이그레이션 스크립트 작성
- [x] npm 패키지 설정 정리 (버전 0.2.0, publishConfig)
- [x] .env.example 업데이트

### 수동 작업 (확인 필요)

- [ ] Supabase DB 마이그레이션 실행
- [ ] 3개 테이블 생성 확인 (user_profiles, api_keys, user_licenses)
- [ ] RLS 정책 활성화 확인
- [ ] @tekton npm organization 생성
- [ ] NPM_TOKEN GitHub Secret 등록
- [ ] Vercel 프로젝트 생성
- [ ] framingui.com 도메인 연결
- [ ] Vercel 환경변수 설정

### 최종 검증

```bash
# npm 패키지 빌드 테스트
pnpm --filter "./packages/*" build

# npm 퍼블리시 테스트 (dry-run)
pnpm --filter @tekton/tokens publish --dry-run

# Vercel 도메인 접속
curl -I https://framingui.com
```

---

## 다음 단계

Phase 1이 완료되면:

- **Phase 2** (Auth Consolidation) - ✅ 이미 완료됨
- **Phase 3** (Payment Integration) - Paddle 통합
- **Phase 4** (MCP Server Auth & npm Publishing) - MCP 인증 레이어
- **Phase 5** (Launch Verification) - E2E 테스트 및 배포

---

**문서 생성일**: 2026-02-06
**SPEC**: SPEC-DEPLOY-001
**작성자**: Alfred (MoAI-ADK Orchestrator)
