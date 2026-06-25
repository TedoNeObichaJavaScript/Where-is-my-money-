import { useEffect } from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

/** Pulsing placeholder block shown while data loads. */
export function Skeleton({
  width = '100%',
  height = 16,
  radius,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
}) {
  const t = useTheme();
  const o = useSharedValue(0.4);
  useEffect(() => {
    o.value = withRepeat(withTiming(0.85, { duration: 800 }), -1, true);
  }, [o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View
      style={[
        anim,
        styles.block,
        { width, height, borderRadius: radius ?? t.radius.sm, backgroundColor: t.colors.surface },
      ]}
    />
  );
}

const styles = StyleSheet.create({ block: {} });
