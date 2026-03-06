# @framingui/tokens

> TypeScript 타입 정의 패키지. 디자인 토큰의 컴파일 타임 안전성을 제공합니다.

## 설치

```bash
npm install @framingui/tokens
```

---

## 핵심 역할

`@framingui/tokens`는 CSS 변수 기반 디자인 토큰의 **TypeScript 타입 정의**를 제공합니다. 이 패키지의 가장 중요한 특징은 다음과 같습니다:

- **Zero runtime**: 순수 타입만 제공하므로 번들 크기가 **0 바이트**입니다. 빌드 후 JavaScript 코드가 생성되지 않습니다.
- **컴파일 타임 안전성**: 잘못된 토큰 이름을 사용하면 TypeScript가 빌드 단계에서 오류를 발생시킵니다.
- **IDE 자동완성**: `TektonTokens` 인터페이스를 통해 사용 가능한 모든 토큰에 대한 자동완성을 지원합니다.

모든 토큰 값은 `TokenReference` 타입으로 정의되며, 이는 `var(--${string})` 형태의 CSS 변수 참조를 나타냅니다.

---

## 주요 타입

### TokenReference

모든 토큰 값의 기본 타입입니다. CSS 변수 참조를 나타냅니다.

```typescript
type TokenReference = `var(--${string})`;

// 예시
const color: TokenReference = 'var(--bg-primary-default)'; // 유효
const invalid: TokenReference = '#ff0000'; // 컴파일 오류
```

### TektonTokens

모든 토큰 카테고리를 포함하는 최상위 인터페이스입니다.

```typescript
interface TektonTokens {
  bg: BgTokens; // 배경 색상
  fg: FgTokens; // 전경/텍스트 색상
  spacing: SpacingTokens; // 간격
  radius: RadiusTokens; // 테두리 둥글기
  typography: TypographyTokens; // 타이포그래피
  shadow: ShadowTokens; // 그림자
  motion: MotionTokens; // 애니메이션
}
```

---

## 토큰 카테고리 상세

### Background (BgTokens)

배경 색상 토큰입니다. 모든 배경 관련 스타일에 사용합니다.

```typescript
interface BgTokens {
  surface: {
    default: TokenReference; // 기본 배경
    elevated: TokenReference; // 떠있는(elevated) 요소의 배경
    sunken: TokenReference; // 함몰된(sunken) 영역의 배경
  };
  primary: {
    default: TokenReference; // 기본 액션 배경
    hover: TokenReference; // 호버 상태
    active: TokenReference; // 활성 상태
  };
  secondary: { default; hover; active }; // 보조 액션
  accent: { default; hover; active }; // 강조 액션
  destructive: { default; hover; active }; // 위험/삭제 액션
  ghost: { default; hover; active }; // 고스트 버튼
  outline: { default; hover; active }; // 아웃라인 버튼
}
```

### Foreground (FgTokens)

텍스트 및 전경 색상 토큰입니다.

```typescript
interface FgTokens {
  primary: TokenReference; // 주요 텍스트
  secondary: TokenReference; // 보조 텍스트
  muted: TokenReference; // 비활성/흐린 텍스트
  inverse: TokenReference; // 반전 텍스트 (어두운 배경 위)
  link: TokenReference; // 링크 색상
  error: TokenReference; // 오류 텍스트
  success: TokenReference; // 성공 텍스트
  warning: TokenReference; // 경고 텍스트
  info: TokenReference; // 정보 텍스트
}
```

### Spacing (SpacingTokens)

4px 단위 기반의 간격 토큰입니다.

| 스케일 | 값   | 용도 예시             |
| ------ | ---- | --------------------- |
| `0`    | 0px  | 간격 없음             |
| `1`    | 4px  | 아이콘 내부 여백      |
| `2`    | 8px  | 밀집된 요소 간격      |
| `3`    | 12px | 소형 컴포넌트 패딩    |
| `4`    | 16px | 기본 패딩             |
| `5`    | 20px | 중간 간격             |
| `6`    | 24px | 섹션 간 간격          |
| `8`    | 32px | 큰 간격               |
| `10`   | 40px | 페이지 여백           |
| `12`   | 48px | 대형 섹션 여백        |
| `16`   | 64px | 페이지 상단/하단 여백 |
| `20`   | 80px | 히어로 섹션 여백      |
| `24`   | 96px | 최대 여백             |

```typescript
interface SpacingTokens {
  [key: number]: TokenReference;
  0: TokenReference; // 0px
  1: TokenReference; // 4px
  2: TokenReference; // 8px
  // ... (위 표 참조)
  24: TokenReference; // 96px
}
```

### Radius (RadiusTokens)

테두리 둥글기 토큰입니다.

```typescript
interface RadiusTokens {
  none: TokenReference; // 0px - 각진 모서리
  sm: TokenReference; // 작은 둥글기
  md: TokenReference; // 기본 둥글기
  lg: TokenReference; // 큰 둥글기
  xl: TokenReference; // 매우 큰 둥글기
  full: TokenReference; // 완전 원형 (9999px)
}
```

