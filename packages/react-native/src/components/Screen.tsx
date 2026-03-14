import type { ReactNode } from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, spacing } from '../tokens.js';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  centered?: boolean;
  padded?: boolean;
  width?: 'full' | 'narrow';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll = true,
  centered = false,
  padded = true,
  width = 'full',
  style,
  contentStyle,
}: ScreenProps) {
  const content = (
    <View
      style={[
        styles.content,
        centered && styles.centered,
        padded && styles.padded,
        width === 'narrow' && styles.narrow,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={[styles.base, style]}>{content}</View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={[styles.base, style]}>
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.canvas,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
  },
  centered: {
    justifyContent: 'center',
  },
  padded: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  narrow: {
    alignSelf: 'center',
    maxWidth: 480,
  },
});
