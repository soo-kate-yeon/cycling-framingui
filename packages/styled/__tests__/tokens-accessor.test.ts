/**
 * @framingui/styled - Token Accessor Tests (TAG-003)
 * Specification tests for Proxy-based token accessor
 * [SPEC-STYLED-001] [REQ-STY-010]
 */

import { describe, it, expect } from 'vitest';
import { tokens } from '../src/tokens.js';

// ============================================================================
// REQ-STY-010: Token Accessor Returns CSS Variable References
// ============================================================================

describe('Token Accessor [REQ-STY-010]', () => {
  it('should return CSS variable for simple token access', () => {
    const result = String(tokens.fg.primary);
    expect(result).toBe('var(--fg-primary)');
  });

  it('should return CSS variable for nested token access', () => {
    const result = String(tokens.bg.surface.default);
    expect(result).toBe('var(--bg-surface-default)');
  });

  it('should handle spacing token access with numeric keys', () => {
    const result = String(tokens.spacing[4]);
    expect(result).toBe('var(--spacing-4)');
  });

  it('should handle multiple levels of nesting', () => {
    const result = String(tokens.bg.primary.hover);
    expect(result).toBe('var(--bg-primary-hover)');
  });
});

// ============================================================================
// Proxy Behavior - Category Access
// ============================================================================

describe('Token Category Proxy', () => {
  it('should create proxy for background category', () => {
    expect(tokens.bg).toBeDefined();
    expect(typeof tokens.bg).toBe('object');
  });

  it('should create proxy for foreground category', () => {
    expect(tokens.fg).toBeDefined();
    expect(typeof tokens.fg).toBe('object');
  });

  it('should create proxy for spacing category', () => {
    expect(tokens.spacing).toBeDefined();
    expect(typeof tokens.spacing).toBe('object');
  });

  it('should create proxy for radius category', () => {
    expect(tokens.radius).toBeDefined();
    expect(typeof tokens.radius).toBe('object');
  });

  it('should create proxy for typography category', () => {
    expect(tokens.typography).toBeDefined();
    expect(typeof tokens.typography).toBe('object');
  });

  it('should create proxy for shadow category', () => {
    expect(tokens.shadow).toBeDefined();
    expect(typeof tokens.shadow).toBe('object');
  });
});

// ============================================================================
// Nested Access Patterns
// ============================================================================

describe('Nested Token Access', () => {
  it('should handle two-level nesting (category.key)', () => {
    expect(String(tokens.fg.primary)).toBe('var(--fg-primary)');
    expect(String(tokens.fg.secondary)).toBe('var(--fg-secondary)');
    expect(String(tokens.fg.muted)).toBe('var(--fg-muted)');
  });

  it('should handle three-level nesting (category.subcategory.key)', () => {
    expect(String(tokens.bg.surface.default)).toBe('var(--bg-surface-default)');
    expect(String(tokens.bg.surface.elevated)).toBe('var(--bg-surface-elevated)');
    expect(String(tokens.bg.primary.default)).toBe('var(--bg-primary-default)');
  });

  it('should handle four-level nesting if needed', () => {
    expect(String(tokens.bg.primary.hover)).toBe('var(--bg-primary-hover)');
  });
});

// ============================================================================
// String Coercion
// ============================================================================

describe('Token String Coercion', () => {
  it('should coerce to string with toString()', () => {
    const token = tokens.spacing[4];
    expect(token.toString()).toBe('var(--spacing-4)');
  });

  it('should coerce to string with String()', () => {
    const token = tokens.bg.surface.default;
    expect(String(token)).toBe('var(--bg-surface-default)');
  });

  it('should work in template literals', () => {
    const css = `background: ${tokens.bg.surface.default}; padding: ${tokens.spacing[4]};`;
    expect(css).toBe(
      'background: var(--bg-surface-default); padding: var(--spacing-4);'
    );
  });

  it('should work in string concatenation', () => {
    const css = 'color: ' + tokens.fg.primary;
    expect(css).toBe('color: var(--fg-primary)');
  });
});

