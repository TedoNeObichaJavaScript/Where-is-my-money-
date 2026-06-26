import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Text input with a focus highlight. */
export function TextField({ label, style, ...rest }: TextInputProps & { label?: string }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View>
      {label ? (
        <Text variant="caption" color={t.colors.textMuted} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={t.colors.textFaint}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          styles.input,
          t.type.body,
          {
            color: t.colors.text,
            backgroundColor: t.colors.surface,
            borderColor: focused ? t.colors.accent : t.colors.border,
            borderRadius: t.radius.md,
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 6, marginLeft: 4 },
  input: { height: 50, borderWidth: 1, paddingHorizontal: 14 },
});
