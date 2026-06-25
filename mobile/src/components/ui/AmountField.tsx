import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Large read-only money display fed by the calculator keypad (Add screen).
 * Shows the working string + currency symbol; not a TextInput (keypad drives it).
 */
export function AmountField({
  display,
  currencySymbol,
  expense = true,
}: {
  display: string;
  currencySymbol: string;
  expense?: boolean;
}) {
  const t = useTheme();
  const tint = expense ? t.colors.expense : t.colors.income;
  return (
    <View style={styles.row}>
      <Text variant="title" color={t.colors.textMuted} style={styles.sign}>
        {expense ? '−' : '+'}
      </Text>
      <Text
        variant="hero"
        color={t.colors.text}
        style={[styles.amount, { textShadowColor: `${tint}66`, textShadowRadius: 16 }]}
      >
        {display}
      </Text>
      <Text variant="title" color={t.colors.textMuted} style={styles.cur}>
        {currencySymbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 6 },
  sign: { opacity: 0.7 },
  amount: { fontVariant: ['tabular-nums'], fontSize: 56 },
  cur: { opacity: 0.7 },
});
