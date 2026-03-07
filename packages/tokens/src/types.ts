/**
 * @framingui/tokens - Token Type Definitions
 * [SPEC-STYLED-001] [TAG-002]
 * TypeScript token type definitions for compile-time enforcement
 */

/**
 * Token reference type - represents a CSS variable reference
 * REQ-STY-004: Generate semantic CSS variable references
 */
export type TokenReference = `var(--${string})`;

/**
 * Background tokens
 * REQ-STY-001: Reject hardcoded color values
 */
export interface BgTokens {
  surface: {
    default: TokenReference;
    elevated: TokenReference;
    sunken: TokenReference;
  };
  primary: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  secondary: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  accent: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  destructive: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  ghost: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
  outline: {
    default: TokenReference;
    hover: TokenReference;
    active: TokenReference;
  };
}

/**
 * Text/Foreground tokens
 * REQ-STY-001: Reject hardcoded color values
 */
export interface FgTokens {
  primary: TokenReference;
  secondary: TokenReference;
  muted: TokenReference;
  inverse: TokenReference;
  link: TokenReference;
  error: TokenReference;
  success: TokenReference;
  warning: TokenReference;
  info: TokenReference;
}

/**
 * Spacing tokens (4px base unit)
 * REQ-STY-002: Reject hardcoded spacing values
 */
export interface SpacingTokens {
  [key: number]: TokenReference;
  0: TokenReference; // 0px
  1: TokenReference; // 4px
  2: TokenReference; // 8px
  3: TokenReference; // 12px
  4: TokenReference; // 16px
  5: TokenReference; // 20px
  6: TokenReference; // 24px
  8: TokenReference; // 32px
  10: TokenReference; // 40px
  12: TokenReference; // 48px
  16: TokenReference; // 64px
  20: TokenReference; // 80px
  24: TokenReference; // 96px
}

/**
 * Border radius tokens
 */
export interface RadiusTokens {
  none: TokenReference;
  sm: TokenReference;
  md: TokenReference;
  lg: TokenReference;
  xl: TokenReference;
  full: TokenReference;
}

/**
 * Typography tokens
 */
export interface TypographyTokens {
  fontFamily: {
    sans: TokenReference;
    mono: TokenReference;
  };
  fontSize: {
    xs: TokenReference;
    sm: TokenReference;
    base: TokenReference;
    lg: TokenReference;
    xl: TokenReference;
    '2xl': TokenReference;
    '3xl': TokenReference;
    '4xl': TokenReference;
  };
  fontWeight: {
    normal: TokenReference;
    medium: TokenReference;
    semibold: TokenReference;
    bold: TokenReference;
  };
  lineHeight: {
    tight: TokenReference;
    normal: TokenReference;
    relaxed: TokenReference;
  };
}

/**
 * Shadow tokens
 */
export interface ShadowTokens {
  none: TokenReference;
  sm: TokenReference;
  md: TokenReference;
  lg: TokenReference;
  xl: TokenReference;
}

/**
 * Motion tokens (imported from motion.ts)
 */
export interface MotionDurationTokens {
  instant: TokenReference;
  fast: TokenReference;
  moderate: TokenReference;
  slow: TokenReference;
  complex: TokenReference;
}

export interface MotionEasingTokens {
  linear: TokenReference;
  standard: TokenReference;
  emphasized: TokenReference;
  decelerate: TokenReference;
  accelerate: TokenReference;
}

export interface MotionTokens {
  duration: MotionDurationTokens;
  easing: MotionEasingTokens;
}

/**
 * Complete Tekton tokens interface
 * REQ-STY-003: Provide IDE autocomplete for available tokens
 * [SPEC-UI-001] [TAG-018] Motion tokens 추가
 */
export interface TektonTokens {
  bg: BgTokens;
  fg: FgTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  typography: TypographyTokens;
  shadow: ShadowTokens;
  motion: MotionTokens;
}
