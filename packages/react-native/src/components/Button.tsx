import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { getTextStyle } from '../helpers.js';
import { colors, radius, spacing } from '../tokens.js';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        pressed && !isDisabled && (isSecondary ? styles.secondaryPressed : styles.primaryPressed),
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isSecondary ? colors.text.primary : colors.text.inverse} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.secondaryText]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  primary: {
    backgroundColor: colors.action.primary,
  },
  secondary: {
    backgroundColor: colors.surface.muted,
    borderColor: colors.border.default,
    borderWidth: 1,
  },
  primaryPressed: {
    backgroundColor: colors.action.primaryPressed,
  },
  secondaryPressed: {
    backgroundColor: colors.background.subtle,
  },
  disabled: {
    backgroundColor: colors.action.primaryDisabled,
    borderColor: colors.action.primaryDisabled,
  },
  text: {
    ...getTextStyle('button'),
    color: colors.text.inverse,
  },
  secondaryText: {
    color: colors.text.primary,
  },
});