// ============================================================================
// Typography Tokens
// ============================================================================

describe('Typography Token Access', () => {
  it('should access font family tokens', () => {
    expect(String(tokens.typography.fontFamily.sans)).toBe(
      'var(--typography-fontFamily-sans)'
    );
    expect(String(tokens.typography.fontFamily.mono)).toBe(
      'var(--typography-fontFamily-mono)'
    );
  });

  it('should access font size tokens', () => {
    expect(String(tokens.typography.fontSize.base)).toBe('var(--typography-fontSize-base)');
    expect(String(tokens.typography.fontSize.xl)).toBe('var(--typography-fontSize-xl)');
  });

  it('should access font weight tokens', () => {
    expect(String(tokens.typography.fontWeight.normal)).toBe(
      'var(--typography-fontWeight-normal)'
    );
    expect(String(tokens.typography.fontWeight.bold)).toBe(
      'var(--typography-fontWeight-bold)'
    );
  });

  it('should access line height tokens', () => {
    expect(String(tokens.typography.lineHeight.normal)).toBe(
      'var(--typography-lineHeight-normal)'
    );
  });
});

// ============================================================================
// Edge Cases
// ============================================================================

describe('Token Accessor Edge Cases', () => {
  it('should handle numeric spacing keys correctly', () => {
    expect(String(tokens.spacing[0])).toBe('var(--spacing-0)');
    expect(String(tokens.spacing[1])).toBe('var(--spacing-1)');
    expect(String(tokens.spacing[24])).toBe('var(--spacing-24)');
  });

  it('should handle string keys with special characters', () => {
    // Test with '2xl' which contains a number
    expect(String(tokens.typography.fontSize['2xl'])).toBe('var(--typography-fontSize-2xl)');
  });

  it('should create consistent output for same path', () => {
    const first = String(tokens.bg.surface.default);
    const second = String(tokens.bg.surface.default);
    expect(first).toBe(second);
  });
});

// ============================================================================
// Usage Patterns in styled-components
// ============================================================================

describe('Token Usage in styled-components', () => {
  it('should work in styled component templates', () => {
    const cssString = `
      background: ${tokens.bg.surface.default};
      color: ${tokens.fg.primary};
      padding: ${tokens.spacing[4]};
      border-radius: ${tokens.radius.md};
      box-shadow: ${tokens.shadow.md};
    `;

    expect(cssString).toContain('var(--bg-surface-default)');
    expect(cssString).toContain('var(--fg-primary)');
    expect(cssString).toContain('var(--spacing-4)');
    expect(cssString).toContain('var(--radius-md)');
    expect(cssString).toContain('var(--shadow-md)');
  });

  it('should work with all supported CSS properties', () => {
    const properties = {
      background: tokens.bg.surface.default,
      color: tokens.fg.primary,
      padding: tokens.spacing[4],
      margin: tokens.spacing[2],
      borderRadius: tokens.radius.md,
      boxShadow: tokens.shadow.lg,
      fontFamily: tokens.typography.fontFamily.sans,
      fontSize: tokens.typography.fontSize.base,
    };

    expect(String(properties.background)).toBe('var(--bg-surface-default)');
    expect(String(properties.color)).toBe('var(--fg-primary)');
    expect(String(properties.padding)).toBe('var(--spacing-4)');
    expect(String(properties.margin)).toBe('var(--spacing-2)');
    expect(String(properties.borderRadius)).toBe('var(--radius-md)');
    expect(String(properties.boxShadow)).toBe('var(--shadow-lg)');
    expect(String(properties.fontFamily)).toBe('var(--typography-fontFamily-sans)');
    expect(String(properties.fontSize)).toBe('var(--typography-fontSize-base)');
  });
});
