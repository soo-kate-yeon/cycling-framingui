/**
 * @framingui/ui - Theme Loader
 * SPEC-UI-001: Theme JSON → CSS Variables Converter
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 테마 로더가 런타임 테마 전환을 보장
 * IMPACT: 테마 로더 오류 시 시각적 일관성 파괴
 *
 * Converts Tekton theme JSON files to CSS Variables for runtime theming.
 * Supports OKLCH color format and semantic token resolution.
 *
 * v0.5.0: ThemeDefinition v2.1 정렬 + 페이지 시맨틱 변수 추가
 */

/**
 * Theme Definition (aligned with @framingui/core ThemeV2 v2.1)
 */
export interface ThemeDefinition {
  id: string;
  name: string;
  schemaVersion: string;
  tokens: {
    atomic: {
      color: {
        brand?: Record<string, OKLCHColor>;
        neutral?: Record<string, OKLCHColor>;
        accent?: Record<string, OKLCHColor>;
        /** @deprecated v2.1에서는 neutral.white 사용. 하위 호환성을 위해 유지 */
        white?: OKLCHColor;
      };
      spacing: Record<string, string>;
      radius: Record<string, string>;
    };
    semantic: {
      background: {
        canvas: string;
        surface: {
          subtle: string;
          default: string;
          emphasis: string;
        };
        brand: {
          subtle: string;
          default: string;
          emphasis: string;
        };
      };
      border: {
        default: {
          subtle: string;
          default: string;
          emphasis: string;
        };
      };
      text?: {
        primary: string;
        secondary: string;
        muted: string;
      };
    };
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recipes?: Record<string, any>;
  stateLayer?: {
    hover?: { opacity: number };
    disabled?: { opacity: number; contentOpacity: number };
  };
  typography?: {
    fontFamily?: Record<string, string>;
    fontWeight?: Record<string, string>;
  };
}

/**
 * OKLCH Color Format
 */
export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0+)
  h: number; // Hue (0-360)
}

/**
 * Convert OKLCH color object to CSS oklch() string
 */
export function oklchToCSS(color: OKLCHColor): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

/**
 * Resolve semantic token reference to atomic color
 * Example: "atomic.color.brand.500" → { l: 0.55, c: 0.12, h: 265 }
 */
export function resolveSemanticToken(
  reference: string,
  theme: ThemeDefinition
): OKLCHColor | string {
  const parts = reference.split('.');

  if (parts[0] !== 'atomic') {
    return reference; // Not a token reference
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = theme.tokens;
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = current[part];
    } else {
      return reference; // Path not found
    }
  }

  return current;
}

/**
 * 테마에서 white 색상을 안전하게 가져오기
 * v2.1: neutral.white → v1: color.white → 폴백: 순백색
 */
function getWhiteColor(theme: ThemeDefinition): OKLCHColor {
  const { color } = theme.tokens.atomic;
  // v2.1: neutral.white
  if (color.neutral && 'white' in color.neutral) {
    return color.neutral.white as OKLCHColor;
  }
  // v1: color.white
  if (color.white) {
    return color.white;
  }
  // 폴백
  return { l: 1, c: 0, h: 0 };
}

/**
 * Convert theme JSON to CSS Variables string
 * 컴포넌트 변수 + 페이지 시맨틱 변수를 모두 생성
 */
