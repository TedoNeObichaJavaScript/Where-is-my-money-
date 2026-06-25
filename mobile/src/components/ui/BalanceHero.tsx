import { StyleSheet, View } from 'react-native';
import { AnimatedNumber } from './AnimatedNumber';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** The one glowing number. Label + animated balance with a soft text halo. */
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
      <AnimatedNumber
        valueMinor={valueMinor}
        currency={currency}
        locale={locale}
        variant="hero"
        style={{ textShadowColor: 'rgba(94,141,255,0.55)', textShadowRadius: 18 }}
      />
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
