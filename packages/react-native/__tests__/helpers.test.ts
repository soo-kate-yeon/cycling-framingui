import {
  getShadowStyle,
  getTextStyle,
  insetX,
  insetY,
  spacing,
  stackGap,
  tokenContract,
  typography,
} from '../src/index.js';

describe('@framingui/react-native helpers', () => {
  it('exports token-backed typography helpers', () => {
    expect(getTextStyle('title')).toEqual(typography.title);
    expect(getTextStyle('button')).toEqual(typography.button);
  });

  it('exports shadow and spacing helpers for StyleSheet-friendly usage', () => {
    expect(getShadowStyle('card')).toMatchObject({
      shadowOpacity: 0.08,
      elevation: 2,
    });
    expect(insetX(4)).toEqual({ paddingHorizontal: spacing[4] });
    expect(insetY(6)).toEqual({ paddingVertical: spacing[6] });
    expect(stackGap(3)).toEqual({ gap: spacing[3] });
  });

  it('tracks FramingUI token contract paths alongside runtime values', () => {
    expect(tokenContract.bg.canvas).toBe('var(--bg-surface-default)');
    expect(tokenContract.fg.accent).toBe('var(--fg-link)');
    expect(tokenContract.radius.full).toBe('var(--radius-full)');
  });
});
