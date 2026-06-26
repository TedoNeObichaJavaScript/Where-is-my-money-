import { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Two-option toggle with a sliding glass thumb (Expense / Income). */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const seg = w / options.length;

  const thumb = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(index * seg, t.motion.spring.snappy) }],
    width: seg,
  }));

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={[styles.track, { backgroundColor: t.colors.surface, borderRadius: t.radius.pill }]}
    >
      {w > 0 && (
        <Animated.View
          style={[
            styles.thumb,
            thumb,
            { backgroundColor: t.colors.accent, borderRadius: t.radius.pill },
          ]}
        />
      )}
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            style={styles.opt}
            onPress={() => {
              void haptics.select();
              onChange(o.value);
            }}
          >
            <Text variant="bodyMedium" color={active ? t.colors.onAccent : t.colors.textMuted}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', height: 44, padding: 0 },
  thumb: { position: 'absolute', top: 0, bottom: 0 },
  opt: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
