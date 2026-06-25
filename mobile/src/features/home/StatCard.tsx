import { StyleSheet } from 'react-native';
import { GlassCard, Text } from '@/components/ui';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

/** Compact metric card: label · amount · optional delta line. */
export function StatCard({
  label,
  amountMinor,
  currency,
  locale = 'en',
  delta,
}: {
  label: string;
  amountMinor: number;
  currency: string;
  locale?: string;
  delta?: { text: string; good: boolean };
}) {
  const t = useTheme();
  return (
    <GlassCard style={styles.card}>
      <Text variant="micro" color={t.colors.textMuted}>
        {label.toUpperCase()}
      </Text>
      <Text variant="title" color={t.colors.text} style={styles.value}>
        {Money.format(amountMinor, currency, locale)}
      </Text>
      {delta ? (
        <Text variant="caption" color={delta.good ? t.colors.income : t.colors.expense}>
          {delta.text}
        </Text>
      ) : null}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: 20 },
  value: { marginTop: 8, marginBottom: 2, fontSize: 22 },
});