export function themeToCSS(theme: ThemeDefinition): string {
  const { tokens } = theme;
  const white = getWhiteColor(theme);

  // Resolve semantic tokens
  const resolveColor = (ref: string): string => {
    const resolved = resolveSemanticToken(ref, theme);
    if (typeof resolved === 'object' && 'l' in resolved) {
      return oklchToCSS(resolved);
    }
    return String(resolved);
  };

  // 텍스트 색상 해상도 헬퍼
  const textPrimary = tokens.semantic.text
    ? resolveColor(tokens.semantic.text.primary)
    : tokens.atomic.color.neutral?.[900]
      ? oklchToCSS(tokens.atomic.color.neutral[900])
      : oklchToCSS({ l: 0.12, c: 0.01, h: 0 });
  const textSecondary = tokens.semantic.text
    ? resolveColor(tokens.semantic.text.secondary)
    : tokens.atomic.color.neutral?.[500]
      ? oklchToCSS(tokens.atomic.color.neutral[500])
      : oklchToCSS({ l: 0.58, c: 0.02, h: 0 });
  const textTertiary = tokens.semantic.text?.muted
    ? resolveColor(tokens.semantic.text.muted)
    : tokens.atomic.color.neutral?.[400]
      ? oklchToCSS(tokens.atomic.color.neutral[400])
      : oklchToCSS({ l: 0.72, c: 0.02, h: 0 });

  const css = `
:root, [data-theme="${theme.id}"] {
  /* ========================================
     Component Tokens (@framingui/ui 컴포넌트용)
     ======================================== */
  --bg-background: ${resolveColor(tokens.semantic.background.canvas)};
  --bg-foreground: ${textPrimary};

  --bg-card: ${resolveColor(tokens.semantic.background.surface.default)};
  --bg-card-foreground: ${textPrimary};

  --bg-popover: ${resolveColor(tokens.semantic.background.surface.default)};
  --bg-popover-foreground: ${textPrimary};

  --bg-primary: ${resolveColor(tokens.semantic.background.brand.default)};
  --bg-primary-foreground: ${oklchToCSS(white)};

  --bg-secondary: ${resolveColor(tokens.semantic.background.surface.emphasis)};
  --bg-secondary-foreground: ${textPrimary};

  --bg-muted: ${resolveColor(tokens.semantic.background.surface.subtle)};
  --bg-muted-foreground: ${textSecondary};

  --bg-accent: ${resolveColor(tokens.semantic.background.surface.emphasis)};
  --bg-accent-foreground: ${textPrimary};

  --bg-destructive: ${oklchToCSS({ l: 0.5, c: 0.2, h: 30 })}; /* Default red */
  --bg-destructive-foreground: ${oklchToCSS(white)};

  --bg-base: ${resolveColor(tokens.semantic.background.canvas)};
  --bg-success: ${resolveColor(tokens.semantic.background.brand.emphasis)};

  /* ========================================
     Border Tokens
     ======================================== */
  --border-default: ${resolveColor(tokens.semantic.border.default.default)};
  --border-input: ${resolveColor(tokens.semantic.border.default.subtle)};
  --border-ring: ${resolveColor(tokens.semantic.background.brand.default)};
  --border-border: ${resolveColor(tokens.semantic.border.default.default)};
  --border-primary: ${resolveColor(tokens.semantic.background.brand.default)};

  /* ========================================
     Page Semantic Tokens (페이지 템플릿 인라인 스타일용)
     ======================================== */
  --bg-canvas: ${resolveColor(tokens.semantic.background.canvas)};
  --bg-surface: ${resolveColor(tokens.semantic.background.surface.default)};
  --text-primary: ${textPrimary};
  --text-secondary: ${textSecondary};
  --text-tertiary: ${textTertiary};
  --text-foreground: ${textPrimary};
  --text-card-foreground: ${textPrimary};
  --text-popover-foreground: ${textPrimary};
  --text-muted-foreground: ${textSecondary};
  --text-link: ${resolveColor(tokens.semantic.background.brand.default)};
  --text-success: ${resolveColor(tokens.semantic.background.brand.emphasis)};
  --text-destructive: ${oklchToCSS({ l: 0.5, c: 0.2, h: 30 })};
  --action-primary: ${textPrimary};
  --action-primary-text: ${oklchToCSS(white)};
  --border-emphasis: ${resolveColor(tokens.semantic.border.default.emphasis)};

  /* ========================================
     Radius Tokens
     ======================================== */
  ${Object.entries(tokens.atomic.radius)
    .map(([key, val]) => `--radius-${key}: ${val};`)
    .join('\n  ')}

  /* ========================================
     Spacing Tokens
     ======================================== */
  ${Object.entries(tokens.atomic.spacing)
    .map(([key, val]) => `--spacing-${key}: ${val};`)
    .join('\n  ')}
}
`;

  return css.trim();
}

/**
 * Load theme from JSON and inject CSS Variables
 * Usage in Next.js app:
 *
 * ```tsx
 * import theme from '@/.moai/themes/generated/linear-minimal-v1.json';
 * import { injectThemeCSS } from '@framingui/ui/lib/theme-loader';
 *
 * // In layout or app component
 * useEffect(() => {
 *   injectThemeCSS(theme);
 * }, []);
 * ```
 */
export function injectThemeCSS(theme: ThemeDefinition): void {
  if (typeof document === 'undefined') {
    return; // SSR guard
  }

  const css = themeToCSS(theme);

  // Remove existing theme style if present
  const existingStyle = document.getElementById('tekton-theme');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Inject new theme CSS
  const style = document.createElement('style');
  style.id = 'tekton-theme';
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Get current theme ID from document
 */
export function getCurrentThemeId(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const root = document.documentElement;
  return root.getAttribute('data-theme');
}

/**
 * Set theme ID on document root
 */
export function setThemeId(themeId: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.setAttribute('data-theme', themeId);
}
