# @framingui/styled

> styled-components 래퍼. 디자인 토큰 사용을 강제하여 하드코딩을 방지합니다.

## 설치

```bash
npm install @framingui/styled styled-components
```

### Peer Dependencies

```json
{
  "styled-components": "^6.0.0"
}
```

---

## 핵심 역할

`@framingui/styled`는 styled-components의 **drop-in replacement**입니다. 기존 styled-components API와 100% 호환되면서도, 하드코딩된 디자인 값(색상, 간격 등)을 사용하면 런타임에서 즉시 오류를 발생시킵니다.

**왜 필요한가?**

디자인 시스템에서 가장 흔한 문제는 개발자가 토큰 대신 하드코딩된 값을 사용하는 것입니다. `#ff0000`이나 `16px` 같은 값이 코드에 들어가면, 테마 변경이나 디자인 일관성 유지가 불가능해집니다. `@framingui/styled`는 이 문제를 근본적으로 방지합니다.

---

## 토큰 강제 메커니즘

### 거부되는 값

`@framingui/styled`는 다음과 같은 하드코딩된 값을 감지하면 오류를 발생시킵니다.

**색상 값:**

```typescript
// 모두 거부됨
styled.div`
  color: #ff0000; // hex 색상
  background: rgb(255, 0, 0); // rgb() 함수
  border-color: rgba(0, 0, 0, 0.5); // rgba() 함수
  color: hsl(0, 100%, 50%); // hsl() 함수
  background: hsla(0, 100%, 50%, 1); // hsla() 함수
`;
// => Error: [Tekton] Hardcoded value detected: hex color "#ff0000"
//    Use tokens instead. Example: tokens.bg.primary.default
```

**간격 값:**

```typescript
// 모두 거부됨
styled.div`
  padding: 16px; // 하드코딩된 padding
  margin: 24px; // 하드코딩된 margin
  gap: 8px; // 하드코딩된 gap
  width: 200px; // 하드코딩된 width
  height: 100px; // 하드코딩된 height
  top: 10px; // 하드코딩된 position 값
`;
// => Error: [Tekton] Hardcoded value detected: pixel spacing "padding: 16px"
//    Use tokens instead. Example: tokens.spacing[4]
```

### 허용되는 값

다음 속성들은 토큰과 무관하므로 자유롭게 사용할 수 있습니다.

```typescript
// 허용됨
styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
`;
```

---

## tokens 접근자

`tokens` 객체는 Proxy 기반으로 구현되어 있으며, 프로퍼티 접근 경로가 자동으로 CSS 변수 참조(`var(--...)`)로 변환됩니다. `@framingui/tokens`의 `TektonTokens` 인터페이스 타입이 적용되어 IDE 자동완성이 지원됩니다.

```typescript
import { tokens } from '@framingui/styled';

// 배경 색상
tokens.bg.surface.default; // => 'var(--bg-surface-default)'
tokens.bg.primary.hover; // => 'var(--bg-primary-hover)'
tokens.bg.destructive.active; // => 'var(--bg-destructive-active)'

// 텍스트 색상
tokens.fg.primary; // => 'var(--fg-primary)'
tokens.fg.muted; // => 'var(--fg-muted)'
tokens.fg.error; // => 'var(--fg-error)'

// 간격
tokens.spacing[0]; // => 'var(--spacing-0)'
tokens.spacing[4]; // => 'var(--spacing-4)'
tokens.spacing[8]; // => 'var(--spacing-8)'

// 둥글기
tokens.radius.md; // => 'var(--radius-md)'
tokens.radius.full; // => 'var(--radius-full)'

// 그림자
tokens.shadow.sm; // => 'var(--shadow-sm)'
tokens.shadow.lg; // => 'var(--shadow-lg)'

// 타이포그래피
tokens.typography.fontSize.base; // => 'var(--typography-fontSize-base)'
tokens.typography.fontWeight.bold; // => 'var(--typography-fontWeight-bold)'

