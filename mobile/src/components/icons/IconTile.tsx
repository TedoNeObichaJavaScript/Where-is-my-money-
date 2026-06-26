import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

/** A category/account icon in a soft tinted rounded tile. Clean, no glow. */
export function IconTile({
  icon: Icon,
  color,
  size = 42,
}: {
  icon: LucideIcon;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: size * 0.28, backgroundColor: `${color}22` },
      ]}
    >
      <Icon size={size * 0.5} color={color} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center' },
});
