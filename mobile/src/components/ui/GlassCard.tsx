import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Clean surface card: solid fill + hairline border. (Refined-dark redesign — the old
 * blur/glass is gone; kept the name so call sites are unchanged.)
 */
export function GlassCard({
  children,
  raised = false,
  padded = true,
  style,
  ...rest
}: ViewProps & { children: ReactNode; raised?: boolean; padded?: boolean }) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.colors.surface,
          borderColor: raised ? t.colors.borderStrong : t.colors.border,
          borderRadius: raised ? t.radius.lg : t.radius.base,
        },
        padded && (styles.pad as ViewStyle),
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, overflow: 'hidden' },
  pad: { padding: 16 },
});
