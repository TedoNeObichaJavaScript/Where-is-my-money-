import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Frosted glass surface: depth shadow on the outer view, blur+fill+border clipped
 * to the radius on the inner. Reads only over the cosmic background.
 */
export function GlassCard({
  children,
  raised = false,
  padded = true,
  style,
  ...rest
}: ViewProps & { children: ReactNode; raised?: boolean; padded?: boolean }) {
  const t = useTheme();
  const g = raised ? t.glassRaised : t.glass;

  return (
    <View style={[t.shadow.depth, style]} {...rest}>
      <View
        style={[
          styles.clip,
          { borderRadius: g.radius, borderWidth: g.borderWidth, borderColor: g.border },
        ]}
      >
        <BlurView intensity={g.blurIntensity} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: g.fill }]} />
        <View style={padded ? (styles.pad as ViewStyle) : undefined}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  pad: { padding: 16 },
});