// 모션
tokens.motion.duration.fast; // => 'var(--motion-duration-fast)'
tokens.motion.easing.standard; // => 'var(--motion-easing-standard)'
```

---

## 사용 예시

### 올바른 사용

```typescript
import { styled, tokens } from '@framingui/styled';

const Container = styled.div`
  background: ${tokens.bg.surface.default};
  padding: ${tokens.spacing[6]};
  border-radius: ${tokens.radius.lg};
  box-shadow: ${tokens.shadow.md};
`;

const Title = styled.h1`
  color: ${tokens.fg.primary};
  font-size: ${tokens.typography.fontSize['2xl']};
  font-weight: ${tokens.typography.fontWeight.bold};
  line-height: ${tokens.typography.lineHeight.tight};
`;

const PrimaryButton = styled.button`
  background: ${tokens.bg.primary.default};
  color: ${tokens.fg.inverse};
  padding: ${tokens.spacing[2]} ${tokens.spacing[4]};
  border-radius: ${tokens.radius.md};
  transition: background ${tokens.motion.duration.fast} ${tokens.motion.easing.standard};

  &:hover {
    background: ${tokens.bg.primary.hover};
  }

  &:active {
    background: ${tokens.bg.primary.active};
  }
`;
```

### 잘못된 사용 (오류 발생)

```typescript
import { styled, tokens } from '@framingui/styled';

// 색상 하드코딩 - 런타임 오류 발생
const BadContainer = styled.div`
  background: #f5f5f5;
  color: rgb(0, 0, 0);
`;
// => Error: [Tekton] Hardcoded value detected: hex color "#f5f5f5"

// 간격 하드코딩 - 런타임 오류 발생
const BadCard = styled.div`
  padding: 24px;
  margin: 16px;
`;
// => Error: [Tekton] Hardcoded value detected: pixel spacing "padding: 24px"
```

---

## validateNoHardcodedValues

수동으로 템플릿 문자열을 검증하고 싶을 때 사용합니다.

```typescript
import { validateNoHardcodedValues } from '@framingui/styled';

// 유효한 CSS - 오류 없음
validateNoHardcodedValues`
  display: flex;
  background: var(--bg-surface-default);
`;

// 하드코딩된 값 - 오류 발생
validateNoHardcodedValues`
  background: #ffffff;
`;
// => throws Error: [Tekton] Hardcoded value detected: hex color "#ffffff"
```

---

## css와 createGlobalStyle

styled-components의 `css`와 `createGlobalStyle`도 그대로 사용할 수 있습니다.

```typescript
import { css, createGlobalStyle, tokens } from '@framingui/styled';

// css 헬퍼
const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 글로벌 스타일
const GlobalStyle = createGlobalStyle`
  body {
    background: ${tokens.bg.surface.default};
    color: ${tokens.fg.primary};
    font-family: ${tokens.typography.fontFamily.sans};
  }
`;
```

---

## 기존 프로젝트에서 마이그레이션

styled-components에서 `@framingui/styled`로의 마이그레이션은 import 경로만 변경하면 됩니다.

```typescript
// 변경 전
import styled from 'styled-components';

const Box = styled.div`
  background: #ffffff;
  padding: 16px;
`;

// 변경 후
import { styled, tokens } from '@framingui/styled';

const Box = styled.div`
  background: ${tokens.bg.surface.default};
  padding: ${tokens.spacing[4]};
`;
```

---

## 다른 패키지와의 관계

- **[@framingui/tokens](./tokens.md)**: `tokens` 접근자의 타입 정의를 `TektonTokens` 인터페이스에서 가져옵니다.
- **[@framingui/esbuild-plugin](./esbuild-plugin.md)**: 런타임 검증(styled)과 빌드 타임 검증(esbuild-plugin)은 동일한 규칙을 적용하지만 서로 다른 시점에서 동작합니다. 두 패키지를 함께 사용하면 더 강력한 토큰 강제가 가능합니다.
- **[@framingui/ui](./ui.md)**: ui 컴포넌트와 함께 사용할 때, 커스텀 styled 컴포넌트도 동일한 토큰 체계를 따르게 됩니다.

---

[< 패키지 개요로 돌아가기](./README.md)
