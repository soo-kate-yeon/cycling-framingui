import { StyleSheet, Text, View } from 'react-native';
import { getTextStyle } from '../helpers.js';
import { colors, radius, spacing } from '../tokens.js';

export type InlineMessageTone = 'error' | 'info' | 'success';

export interface InlineMessageProps {
  message: string;
  tone?: InlineMessageTone;
}

export function InlineMessage({ message, tone = 'info' }: InlineMessageProps) {
  return (
    <View style={[styles.base, tone === 'error' && styles.error]}>
      <Text style={[styles.text, tone === 'error' && styles.errorText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.background.subtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
  },
  error: {
    backgroundColor: colors.surface.danger,
    borderColor: colors.border.danger,
    borderWidth: 1,
  },
  text: {
    ...getTextStyle('caption'),
    color: colors.text.primary,
  },
  errorText: {
    color: colors.text.danger,
  },
});
