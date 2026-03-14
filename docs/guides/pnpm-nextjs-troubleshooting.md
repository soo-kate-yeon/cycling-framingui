# pnpm Workspace + Next.js + TypeScript 트러블슈팅 가이드

> 2026-01-28 작성 | pnpm workspace 환경에서 Next.js 빌드 문제 해결 사례

## 배경

pnpm workspace 환경에서 `@tekton/core` 같은 로컬 패키지를 Next.js 앱에서 사용할 때 발생하는 빌드 문제와 해결 방법을 정리합니다.

## 문제 유형 및 해결책

### 0. FramingUI 컴포넌트 shape는 깨지고 토큰만 일부 먹는 경우

#### 증상

- `Button` 텍스트 색은 보이는데 높이와 패딩이 이상함
- `Dialog`, `Popover`, `DropdownMenu`가 뜨긴 하지만 animation이 없음
- theme는 적용된 것 같은데 recipe 품질이 데모보다 낮아 보임

#### 원인

Tailwind v4 앱에서 FramingUI 런타임 계약이 일부만 맞은 상태입니다.

- `@framingui/ui/styles` import 누락 또는 중복
- `FramingUIProvider` 중복 mount
- `framingui-theme` 모듈 누락
- `tailwindcss-animate` 미설치
- `body`, `button`, `input` 등에 강한 글로벌 스타일이 FramingUI 토큰을 덮음

#### 해결 방법

**globals.css**

```css
@import '@framingui/ui/styles';
@import 'tailwindcss';
```

**app/layout.tsx**

```tsx
import './globals.css';
import { FramingUIProvider } from '@framingui/ui';
import framinguiTheme from './framingui-theme';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FramingUIProvider theme={framinguiTheme}>{children}</FramingUIProvider>
      </body>
    </html>
  );
}
```

**패키지 설치**

```bash
pnpm add @framingui/ui tailwindcss-animate
```

**중요:**

- Tailwind v4 앱에서는 `tailwind.config.ts`에 `@framingui/ui/dist` content 경로를 손으로 추가하지 않아도 됩니다.
- published `@framingui/ui/styles`가 내부적으로 source scanning과 animation hook를 제공합니다.
- provider는 루트에서 한 번만 mount 해야 합니다.
- theme token block을 `globals.css`에 손으로 복사하지 마세요.

### 1. Module not found: Can't resolve './theme.js'

#### 증상

```
Module not found: Can't resolve './theme.js'
> Import trace for requested module:
> ./node_modules/@tekton/core/src/index.ts
```

#### 원인

1. **pnpm symlink**: pnpm이 `node_modules/@tekton/core`를 `packages/core/` 루트로 symlink 연결
2. **Next.js webpack 동작**: symlink를 따라가서 `src/index.ts`를 찾음
3. **TypeScript NodeNext**: `import { x } from './theme.js'` 형태의 확장자 import 사용
4. **빌드 실패**: `src/theme.js`가 없으므로 (실제로는 `src/theme.ts`) 모듈 해석 실패

#### 해결 방법

**next.config.ts:**

```typescript
const nextConfig: NextConfig = {
  // Workspace 패키지 transpile
  transpilePackages: ['@tekton/core', '@framingui'],
  webpack: config => {
    // pnpm symlink를 따라가지 않고 package.json exports 사용
    config.resolve.symlinks = false;
    return config;
  },
};
```

**핵심 원리:**

- `symlinks: false`: webpack이 symlink를 따라가지 않고 `package.json`의 `exports` 필드 사용
- pnpm 패키지는 `"main": "./dist/index.js"`를 export하므로 빌드된 파일 사용

---

### 2. tsconfig.json paths 충돌

#### 증상

```
Cannot find module '@tekton/core' or its corresponding type declarations
```

또는 paths를 통해 `packages/core/dist`로 매핑했는데 다른 에러 발생

#### 원인

- pnpm이 이미 symlink로 패키지를 연결
- tsconfig paths가 이를 덮어쓰면서 충돌 발생

#### 해결 방법

