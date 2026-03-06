# @framingui/core

> 디자인 시스템 파이프라인 엔진. Theme -> Token -> Blueprint -> Screen 생성 전체 흐름을 담당합니다.

## 설치

```bash
npm install @framingui/core
```

---

## 핵심 역할

`@framingui/core`는 Tekton 디자인 시스템의 **두뇌** 역할을 합니다. 테마 로딩부터 스크린 코드 생성까지, 디자인 시스템 파이프라인의 모든 단계를 처리합니다.

**주요 특징:**

- 외부 의존성 최소화 (`zod`만 사용)
- 원본 코드베이스 대비 98.3% LOC 감소 (89,993 -> 1,526 LOC)
- 3-Layer 토큰 시스템 (Atomic -> Semantic -> Component)
- 순환 참조 감지 및 Zod 스키마 검증
- React 컴포넌트 코드 생성 (styled-components, Emotion, Tailwind)

---

## 주요 서브시스템

### 1. 테마 관리

테마를 로딩하고 관리하는 기능을 제공합니다. 테마 파일은 `.moai/themes/generated/` 디렉토리에서 JSON 형식으로 관리됩니다.

```typescript
import { loadTheme, listThemes, themeExists } from '@framingui/core';

// 사용 가능한 테마 목록 조회
const themes = listThemes();
// => [{ id: 'neutral-workspace', name: '...', ... }, ...]

// 특정 테마 로딩
const theme = loadTheme('neutral-workspace');
if (theme) {
  console.log(theme.brandTone); // 테마 브랜드 톤
  console.log(theme.designDNA); // 디자인 DNA 정보
}

// 테마 존재 여부 확인
const exists = themeExists('minimal-workspace'); // true
```

**내장 테마 목록:**

- `classic-magazine` - 클래식 매거진 스타일
- `dark-boldness` - 피트니스/웰빙 테마
- `minimal-workspace` - 미니멀 워크스페이스
- `neutral-workspace` - 뉴트럴 휴머니즘
- `pebble` - 라운드 미니멀
- `square-minimalism` - 스퀘어 미니멀리즘

### 2. 3-Layer 토큰 시스템

디자인 토큰은 세 개의 레이어로 구성됩니다.

**Layer 1 - Atomic Tokens**: 원시적인 값 (색상, 크기 등)
**Layer 2 - Semantic Tokens**: 의미를 가진 토큰 (primary, danger 등), Atomic 토큰을 참조
**Layer 3 - Component Tokens**: 컴포넌트별 토큰 (button-bg, card-shadow 등), Semantic 토큰을 참조

```typescript
import {
  resolveToken,
  resolveWithFallback,
  validateTheme,
  generateThemeCSS,
} from '@framingui/core';

// 토큰 해석 - 참조 체인을 따라가며 최종 값 반환
const value = resolveToken(themeTokens, 'bg-primary');
// => 'oklch(0.5 0.2 250)' (최종 색상 값)

// 폴백이 있는 토큰 해석
const safeValue = resolveWithFallback(themeTokens, 'bg-custom', 'bg-primary');

// 테마 검증 (Zod 스키마 기반)
const validation = validateTheme(theme);
if (!validation.success) {
  console.error(validation.error.issues);
}

// CSS 변수 생성
const css = generateThemeCSS(theme);
// => ':root { --bg-primary: oklch(...); ... }'
```

**순환 참조 감지**: 토큰 A -> B -> C -> A 같은 순환 참조를 자동으로 감지하고 오류를 보고합니다.

### 3. 블루프린트

JSON 기반 UI 정의를 생성하고 검증합니다.

