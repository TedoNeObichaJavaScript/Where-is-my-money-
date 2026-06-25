import { type GestureResponderEvent, Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Pressable that springs down on touch — the base interaction for the whole kit. */
export function PressableScale({
  style,
  onPressIn,
  onPressOut,
  scaleTo = 0.96,
  ...rest
}: PressableProps & { scaleTo?: number }) {
  const t = useTheme();
  const s = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <AnimatedPressable
      {...rest}
      style={[animStyle, style as object]}
      onPressIn={(e: GestureResponderEvent) => {
        s.value = withSpring(scaleTo, t.motion.spring.snappy);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        s.value = withSpring(1, t.motion.spring.snappy);
        onPressOut?.(e);
      }}
    />
  );
}
