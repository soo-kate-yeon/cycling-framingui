/**
 * @framingui/ui - Tekton Token CSS Variable Mappings
 * SPEC-UI-001: shadcn-ui Fork & Token Integration
 *
 * [TAG-Q-001] 모든 요구사항 TAG 주석 포함
 * [TAG-Q-002] TypeScript strict mode 오류 없이 컴파일
 * [TAG-Q-004] TRUST 5 Framework 5개 Pillar 준수
 *
 * WHY: 토큰 시스템이 테마 일관성과 유지보수성을 보장
 * IMPACT: 토큰 정의 누락 시 UI 불일치 발생
 *
 * This file maps shadcn-ui semantic tokens to Tekton's global token system.
 * All values use `var(--*)` pattern for theme consistency.
 */

import type { TokenReference } from '@framingui/tokens';

/**
 * Tekton Token CSS Variables
 * Pattern: var(--{category}-{name})
 */
export const tokenVars = {
  // ========================================
  // Background Tokens
  // ========================================
  bg: {
    background: 'var(--bg-background)' as TokenReference,
    foreground: 'var(--bg-foreground)' as TokenReference,
    card: 'var(--bg-card)' as TokenReference,
    cardForeground: 'var(--bg-card-foreground)' as TokenReference,
    popover: 'var(--bg-popover)' as TokenReference,
    popoverForeground: 'var(--bg-popover-foreground)' as TokenReference,
    primary: 'var(--bg-primary)' as TokenReference,
    primaryForeground: 'var(--bg-primary-foreground)' as TokenReference,
    secondary: 'var(--bg-secondary)' as TokenReference,
    secondaryForeground: 'var(--bg-secondary-foreground)' as TokenReference,
    muted: 'var(--bg-muted)' as TokenReference,
    mutedForeground: 'var(--bg-muted-foreground)' as TokenReference,
    accent: 'var(--bg-accent)' as TokenReference,
    accentForeground: 'var(--bg-accent-foreground)' as TokenReference,
    destructive: 'var(--bg-destructive)' as TokenReference,
    destructiveForeground: 'var(--bg-destructive-foreground)' as TokenReference,
  },

  // ========================================
  // Border Tokens
  // ========================================
  border: {
    default: 'var(--border-default)' as TokenReference,
    input: 'var(--border-input)' as TokenReference,
    ring: 'var(--border-ring)' as TokenReference,
  },

  // ========================================
  // Radius Tokens
  // ========================================
  radius: {
    sm: 'var(--radius-sm)' as TokenReference,
    md: 'var(--radius-md)' as TokenReference,
    lg: 'var(--radius-lg)' as TokenReference,
    xl: 'var(--radius-xl)' as TokenReference,
    full: 'var(--radius-full)' as TokenReference,
    select: 'var(--radius-select)' as TokenReference,
  },

  // ========================================
  // Spacing Tokens (4px base)
  // ========================================
  spacing: {
    0: 'var(--spacing-0)' as TokenReference,
    1: 'var(--spacing-1)' as TokenReference,
    2: 'var(--spacing-2)' as TokenReference,
    3: 'var(--spacing-3)' as TokenReference,
    4: 'var(--spacing-4)' as TokenReference,
    5: 'var(--spacing-5)' as TokenReference,
    6: 'var(--spacing-6)' as TokenReference,
    8: 'var(--spacing-8)' as TokenReference,
    10: 'var(--spacing-10)' as TokenReference,
    12: 'var(--spacing-12)' as TokenReference,
    16: 'var(--spacing-16)' as TokenReference,
  },
} as const;

/**
 * Type-safe token accessor
 * Ensures all token references follow the TokenReference pattern
 */
export type TektonTokenVars = typeof tokenVars;

/**
 * Helper function to validate token references at runtime
 */
export function isTokenReference(value: string): value is TokenReference {
  return value.startsWith('var(--') && value.endsWith(')');
}

/**
 * Extract token name from TokenReference
 * Example: var(--bg-primary) → bg-primary
 */
export function extractTokenName(token: TokenReference): string {
  const match = token.match(/var\(--(.*)\)/);
  return match ? match[1] : '';
}
