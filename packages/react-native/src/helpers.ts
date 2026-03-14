import type { TextStyle, ViewStyle } from 'react-native';
import {
  shadows,
  spacing,
  type ShadowToken,
  type SpacingToken,
  type TypographyToken,
  typography,
} from './tokens.js';

export function getTextStyle(token: TypographyToken): TextStyle {
  return typography[token];
}

export function getShadowStyle(token: ShadowToken): ViewStyle {
  return shadows[token];
}

export function insetX(token: SpacingToken): Pick<ViewStyle, 'paddingHorizontal'> {
  return { paddingHorizontal: spacing[token] };
}

export function insetY(token: SpacingToken): Pick<ViewStyle, 'paddingVertical'> {
  return { paddingVertical: spacing[token] };
}

export function stackGap(token: SpacingToken): Pick<ViewStyle, 'gap'> {
  return { gap: spacing[token] };
}
