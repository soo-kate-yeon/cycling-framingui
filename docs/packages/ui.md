# @framingui/ui

> 30+ 프로덕션 레디 React 컴포넌트 라이브러리. Radix UI + Tailwind CSS 기반입니다.

## 설치

```bash
npm install @framingui/ui
```

### Peer Dependencies

```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

---

## Next.js에서 사용하기

### 1. Tailwind CSS 설정

`tailwind.config.ts`에 패키지 경로를 추가합니다.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // @framingui/ui 컴포넌트 경로 추가
    './node_modules/@framingui/ui/dist/**/*.{js,mjs}',
  ],
  plugins: [
    require('tailwindcss-animate'), // Dialog, Popover 애니메이션에 필요
  ],
};

export default config;
```

### 2. 토큰 CSS 임포트

`globals.css`에 토큰 스타일을 추가합니다.

```css
/* globals.css */
@import '@framingui/ui/styles';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. 컴포넌트 사용

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@framingui/ui';

export default function HomePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>환영합니다</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default" size="lg">
          시작하기
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 컴포넌트 카탈로그

### Tier 1 - Core (15개)

기본적이고 가장 자주 사용되는 컴포넌트입니다.

| 컴포넌트     | 설명        | 주요 기능                                                        |
| ------------ | ----------- | ---------------------------------------------------------------- |
| `Button`     | 버튼        | `variant`: default, secondary, destructive, ghost, outline, link |
| `Input`      | 텍스트 입력 | 기본 텍스트 입력 필드                                            |
| `Label`      | 레이블      | 폼 필드 레이블                                                   |
| `Card`       | 카드        | CardHeader, CardTitle, CardDescription, CardContent, CardFooter  |
| `Badge`      | 배지        | `variant`: default, secondary, destructive, outline              |
| `Avatar`     | 아바타      | AvatarImage, AvatarFallback                                      |
| `Separator`  | 구분선      | 수평/수직 구분선                                                 |
| `Checkbox`   | 체크박스    | 체크 상태 토글                                                   |
| `RadioGroup` | 라디오 그룹 | RadioGroup, RadioGroupItem                                       |
| `Switch`     | 스위치      | 토글 스위치                                                      |
| `Textarea`   | 텍스트 영역 | 여러 줄 텍스트 입력                                              |
| `Skeleton`   | 스켈레톤    | 로딩 플레이스홀더                                                |
| `ScrollArea` | 스크롤 영역 | 커스텀 스크롤바 (ScrollBar)                                      |
| `Select`     | 선택        | SelectTrigger, SelectContent, SelectItem                         |
| `Progress`   | 진행 표시줄 | 진행 상태 시각화                                                 |

### Tier 2 - Complex (10개)

상호작용이 복잡한 컴포넌트입니다.

| 컴포넌트         | 설명            | 주요 기능                                             |
| ---------------- | --------------- | ----------------------------------------------------- |
| `Dialog`         | 다이얼로그      | 모달 대화 상자 (DialogContent, DialogTitle, ...)      |
| `DropdownMenu`   | 드롭다운 메뉴   | 컨텍스트 메뉴 (DropdownMenuItem, ...)                 |
| `Table`          | 테이블          | 데이터 테이블 (TableHeader, TableRow, TableCell, ...) |
| `Tabs`           | 탭              | 탭 내비게이션 (TabsList, TabsTrigger, TabsContent)    |
| `Toast`          | 토스트          | 알림 메시지 (ToastProvider, ToastAction, ...)         |
| `Tooltip`        | 툴팁            | 호버 설명 (TooltipProvider, TooltipContent, ...)      |
| `Popover`        | 팝오버          | 플로팅 콘텐츠 (PopoverTrigger, PopoverContent)        |
| `Sheet`          | 시트            | 사이드 패널 (SheetContent, SheetHeader, ...)          |
| `AlertDialog`    | 경고 다이얼로그 | 확인/취소 대화 상자                                   |
| `NavigationMenu` | 내비게이션 메뉴 | 상단 내비게이션 바                                    |

### Tier 3 - Advanced (5개)

고급 기능을 제공하는 복합 컴포넌트입니다.

| 컴포넌트     | 설명       | 주요 기능                                                         |
| ------------ | ---------- | ----------------------------------------------------------------- |
| `Sidebar`    | 사이드바   | 접이식 사이드바 (SidebarHeader, SidebarContent, SidebarItem, ...) |
| `Breadcrumb` | 브레드크럼 | 경로 내비게이션 (BreadcrumbItem, BreadcrumbLink, ...)             |
| `Command`    | 커맨드     | 검색 + 명령 팔레트 (CommandInput, CommandList, CommandItem, ...)  |
| `Calendar`   | 달력       | 날짜 선택기 (react-day-picker 기반)                               |
| `Form`       | 폼         | 폼 검증 (react-hook-form + zod 기반)                              |

---

## 사용 예시

### Button

```tsx
import { Button } from '@framingui/ui';

