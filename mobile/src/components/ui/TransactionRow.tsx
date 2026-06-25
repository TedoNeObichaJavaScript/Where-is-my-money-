import { StyleSheet, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { IconBadge } from './IconBadge';
import { Text } from './Text';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';
import type { TransactionView } from '@/data/TransactionRepository';

/** A single transaction line: category badge · title/sub · signed amount. */
export function TransactionRow({
  txn,
  title,
  subtitle,
  locale = 'en',
  onPress,
}: {
  txn: TransactionView;
  title: string;
  subtitle: string;
  locale?: string;
  onPress?: () => void;
}) {
  const t = useTheme();
  const income = txn.type === 'INCOME';
  const amount = Money.format(txn.amountMinor, txn.currency, locale);
  return (
    <PressableScale onPress={onPress} style={styles.row} scaleTo={0.98}>
      <IconBadge emoji={txn.categoryEmoji} color={txn.categoryColor} />
      <View style={styles.meta}>
        <Text variant="bodyMedium" color={t.colors.text} numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color={t.colors.textMuted} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text variant="bodyMedium" color={income ? t.colors.income : t.colors.text}>
        {income ? '+' : '−'}
        {amount.replace('-', '')}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  meta: { flex: 1 },
});
