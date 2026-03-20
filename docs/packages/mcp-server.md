# @framingui/mcp-server

> Claude Code용 MCP 서버. AI가 Tekton 디자인 시스템을 직접 활용하여 스크린을 생성합니다.

## 설치

```bash
npm install @framingui/mcp-server
```

### CLI 실행

```bash
# npx로 즉시 실행
npx -y @framingui/mcp-server@latest

# 또는 전역 설치 후 실행
npm install -g @framingui/mcp-server@latest
framingui-mcp --version
framingui-mcp
```

---

## Quick Start: `init` 명령어

프로젝트에 FramingUI를 한 줄로 설정합니다.

```bash
npx -y @framingui/mcp-server@latest init
```

이 명령어는 다음을 자동으로 수행합니다:

1. **프로젝트 감지** - Next.js / Vite 자동 인식
2. **패키지 설치** - `@framingui/ui`, `tailwindcss-animate` (패키지 매니저 자동 감지)
3. **Tailwind 런타임 설정** - Tailwind v4는 shared styles 경로를 사용하고, Tailwind v3만 `tailwind.config.ts`를 보정
4. **CSS 임포트 추가** - `globals.css`에 `@import '@framingui/ui/styles'` 추가
5. **Provider bootstrap** - `app/layout.tsx` 또는 `src/main.tsx`에 `FramingUIProvider` 추가
6. **Theme module 생성** - 로컬 `framingui-theme` 모듈 생성
7. **MCP 연결** - `.mcp.json`에 FramingUI 서버 등록 (프로젝트 루트)
8. **가이드 생성** - `FRAMINGUI-GUIDE.md` 프로젝트 루트에 생성
9. **AI 에이전트 가이드** - `CLAUDE.md` 및 `AGENTS.md`에 FramingUI 워크플로우 섹션 추가
10. **완료 안내** - 인증 필요성 및 다음 단계 안내

