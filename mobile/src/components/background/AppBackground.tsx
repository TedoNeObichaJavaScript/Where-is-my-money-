import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Flat app background. Refined-dark redesign: no nebula orbs, no gradient — just a
 * clean canvas so content and cards carry the design. `pointerEvents="none"`.
 */
export function AppBackground() {
  const t = useTheme();
  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.bg }]}
      pointerEvents="none"
    />
  );
}
