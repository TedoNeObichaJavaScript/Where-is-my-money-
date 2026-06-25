import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';

/** Temporary themed placeholder for routes not yet built (Phases 6–10). */
export function ScreenPlaceholder({ title }: { title: string }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <Text style={[t.type.title, { color: t.colors.text }]}>{title}</Text>
      <Text style={[t.type.caption, { color: t.colors.textMuted, marginTop: 8 }]}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
});