function ButtonExamples() {
  return (
    <div className="flex gap-4">
      <Button variant="default">기본</Button>
      <Button variant="secondary">보조</Button>
      <Button variant="destructive">삭제</Button>
      <Button variant="outline">아웃라인</Button>
      <Button variant="ghost">고스트</Button>
      <Button variant="link">링크</Button>

      {/* 크기 변형 */}
      <Button size="sm">작은</Button>
      <Button size="default">기본</Button>
      <Button size="lg">큰</Button>
      <Button size="icon">+</Button>
    </div>
  );
}
```

### Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@framingui/ui';

function ProfileCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>프로필 설정</CardTitle>
        <CardDescription>프로필 정보를 업데이트하세요.</CardDescription>
      </CardHeader>
      <CardContent>{/* 폼 내용 */}</CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">취소</Button>
        <Button>저장</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@framingui/ui';

function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">설정 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>설정을 변경하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 신중하게 결정해 주세요.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">취소</Button>
          <Button>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 스크린 템플릿 (13개)

프로덕션에서 바로 사용할 수 있는 완성된 화면 템플릿을 제공합니다.

### Auth (인증) - 4개

| 템플릿                   | 설명                             |
| ------------------------ | -------------------------------- |
| `LoginTemplate`          | 로그인 화면 - 이메일/비밀번호 폼 |
| `SignupTemplate`         | 회원가입 화면 - 사용자 등록 폼   |
| `ForgotPasswordTemplate` | 비밀번호 찾기 - 이메일 입력      |
| `VerificationTemplate`   | 인증 화면 - 코드/이메일 인증     |

### Core (핵심) - 3개

| 템플릿                | 설명                        |
| --------------------- | --------------------------- |
| `LandingTemplate`     | 랜딩 페이지 - 마케팅 히어로 |
| `PreferencesTemplate` | 환경설정 - 사용자 설정      |
| `ProfileTemplate`     | 프로필 - 사용자 정보 관리   |

### Feedback (피드백) - 5개

| 템플릿                 | 설명                              |
| ---------------------- | --------------------------------- |
| `LoadingTemplate`      | 로딩 상태 - 스켈레톤/스피너       |
| `ErrorTemplate`        | 오류 화면 - 에러 메시지 및 재시도 |
| `EmptyTemplate`        | 빈 상태 - 데이터 없음 안내        |
| `ConfirmationTemplate` | 확인 화면 - 작업 확인 요청        |
| `SuccessTemplate`      | 성공 화면 - 작업 완료 안내        |

### Dashboard (대시보드) - 1개

| 템플릿              | 설명                         |
| ------------------- | ---------------------------- |
| `DashboardTemplate` | 대시보드 개요 - 통계 및 차트 |

### 템플릿 사용 예시

```tsx
import { LoginTemplateComponent, templateRegistry } from '@framingui/ui';

// 컴포넌트로 직접 사용
function LoginPage() {
  return (
    <LoginTemplateComponent
      texts={{
        title: '로그인',
        subtitle: '계정에 로그인하세요',
      }}
    />
  );
}

