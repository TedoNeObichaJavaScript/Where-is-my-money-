import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { PressableScale } from './PressableScale';
import { IconTile } from '@/components/icons/IconTile';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Selectable row for account/category pickers inside a Sheet. */
export function PickerRow({
  icon,
  color,
  label,
  selected = false,
  onPress,
}: {
  icon: LucideIcon;
  color: string;
  label: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.row,
        {
          borderRadius: t.radius.base,
          backgroundColor: selected ? `${t.colors.accent}1A` : 'transparent',
        },
      ]}
    >
      <IconTile icon={icon} color={color} size={40} />
      <Text variant="bodyMedium" color={t.colors.text} style={styles.label}>
        {label}
      </Text>
      {selected ? <View style={[styles.dot, { backgroundColor: t.colors.accent }]} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10 },
  label: { flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
