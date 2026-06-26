import { StyleSheet, type ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Primary CTA — solid accent fill, clean. (No gradient or glow in refined-dark.) */
export function NeonButton({
  label,
  onPress,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const t = useTheme();
  return (
    <PressableScale
      disabled={disabled}
      onPress={() => {
        void haptics.medium();
        onPress();
      }}
      style={[
        styles.btn,
        {
          backgroundColor: t.colors.accent,
          borderRadius: t.radius.base,
          opacity: disabled ? 0.4 : 1,
        },
        style as object,
      ]}
    >
      <Text variant="bodyMedium" color={t.colors.onAccent}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, alignItems: 'center', justifyContent: 'center' },
});
