import { Pressable, StyleSheet, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Center action — clean rounded-square accent button. Tap → add expense;
 * long-press → add income. No glow halo.
 */
export function AddButton() {
  const t = useTheme();

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/add/expense');
        }}
        onLongPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          router.push('/add/income');
        }}
        hitSlop={10}
        style={[styles.fab, { backgroundColor: t.colors.accent }]}
      >
        <Plus size={26} color={t.colors.onAccent} strokeWidth={2.4} />
      </Pressable>
    </View>
  );
}

const SIZE = 52;
const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: SIZE, height: SIZE },
  fab: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
