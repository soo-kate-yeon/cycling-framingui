import type { TextStyle, ViewStyle } from 'react-native';

export const colors = {
  background: {
    canvas: '#FFFFFF',
    muted: '#FAFAFA',
    subtle: '#F5F5F7',
  },
  surface: {
    base: '#FFFFFF',
    muted: '#FAFAFA',
    danger: '#FFF0F0',
  },
  text: {
    primary: '#111111',
    secondary: '#666666',
    tertiary: '#8A8A8E',
    inverse: '#FFFFFF',
    accent: '#0A84FF',
    danger: '#D93025',
  },
  border: {
    subtle: '#ECECEF',
    default: '#E0E0E0',
    accent: '#0A84FF',
    danger: '#D93025',
  },
  action: {
    primary: '#0A84FF',
    primaryPressed: '#0069D9',
    primaryDisabled: '#A7CCFF',
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
} as const satisfies Record<string, Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight'>>;

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 2,
  },
  focus: {
    shadowColor: '#0A84FF',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },
} as const satisfies Record<
  string,
  Pick<ViewStyle, 'shadowColor' | 'shadowOpacity' | 'shadowRadius' | 'shadowOffset' | 'elevation'>
>;

export const tokens = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
} as const;

export type TypographyToken = keyof typeof typography;
export type ShadowToken = keyof typeof shadows;
export type SpacingToken = keyof typeof spacing;