**tsconfig.json에서 workspace 패키지 paths 제거:**

```jsonc
{
  "compilerOptions": {
    "paths": {
      // @tekton/core, @framingui paths 제거!
      // pnpm이 자동으로 해석함
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
    },
  },
}
```

---

### 3. Object.entries TypeError (런타임 에러)

#### 증상

```
TypeError: Cannot convert undefined or null to object
    at Function.entries (<anonymous>)
```

Next.js 빌드 시 정적 페이지 생성(prerender) 단계에서 발생

#### 원인

- 함수 파라미터에 `null` 또는 `undefined`가 전달됨
- 예: `generateThemeCSS(theme)` 호출 시 theme이 null
- 또는 theme 객체 내부 필드가 스키마와 다름 (예: `theme.tokens.atomic.typography`가 없음)

#### 해결 방법

**1. null 안전 검사 추가:**

```typescript
// BAD
for (const [key, value] of Object.entries(obj.field)) { ... }

// GOOD
if (obj.field) {
  for (const [key, value] of Object.entries(obj.field)) { ... }
}
```

**2. 에러 발생 함수에 try-catch 추가:**

```typescript
function resolveTokenWithFallback(ref: string, tokens: Tokens): string {
  try {
    const resolved = resolveToken(ref, tokens);
    if (resolved !== ref) return resolved;
  } catch {
    // graceful fallback
  }
  return `var(--fallback-${ref})`;
}
```

---

### 4. Next.js 캐시로 인한 이전 에러 재현

#### 증상

- 코드를 수정했는데도 같은 에러가 계속 발생
- 빌드된 파일 확인 시 수정사항이 반영되어 있음

#### 원인

- Next.js `.next/` 캐시에 이전 빌드 결과가 남아있음

#### 해결 방법

```bash
# 캐시 삭제 후 재빌드
rm -rf .next
pnpm build
```

---

## 디버깅 체크리스트

빌드 에러 발생 시 아래 순서로 확인:

1. **[ ] 에러 메시지 정확히 확인**
   - Module not found → symlink 문제
   - TypeError at Object.entries → null 체크 필요
   - Type error → 스키마 불일치

2. **[ ] workspace 패키지 빌드 상태 확인**

   ```bash
   # 패키지 빌드
   cd packages/core && pnpm build

   # dist 파일 존재 확인
   ls dist/index.js
   ```

3. **[ ] Next.js 캐시 삭제**

   ```bash
   rm -rf .next
   ```

4. **[ ] 직접 함수 테스트**

   ```bash
   node --input-type=module -e "
   import { loadTheme, generateThemeCSS } from './dist/index.js';
   const theme = loadTheme('theme-id');
   console.log('Theme:', theme);
   const css = generateThemeCSS(theme);
   console.log('CSS:', css.substring(0, 500));
   "
   ```

5. **[ ] 스키마 확인**
   - 구 스키마 vs 신 스키마 필드 차이 확인
   - 예: `ThemeWithTokens` vs `ThemeV2`

---

## 관련 설정 파일 템플릿

### next.config.ts (pnpm workspace 호환)

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // pnpm workspace 패키지 처리
  transpilePackages: ['@tekton/core', '@framingui'],
  webpack: config => {
    // symlink 비활성화 - package.json exports 사용
    config.resolve.symlinks = false;
    return config;
  },
};

export default nextConfig;
```

### tsconfig.json (pnpm workspace 호환)

```jsonc
{
  "compilerOptions": {
    // workspace 패키지는 paths에서 제외
    // pnpm symlink가 자동 해석
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
    },
  },
}
```

---

## 참고 자료

- [pnpm symlinks 설명](https://pnpm.io/symlinked-node-modules-structure)
- [Next.js transpilePackages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
- [webpack resolve.symlinks](https://webpack.js.org/configuration/resolve/#resolvesymlinks)

---

## 변경 이력

| 날짜       | 내용                    | 작성자           |
| ---------- | ----------------------- | ---------------- |
| 2026-01-28 | 최초 작성 (PR #49 사례) | Claude + Sooyeon |
