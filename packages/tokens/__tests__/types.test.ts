/**
 * @framingui/tokens - Token Type Definitions Tests (TAG-002)
 * Specification tests that define expected token type behavior
 * [SPEC-STYLED-001] [REQ-STY-001, REQ-STY-002, REQ-STY-003, REQ-STY-004]
 */

import { describe, it, expect, expectTypeOf } from 'vitest';
import type {
  TokenReference,
  BgTokens,
  FgTokens,
  SpacingTokens,
  RadiusTokens,
  TypographyTokens,
  ShadowTokens,
  TektonTokens,
} from '../src/types.js';

// ============================================================================
// REQ-STY-004: Token Reference Type - CSS Variable Format
// ============================================================================

describe('TokenReference Type [REQ-STY-004]', () => {
  it('should accept valid CSS variable references', () => {
    const validToken: TokenReference = 'var(--bg-surface-default)';
    expect(validToken).toBe('var(--bg-surface-default)');
  });

  it('should enforce CSS variable format at compile time', () => {
    // Type tests - these should compile successfully
    expectTypeOf<TokenReference>().toMatchTypeOf<`var(--${string})`>();

    // Valid examples
    const token1: TokenReference = 'var(--spacing-4)';
    const token2: TokenReference = 'var(--bg-primary-default)';
    const token3: TokenReference = 'var(--radius-md)';

    expect(token1).toBeDefined();
    expect(token2).toBeDefined();
    expect(token3).toBeDefined();
  });

  it('should be compatible with CSS variable usage', () => {
    const token: TokenReference = 'var(--fg-primary)';
    const cssProperty = `color: ${token}`;
    expect(cssProperty).toBe('color: var(--fg-primary)');
  });
});

// ============================================================================
// REQ-STY-003: Background Tokens - IDE Autocomplete Support
// ============================================================================

describe('BgTokens Interface [REQ-STY-003]', () => {
  it('should define surface background tokens', () => {
    expectTypeOf<BgTokens>().toHaveProperty('surface');
    expectTypeOf<BgTokens['surface']>().toHaveProperty('default');
    expectTypeOf<BgTokens['surface']>().toHaveProperty('elevated');
    expectTypeOf<BgTokens['surface']>().toHaveProperty('sunken');
  });

  it('should define primary background tokens with states', () => {
    expectTypeOf<BgTokens>().toHaveProperty('primary');
    expectTypeOf<BgTokens['primary']>().toHaveProperty('default');
    expectTypeOf<BgTokens['primary']>().toHaveProperty('hover');
    expectTypeOf<BgTokens['primary']>().toHaveProperty('active');
  });

  it('should define secondary background tokens', () => {
    expectTypeOf<BgTokens>().toHaveProperty('secondary');
    expectTypeOf<BgTokens['secondary']>().toHaveProperty('default');
    expectTypeOf<BgTokens['secondary']>().toHaveProperty('hover');
    expectTypeOf<BgTokens['secondary']>().toHaveProperty('active');
  });

  it('should use TokenReference for all values', () => {
    expectTypeOf<BgTokens['surface']['default']>().toMatchTypeOf<TokenReference>();
    expectTypeOf<BgTokens['primary']['hover']>().toMatchTypeOf<TokenReference>();
  });
});

// ============================================================================
// Foreground Tokens - Text Colors
// ============================================================================

describe('FgTokens Interface [REQ-STY-003]', () => {
  it('should define semantic foreground tokens', () => {
    expectTypeOf<FgTokens>().toHaveProperty('primary');
    expectTypeOf<FgTokens>().toHaveProperty('secondary');
    expectTypeOf<FgTokens>().toHaveProperty('muted');
    expectTypeOf<FgTokens>().toHaveProperty('inverse');
    expectTypeOf<FgTokens>().toHaveProperty('link');
  });

  it('should define state foreground tokens', () => {
    expectTypeOf<FgTokens>().toHaveProperty('error');
    expectTypeOf<FgTokens>().toHaveProperty('success');
    expectTypeOf<FgTokens>().toHaveProperty('warning');
  });

  it('should use TokenReference for all values', () => {
    expectTypeOf<FgTokens['primary']>().toMatchTypeOf<TokenReference>();
    expectTypeOf<FgTokens['error']>().toMatchTypeOf<TokenReference>();
  });
});

// ============================================================================
// REQ-STY-002: Spacing Tokens - Reject Hardcoded Spacing
// ============================================================================

describe('SpacingTokens Interface [REQ-STY-002, REQ-STY-003]', () => {
  it('should define spacing scale from 0 to 24', () => {
    expectTypeOf<SpacingTokens>().toHaveProperty(0);
    expectTypeOf<SpacingTokens>().toHaveProperty(1);
    expectTypeOf<SpacingTokens>().toHaveProperty(2);
    expectTypeOf<SpacingTokens>().toHaveProperty(4);
    expectTypeOf<SpacingTokens>().toHaveProperty(8);
    expectTypeOf<SpacingTokens>().toHaveProperty(12);
    expectTypeOf<SpacingTokens>().toHaveProperty(16);
    expectTypeOf<SpacingTokens>().toHaveProperty(20);
    expectTypeOf<SpacingTokens>().toHaveProperty(24);
  });

  it('should use TokenReference for spacing values', () => {
    expectTypeOf<SpacingTokens[0]>().toMatchTypeOf<TokenReference>();
    expectTypeOf<SpacingTokens[4]>().toMatchTypeOf<TokenReference>();
    expectTypeOf<SpacingTokens[16]>().toMatchTypeOf<TokenReference>();
  });

  it('should support array-style access for spacing', () => {
    // This tests IDE autocomplete for spacing[4] syntax
    expectTypeOf<SpacingTokens>().toMatchTypeOf<{ [key: number]: TokenReference }>();
  });
});

