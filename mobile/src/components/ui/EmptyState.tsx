import { StyleSheet, View } from 'react-native';
import { Inbox, type LucideIcon } from 'lucide-react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Clean empty state — a muted Lucide icon in a soft circle + title + subtitle. */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  subtitle,
}: {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
}) {
  const t = useTheme();
  return (
    <View style={styles.root}>
      <View style={[styles.circle, { backgroundColor: t.colors.surface }]}>
        <Icon size={30} color={t.colors.textMuted} strokeWidth={1.75} />
      </View>
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
  root: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: { textAlign: 'center' },
  sub: { textAlign: 'center' },
});
