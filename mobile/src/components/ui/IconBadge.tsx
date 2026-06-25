import { StyleSheet, Text, View } from 'react-native';

/** Emoji in a colored rounded tile with a soft halo of the same hue. */
export function IconBadge({
  emoji,
  color,
  size = 44,
}: {
  emoji: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: `${color}22`,
          shadowColor: color,
        },
      ]}
    >
      <Text style={{ fontSize: size * 0.46 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
});
