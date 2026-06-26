import { StyleSheet, View } from 'react-native';
import { AnimatedNumber } from './AnimatedNumber';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Label + animated balance number. Clean, no glow. */
export function BalanceHero({
  label,
  valueMinor,
  currency,
  locale,
  delta,
}: {
  label: string;
  valueMinor: number;
  currency: string;
  locale?: string;
  delta?: string;
}) {
  const t = useTheme();
  return (
    <View>
      <Text variant="micro" color={t.colors.textMuted} style={styles.label}>
        {label.toUpperCase()}
      </Text>
      <AnimatedNumber valueMinor={valueMinor} currency={currency} locale={locale} variant="hero" />
      {delta ? (
        <Text variant="caption" color={t.colors.accent} style={{ marginTop: 4 }}>
          {delta}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { letterSpacing: 2 },
});