```typescript
import { createBlueprint, validateBlueprint, LAYOUTS, COMPONENT_CATALOG } from '@framingui/core';

// 블루프린트 생성
const blueprint = createBlueprint({
  description: '사용자 대시보드',
  layout: 'dashboard',
  themeId: 'minimal-workspace',
  componentHints: ['card', 'table', 'chart'],
});

// 블루프린트 검증
const result = validateBlueprint(blueprint);
if (result.valid) {
  console.log('블루프린트가 유효합니다');
}

// 사용 가능한 레이아웃 조회
console.log(LAYOUTS);
// => ['single-column', 'two-column', 'sidebar-left', 'sidebar-right', 'dashboard', 'landing']

// 사용 가능한 컴포넌트 카탈로그
console.log(COMPONENT_CATALOG);
```

### 4. 레이아웃 토큰 (SPEC-LAYOUT)

화면 구성을 위한 구조적 토큰을 제공합니다.

#### Shell 토큰

전체 앱 프레임(내비게이션, 헤더, 풋터)을 정의합니다.

```typescript
import {
  SHELL_WEB_APP,
  SHELL_WEB_DASHBOARD,
  SHELL_WEB_MARKETING,
  SHELL_WEB_AUTH,
  SHELL_WEB_ADMIN,
  SHELL_WEB_MINIMAL,
  // 모바일
  SHELL_MOBILE_APP,
  SHELL_MOBILE_FULLSCREEN,
  SHELL_MOBILE_MODAL,
  SHELL_MOBILE_TAB,
  SHELL_MOBILE_DRAWER,
  SHELL_MOBILE_DETAIL,
  getShellToken,
  getAllShellTokens,
} from '@framingui/core';

const shell = SHELL_WEB_DASHBOARD;
// => { id: 'SHELL_WEB_DASHBOARD', regions: [...], config: {...} }
```

#### Page 토큰

페이지 내부 콘텐츠 구조를 정의합니다.

```typescript
import {
  PAGE_DASHBOARD,
  PAGE_DETAIL,
  PAGE_SETTINGS,
  PAGE_JOB,
  PAGE_RESOURCE,
  PAGE_EMPTY,
  PAGE_WIZARD,
  PAGE_ONBOARDING,
  getPageLayoutToken,
} from '@framingui/core';

const page = PAGE_DASHBOARD;
// => { id: 'PAGE_DASHBOARD', purpose: 'dashboard', sections: [...] }
```

#### Section 토큰

섹션 내부의 콘텐츠 배치 패턴을 정의합니다.

```typescript
import {
  SECTION_GRID_2,
  SECTION_GRID_3,
  SECTION_GRID_4,
  SECTION_GRID_AUTO,
  SECTION_SPLIT_30_70,
  SECTION_SPLIT_50_50,
  SECTION_SPLIT_70_30,
  SECTION_STACK_START,
  SECTION_STACK_CENTER,
  SECTION_STACK_END,
  SECTION_SIDEBAR_LEFT,
  SECTION_SIDEBAR_RIGHT,
  SECTION_CONTAINER,
  getSectionCSS,
} from '@framingui/core';

// 섹션 패턴의 CSS 코드 가져오기
const css = getSectionCSS(SECTION_GRID_3);
```

#### Responsive 토큰

반응형 브레이크포인트를 정의합니다.

```typescript
import {
  BREAKPOINT_SM, // 640px
  BREAKPOINT_MD, // 768px
  BREAKPOINT_LG, // 1024px
  BREAKPOINT_XL, // 1280px
  BREAKPOINT_2XL, // 1536px
  getBreakpointMediaQuery,
} from '@framingui/core';

const query = getBreakpointMediaQuery(BREAKPOINT_MD);
// => '@media (min-width: 768px)'
```

### 5. 스크린 생성

Screen Definition JSON에서 실제 React 컴포넌트 코드를 생성합니다.