### Typography (TypographyTokens)

타이포그래피 관련 토큰입니다.

```typescript
interface TypographyTokens {
  fontFamily: {
    sans: TokenReference; // 기본 산세리프 폰트
    mono: TokenReference; // 고정폭(코드) 폰트
  };
  fontSize: {
    xs: TokenReference; // 매우 작은 텍스트
    sm: TokenReference; // 작은 텍스트
    base: TokenReference; // 기본 텍스트
    lg: TokenReference; // 큰 텍스트
    xl: TokenReference; // 제목급 텍스트
    '2xl': TokenReference; // 대형 제목
    '3xl': TokenReference; // 히어로 제목
    '4xl': TokenReference; // 최대 제목
  };
  fontWeight: {
    normal: TokenReference; // 400
    medium: TokenReference; // 500
    semibold: TokenReference; // 600
    bold: TokenReference; // 700
  };
  lineHeight: {
    tight: TokenReference; // 밀집된 행간
    normal: TokenReference; // 기본 행간
    relaxed: TokenReference; // 넓은 행간
  };
}
```

### Shadow (ShadowTokens)

그림자 토큰입니다.

```typescript
interface ShadowTokens {
  none: TokenReference; // 그림자 없음
  sm: TokenReference; // 미세한 그림자
  md: TokenReference; // 기본 그림자
  lg: TokenReference; // 큰 그림자
  xl: TokenReference; // 매우 큰 그림자 (모달, 드롭다운)
}
```

### Motion (MotionTokens)

애니메이션 타이밍 및 이징 토큰입니다. Framer Motion과의 통합을 위해 설계되었습니다.

```typescript
interface MotionTokens {
  duration: {
    instant: TokenReference; // 0ms - 즉각적 피드백
    fast: TokenReference; // 100ms - 마이크로 인터랙션
    moderate: TokenReference; // 200ms - 일반 트랜지션
    slow: TokenReference; // 300ms - 레이아웃 변경
    complex: TokenReference; // 500ms - 복잡한 애니메이션
  };
  easing: {
    linear: TokenReference; // 일정 속도
    standard: TokenReference; // ease-out (자연스러운 감속)
    emphasized: TokenReference; // cubic-bezier(0.2, 0, 0, 1)
    decelerate: TokenReference; // cubic-bezier(0, 0, 0.2, 1)
    accelerate: TokenReference; // cubic-bezier(0.4, 0, 1, 1)
  };
}
```

---

## 사용 예시

### 타입 가드로 토큰 값 검증

```typescript
import type { TokenReference } from '@framingui/tokens';

// 커스텀 컴포넌트 props에서 토큰 타입 사용
interface ThemedBoxProps {
  backgroundColor: TokenReference;
  textColor: TokenReference;
  padding: TokenReference;
}

function ThemedBox({ backgroundColor, textColor, padding }: ThemedBoxProps) {
  return (
    <div style={{ background: backgroundColor, color: textColor, padding }}>
      {/* 내용 */}
    </div>
  );
}

// 사용 - 올바른 예시
<ThemedBox
  backgroundColor="var(--bg-surface-default)"
  textColor="var(--fg-primary)"
  padding="var(--spacing-4)"
/>

// 사용 - 컴파일 오류 (하드코딩된 값)
<ThemedBox
  backgroundColor="#ffffff"  // 타입 오류!
  textColor="black"          // 타입 오류!
  padding="16px"             // 타입 오류!
/>
```

### 전체 토큰 인터페이스 활용

```typescript
import type { TektonTokens, BgTokens, FgTokens } from '@framingui/tokens';

// 테마 생성 시 타입 안전성 보장
function createThemeTokens(): Partial<TektonTokens> {
  return {
    bg: {
      surface: {
        default: 'var(--bg-surface-default)',
        elevated: 'var(--bg-surface-elevated)',
        sunken: 'var(--bg-surface-sunken)',
      },
      // ... 나머지 bg 토큰
    } as BgTokens,
  };
}
```

---

## 다른 패키지와의 관계

- **[@framingui/styled](./styled.md)**: `TektonTokens` 인터페이스를 사용하여 `tokens` 접근자의 타입을 정의합니다. `tokens.bg.primary.default`와 같은 접근 시 IDE 자동완성을 가능하게 합니다.
- **[@framingui/ui](./ui.md)**: 컴포넌트 내부에서 tokens 타입을 참조하여 CSS 변수를 사용합니다.
- **[@framingui/core](./core.md)**: 토큰 해석(resolve) 및 검증 시 타입 정의를 참조합니다.
- **[@framingui/esbuild-plugin](./esbuild-plugin.md)**: 빌드 시 코드에서 하드코딩된 값을 감지할 때, 토큰 스케일 정보를 참조합니다.

---

[< 패키지 개요로 돌아가기](./README.md)
