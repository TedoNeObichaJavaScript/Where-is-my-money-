import { StyleSheet, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Primary CTA — the only button allowed a glow. Gradient fill + halo. */
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
        t.shadow.glow(t.colors.accent, 18),
        { borderRadius: t.radius.pill, opacity: disabled ? 0.45 : 1 },
        style as object,
      ]}
    >
      <LinearGradient
        colors={[t.colors.accent, t.colors.accentBlue]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.btn}
      >
        <Text variant="bodyMedium" color={t.colors.onAccent}>
          {label}
        </Text>
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  btn: { height: 54, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
