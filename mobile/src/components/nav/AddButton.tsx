import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * The center floating action — the one element allowed a full neon halo.
 * Tap → add expense; long-press → add income (quick-add shortcuts).
 */
export function AddButton() {
  const t = useTheme();

  const onPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/add/expense');
  };

  const onLongPress = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    router.push('/add/income');
  };

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      {/* layered glow halo */}
      <View
        style={[styles.halo, { backgroundColor: t.colors.accent, shadowColor: t.colors.accent }]}
      />
      <Pressable onPress={onPress} onLongPress={onLongPress} hitSlop={12}>
        <LinearGradient
          colors={[t.colors.accent, t.colors.accentBlue]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <Svg width={28} height={28} viewBox="0 0 24 24">
            <Path
              d="M12 5v14M5 12h14"
              stroke={t.colors.onAccent}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          </Svg>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const SIZE = 62;
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE },
  fab: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    opacity: 0.55,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 16,
  },
});