// ============================================================================
// Border Radius Tokens
// ============================================================================

describe('RadiusTokens Interface [REQ-STY-003]', () => {
  it('should define radius scale', () => {
    expectTypeOf<RadiusTokens>().toHaveProperty('none');
    expectTypeOf<RadiusTokens>().toHaveProperty('sm');
    expectTypeOf<RadiusTokens>().toHaveProperty('md');
    expectTypeOf<RadiusTokens>().toHaveProperty('lg');
    expectTypeOf<RadiusTokens>().toHaveProperty('xl');
    expectTypeOf<RadiusTokens>().toHaveProperty('full');
  });

  it('should use TokenReference for radius values', () => {
    expectTypeOf<RadiusTokens['md']>().toMatchTypeOf<TokenReference>();
    expectTypeOf<RadiusTokens['full']>().toMatchTypeOf<TokenReference>();
  });
});

// ============================================================================
// Typography Tokens
// ============================================================================

describe('TypographyTokens Interface [REQ-STY-003]', () => {
  it('should define font family tokens', () => {
    expectTypeOf<TypographyTokens>().toHaveProperty('fontFamily');
    expectTypeOf<TypographyTokens['fontFamily']>().toHaveProperty('sans');
    expectTypeOf<TypographyTokens['fontFamily']>().toHaveProperty('mono');
  });

  it('should define font size tokens', () => {
    expectTypeOf<TypographyTokens>().toHaveProperty('fontSize');
    expectTypeOf<TypographyTokens['fontSize']>().toHaveProperty('xs');
    expectTypeOf<TypographyTokens['fontSize']>().toHaveProperty('base');
    expectTypeOf<TypographyTokens['fontSize']>().toHaveProperty('xl');
    expectTypeOf<TypographyTokens['fontSize']>().toHaveProperty('2xl');
  });

  it('should define font weight tokens', () => {
    expectTypeOf<TypographyTokens>().toHaveProperty('fontWeight');
    expectTypeOf<TypographyTokens['fontWeight']>().toHaveProperty('normal');
    expectTypeOf<TypographyTokens['fontWeight']>().toHaveProperty('bold');
  });

  it('should define line height tokens', () => {
    expectTypeOf<TypographyTokens>().toHaveProperty('lineHeight');
    expectTypeOf<TypographyTokens['lineHeight']>().toHaveProperty('tight');
    expectTypeOf<TypographyTokens['lineHeight']>().toHaveProperty('normal');
  });
});

// ============================================================================
// Shadow Tokens
// ============================================================================

describe('ShadowTokens Interface [REQ-STY-003]', () => {
  it('should define shadow scale', () => {
    expectTypeOf<ShadowTokens>().toHaveProperty('none');
    expectTypeOf<ShadowTokens>().toHaveProperty('sm');
    expectTypeOf<ShadowTokens>().toHaveProperty('md');
    expectTypeOf<ShadowTokens>().toHaveProperty('lg');
    expectTypeOf<ShadowTokens>().toHaveProperty('xl');
  });

  it('should use TokenReference for shadow values', () => {
    expectTypeOf<ShadowTokens['md']>().toMatchTypeOf<TokenReference>();
  });
});

// ============================================================================
// REQ-STY-003: Complete Tekton Tokens Interface
// ============================================================================

describe('TektonTokens Interface [REQ-STY-003]', () => {
  it('should combine all token categories', () => {
    expectTypeOf<TektonTokens>().toHaveProperty('bg');
    expectTypeOf<TektonTokens>().toHaveProperty('fg');
    expectTypeOf<TektonTokens>().toHaveProperty('spacing');
    expectTypeOf<TektonTokens>().toHaveProperty('radius');
    expectTypeOf<TektonTokens>().toHaveProperty('typography');
    expectTypeOf<TektonTokens>().toHaveProperty('shadow');
  });

  it('should match token category types', () => {
    expectTypeOf<TektonTokens['bg']>().toMatchTypeOf<BgTokens>();
    expectTypeOf<TektonTokens['fg']>().toMatchTypeOf<FgTokens>();
    expectTypeOf<TektonTokens['spacing']>().toMatchTypeOf<SpacingTokens>();
    expectTypeOf<TektonTokens['radius']>().toMatchTypeOf<RadiusTokens>();
    expectTypeOf<TektonTokens['typography']>().toMatchTypeOf<TypographyTokens>();
    expectTypeOf<TektonTokens['shadow']>().toMatchTypeOf<ShadowTokens>();
  });
});
