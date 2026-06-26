import { ScrollView, StyleSheet, View } from 'react-native';
import type { AccountWithBalance } from './useHomeData';
import { GlassCard, Text } from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { accountIcon } from '@/components/icons/catalog';
import { Money } from '@/domain/Money';
import { resolveName } from '@/i18n/labels';
import { useTheme } from '@/theme/ThemeProvider';

/** Horizontally scrollable account balance tiles. */
export function AccountTiles({
  data,
  locale = 'en',
}: {
  data: AccountWithBalance[];
  locale?: string;
}) {
  const t = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {data.map(({ account, balance }) => (
        <GlassCard key={account.id} style={styles.tile} padded={false}>
          <View style={styles.inner}>
            <IconTile icon={accountIcon(account.nameKey)} color={account.colorHex} size={36} />
            <Text variant="caption" color={t.colors.textMuted}>
              {resolveName(account.nameKey, account.name)}
            </Text>
            <Text variant="heading" color={t.colors.text}>
              {Money.format(balance, account.currency, locale)}
            </Text>
          </View>
        </GlassCard>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingVertical: 2, paddingRight: 8 },
  tile: { borderRadius: 20, width: 150 },
  inner: { padding: 16, gap: 8 },
});