```typescript
import { validateScreenDefinition, resolveScreen, generateReactComponent } from '@framingui/core';

// 스크린 정의 검증
const screenDef = {
  id: 'login-screen',
  shell: 'SHELL_WEB_AUTH',
  page: 'PAGE_EMPTY',
  sections: [
    {
      id: 'login-form',
      pattern: 'SECTION_STACK_CENTER',
      components: [{ type: 'card', props: { title: '로그인' } }],
    },
  ],
};

const validation = validateScreenDefinition(screenDef);
if (validation.valid) {
  // 스크린 해석
  const resolved = resolveScreen(screenDef);

  // React 컴포넌트 코드 생성
  const result = generateReactComponent(resolved, {
    cssFramework: 'tailwind', // 또는 'styled-components', 'emotion'
    typescript: true,
  });

  console.log(result.code);
  // => TypeScript React 컴포넌트 코드
}
```

**지원하는 CSS 출력 형식:**

- `tailwind` - Tailwind CSS 클래스 기반
- `styled-components` - styled-components 기반
- `emotion` - Emotion CSS-in-JS 기반

### 6. 아이콘 라이브러리

아이콘 라이브러리를 로딩하고 검색하는 기능을 제공합니다.

```typescript
import {
  loadIconLibrary,
  listIconLibraries,
  findIcon,
  searchIconsByTag,
  getIconsByCategory,
  generateImportStatement,
} from '@framingui/core';

// 사용 가능한 아이콘 라이브러리 목록
const libraries = listIconLibraries();

// 특정 라이브러리 로딩
const lucide = loadIconLibrary('lucide');

// 아이콘 검색
const icon = findIcon('lucide', 'arrow-right');
const searchResults = searchIconsByTag('lucide', 'navigation');

// import 문 생성
const importCode = generateImportStatement('lucide', 'ArrowRight', 'react');
// => "import { ArrowRight } from 'lucide-react';"
```

---

## 컴포넌트 스키마

`@framingui/core`는 모든 UI 컴포넌트의 스키마를 정의합니다. Primitive 컴포넌트와 Composed 컴포넌트로 분류됩니다.

```typescript
import {
  PRIMITIVE_COMPONENTS, // 기본 컴포넌트 (Button, Input, etc.)
  COMPOSED_COMPONENTS, // 복합 컴포넌트 (Card, Dialog, etc.)
  ALL_COMPONENTS, // 전체 컴포넌트
  getComponentSchema, // 특정 컴포넌트 스키마 조회
  validateComponentSchema,
} from '@framingui/core';

// 컴포넌트 스키마 조회
const buttonSchema = getComponentSchema('button');
console.log(buttonSchema.props); // prop 정의
console.log(buttonSchema.a11y); // 접근성 요구사항
console.log(buttonSchema.tokens); // 토큰 바인딩
```

---

## 모바일 지원

Safe Area, Keyboard Avoidance, Touch Target 등 모바일 관련 유틸리티를 제공합니다.

```typescript
import {
  // Safe Area
  getSafeAreaInsets,
  applySafeAreaToLayout,
  useSafeArea,
  // Keyboard
  getKeyboardHeight,
  applyKeyboardAvoidance,
  useKeyboardAvoidance,
  // Touch Target
  validateTouchTarget,
  applyMinTouchTarget,
} from '@framingui/core';

// Safe Area 인셋 가져오기
const insets = getSafeAreaInsets('iphone-14');

// 터치 타겟 검증 (WCAG 기준)
const isValid = validateTouchTarget({ width: 44, height: 44 });
```

---

## 다른 패키지와의 관계

- **[@framingui/tokens](./tokens.md)**: core가 정의하는 토큰 시스템의 타입은 tokens 패키지에서 가져옵니다.
- **[@framingui/ui](./ui.md)**: core에서 생성한 블루프린트와 스크린 정의를 ui 컴포넌트로 렌더링합니다.
- **[@framingui/mcp-server](./mcp-server.md)**: core의 모든 기능을 MCP 도구로 노출하여 AI 에이전트가 활용할 수 있게 합니다.
- **[@framingui/styled](./styled.md)**: core의 토큰 시스템과 동일한 토큰 이름 체계를 공유합니다.

---

[< 패키지 개요로 돌아가기](./README.md)
