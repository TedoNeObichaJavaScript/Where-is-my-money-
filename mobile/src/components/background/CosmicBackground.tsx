import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NebulaOrbs } from './NebulaOrbs';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * The app's persistent void: indigo-black base + a barely-there aurora wash +
 * blurred nebula orbs. Sits behind every screen so glass surfaces have something
 * to refract. `pointerEvents="none"` — it never intercepts touches.
 */
export function CosmicBackground() {
  const t = useTheme();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: t.colors.bg }]} />
      <NebulaOrbs />
      <LinearGradient
        colors={[`${t.colors.bg}00`, `${t.colors.bg}CC`]}
        locations={[0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
