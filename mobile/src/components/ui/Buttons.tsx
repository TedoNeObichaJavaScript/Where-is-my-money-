import { StyleSheet, View, type ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Low-emphasis bordered button (no glow). */
export function GhostButton({
  label,
  onPress,
  style,
}: {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}) {
  const t = useTheme();
  return (
    <PressableScale
      onPress={() => {
        void haptics.tap();
        onPress();
      }}
      style={[
        styles.ghost,
        { borderColor: t.colors.border, borderRadius: t.radius.pill },
        style as object,
      ]}
    >
      <Text variant="bodyMedium" color={t.colors.text}>
        {label}
      </Text>
    </PressableScale>
  );
}

/** Compact filled pill (secondary actions, chips-as-buttons). */
export function PillButton({
  label,
  onPress,
  active = false,
  style,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  style?: ViewStyle;
}) {
  const t = useTheme();
  return (
    <PressableScale
      onPress={() => {
        void haptics.select();
        onPress();
      }}
      style={[
        styles.pill,
        {
          backgroundColor: active ? t.colors.accent : t.colors.surface,
          borderRadius: t.radius.pill,
        },
        style as object,
      ]}
    >
      <View>
        <Text variant="caption" color={active ? t.colors.onAccent : t.colors.textMuted}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  ghost: {
    height: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pill: { paddingHorizontal: 16, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
});
