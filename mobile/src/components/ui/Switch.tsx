import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

const W = 50;
const H = 30;
const KNOB = 24;

/** Glowing toggle. Track lights up accent when on; knob slides with a spring. */
export function Switch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const t = useTheme();

  const track = useAnimatedStyle(() => ({
    backgroundColor: withTiming(value ? t.colors.accent : t.colors.surface, { duration: 180 }),
  }));
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(value ? W - KNOB - 3 : 3, t.motion.spring.snappy) }],
  }));

  return (
    <Pressable
      onPress={() => {
        void haptics.select();
        onChange(!value);
      }}
    >
      <Animated.View style={[styles.track, track]}>
        <Animated.View style={[styles.knob, knob, value && { shadowColor: t.colors.accent }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: W, height: H, borderRadius: H / 2, justifyContent: 'center' },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
});