```
@framingui/mcp-server init

[1/10] 프로젝트 감지 중...
      Next.js 프로젝트

[2/10] 패키지 설치 중...
      pnpm add @framingui/ui tailwindcss-animate

[3/10] Tailwind 런타임 설정 중...
      globals.css / tailwind 설정 점검 완료

[4/10] CSS 임포트 추가 중...
      app/globals.css 업데이트 완료

[5/10] Bootstrapping FramingUIProvider...
      app/layout.tsx 업데이트 완료
      app/framingui-theme.ts 생성 완료

[6/10] Claude Code MCP 설정 중...
      .mcp.json 생성 완료

[7/10] 가이드 문서 생성 중...
      FRAMINGUI-GUIDE.md 생성 완료

[8/10] AI 에이전트 가이드 설정 중...
      CLAUDE.md 생성 완료
      AGENTS.md 생성 완료

[9/10] 환경 검증 중...
      runtime contract 점검 완료

[10/10] 설정 완료

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  FramingUI 설정 완료!

  다음 단계:
  1. 먼저 인증하세요: framingui-mcp login
  2. Claude Code를 재시작하세요
  3. AI에게 요청하세요: "로그인 화면 만들어줘"
  4. FRAMINGUI-GUIDE.md에서 전체 가이드를 확인하세요

  중요: 모든 6개 테마는 인증이 필요합니다

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

설정 완료 후 Claude Code를 재시작하면, AI에게 자연어로 화면 생성을 요청할 수 있습니다.

### init가 맞춰주는 런타임 계약

`init`의 목적은 단순 설치가 아니라 아래 런타임 계약을 고정하는 것입니다.

- 글로벌 스타일시트에서 `@import '@framingui/ui/styles';`를 정확히 한 번 유지
- 앱 루트에서 `FramingUIProvider`를 정확히 한 번 mount
- 로컬 `framingui-theme` 모듈을 생성하고 provider에 전달
- `tailwindcss-animate`를 설치해 overlay motion 유틸리티를 보장

Tailwind v4 프로젝트에서는 `@framingui/ui/styles`가 패키지 내부 유틸리티 스캔과 animation hook를 제공하므로, 소비 앱이 `@source`나 `content` 경로를 수동으로 덧붙일 필요가 없습니다.

이미 `.mcp.json` 에 `framingui` entry 가 있다면, 최신 CLI의 `init` 은 그 entry 를 `npx -y @framingui/mcp-server@latest` 형태로 갱신합니다.

---

## 핵심 역할

`@framingui/mcp-server`는 **MCP Protocol (JSON-RPC 2.0)**을 통해 Claude Code에 16개의 디자인 시스템 도구와 2개의 MCP Prompts를 제공합니다.

AI 에이전트가 이 서버를 통해 다음 작업을 수행할 수 있습니다:

- 자연어 설명으로 UI 블루프린트 생성
- 테마 탐색 및 미리보기
- 스크린 정의 검증 및 React 코드 생성
- 컴포넌트/템플릿 카탈로그 조회
- 프로젝트 환경 검증 (의존성, Tailwind 설정)

---

## Claude Code 설정 방법

프로젝트 루트에 `.mcp.json` 파일을 생성합니다 (버전 관리에 포함 가능).

```json
{
  "mcpServers": {
    "tekton": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@framingui/mcp-server@latest"]
    }
  }
}
```

설정 후 Claude Code를 재시작하면, AI가 Tekton 디자인 시스템 도구를 자동으로 사용할 수 있습니다.

`whoami` is optional. Use it to inspect the current session and licensed themes, but authenticated tool calls do not require a prior `whoami` request.

`whoami` also exposes a shadow quota snapshot. This is non-blocking metering for Phase 0/1 business-model work: weighted tool units are recorded and summarized, but no quota enforcement happens yet.

`licensedThemes` is always the canonical current theme-id list that MCP tools can actually open. Legacy stored license ids such as `default` are normalized before they reach MCP responses so `whoami`, `list-themes`, and `preview-theme` stay aligned.

Production MCP routes no longer depend on deployment-time `.moai` filesystem access. Theme catalog metadata is bundled into the runtime so serverless deployments keep `verify`, `list-themes`, and `preview-theme` consistent.

---

## 16개 도구 카탈로그

### Blueprint & Theme (3개)

| 도구                 | 설명                             | 필수 파라미터                      |
| -------------------- | -------------------------------- | ---------------------------------- |
| `generate-blueprint` | 자연어로 UI 블루프린트 생성      | `description`, `layout`, `themeId` |
| `preview-theme`      | 테마 미리보기 (디자인 토큰 확인) | `themeId`                          |
| `list-themes`        | 사용 가능한 테마 목록            | 없음                               |

**사용 시나리오:** 사용자가 "대시보드 만들어줘"라고 하면, AI가 먼저 `list-themes`로 테마를 확인하고, `generate-blueprint`로 구조를 설계합니다.

### Export (1개)

| 도구            | 설명                                     | 필수 파라미터         |
| --------------- | ---------------------------------------- | --------------------- |
| `export-screen` | 블루프린트를 JSX/TSX/Vue 코드로 내보내기 | `blueprint`, `format` |

### Icon (2개)

| 도구                   | 설명                               | 필수 파라미터 |
| ---------------------- | ---------------------------------- | ------------- |
| `list-icon-libraries`  | 사용 가능한 아이콘 라이브러리 목록 | 없음          |
| `preview-icon-library` | 아이콘 라이브러리 미리보기         | `libraryId`   |

### Screen Generation (4개)

프로덕션 레디 스크린을 생성하기 위한 **4단계 워크플로우** 도구입니다.

| 단계     | 도구                            | 설명                                   | 필수 파라미터                      |
| -------- | ------------------------------- | -------------------------------------- | ---------------------------------- |
| Step 1/4 | `get-screen-generation-context` | 스크린 생성에 필요한 컨텍스트 조회     | `description`                      |
| Step 2/4 | `validate-screen-definition`    | 스크린 정의 JSON 검증                  | `definition`                       |
| Step 3/4 | `generate_screen`               | 검증된 정의로 React 코드 생성          | `screenDefinition`, `outputFormat` |
| Step 4/4 | `validate-environment`          | 프로젝트 환경 검증 (의존성 + Tailwind) | `projectPath`, `requiredPackages`  |

**추가 도구:**

| 도구              | 설명                           | 필수 파라미터            |
| ----------------- | ------------------------------ | ------------------------ |
| `validate_screen` | 간단한 스크린 정의 검증        | `screenDefinition`       |
| `list_tokens`     | 사용 가능한 레이아웃 토큰 목록 | 없음 (선택: `tokenType`) |

### Component & Template Discovery (4개)

| 도구                      | 설명                                             | 필수 파라미터                     |
| ------------------------- | ------------------------------------------------ | --------------------------------- |
| `list-components`         | UI 컴포넌트 카탈로그                             | 없음 (선택: `category`, `search`) |
| `preview-component`       | 컴포넌트 상세 정보 (props, variants, 예시)       | `componentId`                     |
| `list-screen-templates`   | 스크린 템플릿 카탈로그                           | 없음 (선택: `category`, `search`) |
| `preview-screen-template` | 템플릿 상세 정보 (skeleton, layout, 커스텀 경계) | `templateId`                      |

### Environment (1개)

| 도구                   | 설명                                | 필수 파라미터                     |
| ---------------------- | ----------------------------------- | --------------------------------- |
| `validate-environment` | NPM 패키지 + Tailwind CSS 설정 검증 | `projectPath`, `requiredPackages` |

---

## 스크린 생성 워크플로우

AI 에이전트가 프로덕션 레디 스크린을 생성하는 전체 흐름입니다.

**Step 1**: `get-screen-generation-context` 호출

```
사용자 요청: "로그인 페이지 만들어줘"
  -> AI가 사용자 설명을 전달
  -> 매칭되는 템플릿, 컴포넌트, 스키마 정보 반환
