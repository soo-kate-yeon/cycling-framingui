import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { getTextStyle } from '../helpers.js';
import { colors, radius, spacing } from '../tokens.js';

export interface TextFieldProps extends TextInputProps {
  label?: string;
  message?: string;
  invalid?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function TextField({
  label,
  message,
  invalid = false,
  containerStyle,
  inputStyle,
  ...props
}: TextFieldProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.text.tertiary}
        style={[styles.input, invalid && styles.inputInvalid, inputStyle]}
        {...props}
      />
      {message ? (
        <Text style={[styles.message, invalid && styles.messageInvalid]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing[2],
    width: '100%',
  },
  label: {
    ...getTextStyle('label'),
    color: colors.text.primary,
  },
  input: {
    ...getTextStyle('body'),
    backgroundColor: colors.surface.muted,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text.primary,
    minHeight: 52,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  inputInvalid: {
    borderColor: colors.border.danger,
  },
  message: {
    ...getTextStyle('caption'),
    color: colors.text.secondary,
  },
  messageInvalid: {
    color: colors.text.danger,
  },
});