// 레지스트리를 통한 조회
const allTemplates = templateRegistry.getAll();
const authTemplates = templateRegistry.getByCategory('auth');
const loginTemplate = templateRegistry.get('auth.login');
```

---

## 테마 시스템

`@framingui/ui`는 CSS Variables 기반 3-layer 아키텍처를 통해 테마를 관리합니다.

### 테마 적용

```tsx
import { themeToCSS, injectThemeCSS } from '@framingui/ui';

// 테마 CSS 생성
const css = themeToCSS(themeData);

// DOM에 테마 CSS 주입
injectThemeCSS(themeData);
```

### CSS 변수 구조

```css
:root {
  /* Background */
  --bg-surface-default: oklch(0.98 0.002 250);
  --bg-primary-default: oklch(0.55 0.18 250);

  /* Foreground */
  --fg-primary: oklch(0.15 0.005 250);
  --fg-muted: oklch(0.55 0.01 250);

  /* Spacing */
  --spacing-4: 16px;
  --spacing-8: 32px;

  /* ... 기타 토큰 */
}
```

---

## Motion 유틸리티

Framer Motion 기반 애니메이션 유틸리티를 제공합니다.

```tsx
import {
  motionTokens,
  transitions,
  fadeVariants,
  slideVariants,
  scaleVariants,
  useMotionSafe,
  getMotionTransition,
} from '@framingui/ui';
import { motion } from 'framer-motion';

function AnimatedCard() {
  const motionSafe = useMotionSafe();

  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate={motionSafe ? 'visible' : false}
      transition={getMotionTransition('moderate')}
    >
      <Card>{/* 내용 */}</Card>
    </motion.div>
  );
}
```

---

## 접근성 (Accessibility)

모든 컴포넌트는 **WCAG 2.1 AA** 기준을 준수합니다.

- **Radix UI 기반**: 키보드 내비게이션, 포커스 관리, ARIA 속성이 자동 적용됩니다.
- **스크린 리더 지원**: 모든 인터랙티브 요소에 적절한 레이블이 제공됩니다.
- **색상 대비**: 토큰 시스템을 통해 최소 4.5:1 대비율을 보장합니다.
- **키보드 접근성**: 탭 순서, Enter/Space 키 활성화, Escape 키 닫기가 지원됩니다.

접근성 테스트는 `vitest-axe`를 사용하여 자동화되어 있습니다.

```bash
# 접근성 테스트 실행
pnpm --filter @framingui/ui test:a11y
```

---

## 유틸리티 함수

```tsx
import { cn } from '@framingui/ui';

// cn() - clsx + tailwind-merge
// 조건부 클래스 병합 및 Tailwind 충돌 해결
<div className={cn('p-4 bg-white', isActive && 'bg-blue-500', className)} />;
```

```tsx
import { tokenVars, isTokenReference, extractTokenName } from '@framingui/ui';

// 토큰 CSS 변수 참조
const bgColor = tokenVars.bg.surface.default;
// => 'var(--bg-surface-default)'

// 토큰 참조 여부 확인
isTokenReference('var(--spacing-4)'); // true
isTokenReference('16px'); // false
```

---

## 다른 패키지와의 관계

- **[@framingui/tokens](./tokens.md)**: 직접 의존합니다. 컴포넌트 스타일에 사용되는 토큰 타입을 제공합니다.
- **[@framingui/core](./core.md)**: 스크린 생성 파이프라인에서 ui 컴포넌트를 참조합니다.
- **[@framingui/styled](./styled.md)**: 동일한 토큰 체계를 공유합니다. styled-components 프로젝트에서 ui 컴포넌트와 함께 사용할 수 있습니다.
- **[@framingui/mcp-server](./mcp-server.md)**: MCP 서버가 ui 패키지의 컴포넌트 및 템플릿 정보를 AI에게 제공합니다.

---

[< 패키지 개요로 돌아가기](./README.md)
