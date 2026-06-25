import { StyleSheet } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Filter chip — outlined when idle, accent-tinted when active. */
export function FilterChip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <PressableScale
      onPress={() => {
        void haptics.select();
        onPress();
      }}
      style={[
        styles.chip,
        {
          borderRadius: t.radius.pill,
          borderColor: active ? t.colors.accent : t.colors.border,
          backgroundColor: active ? `${t.colors.accent}1A` : 'transparent',
        },
      ]}
    >
      <Text variant="caption" color={active ? t.colors.accent : t.colors.textMuted}>
        {label}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: { borderWidth: 1, paddingHorizontal: 14, paddingVertical: 8 },
});