```

**Step 2**: 반환된 컨텍스트를 기반으로 Screen Definition JSON 생성 후 `validate-screen-definition` 호출

```
  -> 유효성 검사 통과 시 다음 단계
  -> 실패 시 오류 메시지와 수정 제안 반환
```

**Step 3**: 검증된 정의로 `generate_screen` 호출

```
  -> React 컴포넌트 코드 생성
  -> 필요한 외부 의존성 목록 반환
```

**Step 4**: `validate-environment` 호출 (선택)

```
  -> 프로젝트에 필요한 패키지가 설치되어 있는지 확인
  -> Tailwind CSS 설정이 올바른지 검증
  -> 누락된 패키지의 설치 명령어 제공
```

---

## 내장 테마 목록

`list-themes` 도구를 통해 확인할 수 있는 테마입니다.

| 테마 ID             | 설명                 |
| ------------------- | -------------------- |
| `classic-magazine`  | 클래식 매거진 스타일 |
| `dark-boldness`     | 피트니스/웰빙 테마   |
| `minimal-workspace` | 미니멀 워크스페이스  |
| `neutral-workspace` | 뉴트럴 휴머니즘      |
| `pebble`            | 라운드 미니멀        |
| `square-minimalism` | 스퀘어 미니멀리즘    |

**중요:** 모든 6개 테마는 인증이 필요합니다. 무료 테마는 없습니다.

---

## MCP Prompts (범용 가이드)

MCP 서버는 모든 MCP 클라이언트에서 사용 가능한 2개의 내장 프롬프트를 제공합니다:

### 1. getting-started

**목적:** FramingUI 온보딩 완전 가이드

**내용:**

- 인증 설정 (framingui-mcp login)
- 테마 탐색 워크플로우
- 컴포넌트 가용성 확인
- 4단계 스크린 생성 워크플로우
- 일반적인 실수 및 문제 해결

**사용 시점:** 신규 사용자, 온보딩, 워크플로우 개요 필요 시

### 2. screen-workflow

**목적:** 상세한 4단계 프로덕션 워크플로우

**내용:**

- Step 1/4: get-screen-generation-context
- Step 2/4: validate-screen-definition
- Step 3/4: generate_screen
- Step 4/4: validate-environment
- 완전한 예시 및 문제 해결

**사용 시점:** 프로덕션 스크린 생성, 워크플로우 명확화 필요 시

**참고:** 이 프롬프트들은 플랫폼 독립적이며 Claude Code, OpenAI Codex, Cursor, Windsurf 등 모든 MCP 호환 클라이언트에서 작동합니다.

---

## 인증

MCP 서버는 API 키 기반 인증을 지원합니다.

### 인증 방법

**방법 1: 환경 변수**

```bash
export TEKTON_API_KEY=your-api-key-here
npx @framingui/mcp-server
```

**방법 2: CLI 로그인**

```bash
framingui-mcp login
# 브라우저에서 인증 후 ~/.tekton/credentials.json에 저장
```

**방법 3: 인증 없이 사용**

API 키 없이도 서버를 시작할 수 있지만, 도구 호출 시 인증이 필요합니다.

### 크레덴셜 체인

서버 시작 시 다음 순서로 API 키를 탐색합니다:

1. `TEKTON_API_KEY` 환경 변수
2. `~/.tekton/credentials.json` 파일 (CLI 로그인 방식)
3. 둘 다 없으면 인증 없이 시작 (도구 호출 시 인증 필요 안내)

---

## 환경 검증 (validate-environment)

`generate_screen`으로 코드를 생성한 후, `validate-environment`로 프로젝트 환경을 검증할 수 있습니다.

### NPM 패키지 검증

```
입력: projectPath + requiredPackages 배열
출력:
  - installed: 이미 설치된 패키지와 버전
  - missing: 설치가 필요한 패키지
  - installCommands: npm/yarn/pnpm/bun별 설치 명령어
