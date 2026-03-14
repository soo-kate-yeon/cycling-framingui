import type { ReactNode } from 'react';
import { FlexAlignType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { spacing, type SpacingToken } from '../tokens.js';

export interface StackProps {
  children: ReactNode;
  gap?: SpacingToken;
  direction?: 'row' | 'column';
  align?: FlexAlignType;
  justify?: ViewStyle['justifyContent'];
  style?: StyleProp<ViewStyle>;
}

export function Stack({
  children,
  gap = 3,
  direction = 'column',
  align,
  justify,
  style,
}: StackProps) {
  return (
    <View
      style={[
        styles.base,
        {
          alignItems: align,
          flexDirection: direction,
          gap: spacing[gap],
          justifyContent: justify,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
  },
});
