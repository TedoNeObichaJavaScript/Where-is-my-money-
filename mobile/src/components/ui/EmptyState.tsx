import { StyleSheet, Text as RNText, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Friendly empty state — big emoji "planet" + title + subtitle. */
export function EmptyState({
  emoji = '🪐',
  title,
  subtitle,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
}) {
  const t = useTheme();
  return (
    <View style={styles.root}>
      <RNText style={styles.emoji}>{emoji}</RNText>
      <Text variant="heading" color={t.colors.text} style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" color={t.colors.textMuted} style={styles.sub}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 6 },
  emoji: { fontSize: 64, marginBottom: 8 },
  title: { textAlign: 'center' },
  sub: { textAlign: 'center' },
});