```

### Tailwind CSS 검증

`checkTailwind: true` (기본값)으로 설정하면 다음을 추가로 검증합니다:

- 글로벌 스타일시트의 `@import '@framingui/ui/styles'` 존재 여부
- `FramingUIProvider` bootstrap 존재 여부
- 로컬 `framingui-theme` 모듈 존재 여부
- `tailwindcss-animate` 사용 가능 여부
- Tailwind v3 프로젝트일 때만 `tailwind.config.{ts,js,mjs,cjs}`의 content/plugin 설정 여부

즉, Tailwind v4에서는 `tailwind.config.ts`가 없어도 실패가 아니며, 실제 런타임 계약이 맞는지를 우선 검증합니다.

---

## MCP Inspector로 디버깅

MCP 서버를 독립적으로 테스트하고 디버깅할 수 있습니다.

```bash
# MCP Inspector 실행
cd packages/mcp-server
npx @anthropic-ai/mcp-inspector node dist/index.js
```

Inspector가 실행되면 브라우저에서 각 도구를 개별적으로 호출하고 응답을 확인할 수 있습니다.

---

## 다른 패키지와의 관계

- **[@framingui/core](./core.md)**: MCP 서버의 핵심 엔진입니다. 테마 로딩, 블루프린트 생성, 스크린 코드 생성 등 모든 핵심 기능은 core 패키지에서 가져옵니다.
- **[@framingui/ui](./ui.md)**: 컴포넌트 카탈로그와 스크린 템플릿 정보를 ui 패키지에서 가져와 AI에게 제공합니다.
- **[@framingui/tokens](./tokens.md)**: 토큰 목록 조회 시 tokens 패키지의 타입 정의를 참조합니다.

---

[< 패키지 개요로 돌아가기](./README.md)
