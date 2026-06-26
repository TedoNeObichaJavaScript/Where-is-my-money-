import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { UpcomingRule } from './useHomeData';
import { GlassCard, PressableScale, Text } from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { categoryIcon } from '@/components/icons/catalog';
import { resolveName } from '@/i18n/labels';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

/** Horizontal strip of upcoming recurring rules; tap a card to open the manager. */
export function RecurringStrip({
  data,
  locale,
  onOpen,
}: {
  data: UpcomingRule[];
  locale: string;
  onOpen: () => void;
}) {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const dueLabel = (ms: number) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(ms));

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {data.map((r) => (
        <PressableScale key={r.id} onPress={onOpen}>
          <GlassCard style={styles.card}>
            <View style={styles.top}>
              <IconTile
                icon={categoryIcon(r.categoryNameKey, r.categoryKind)}
                color={r.categoryColor}
                size={32}
              />
              <Text variant="micro" color={t.colors.textMuted}>
                {tr('recurring_next')} {dueLabel(r.nextDueAt)}
              </Text>
            </View>
            <Text variant="caption" color={t.colors.textMuted} numberOfLines={1}>
              {resolveName(r.categoryNameKey, r.categoryName)}
            </Text>
            <Text
              variant="bodyMedium"
              color={r.type === 'INCOME' ? t.colors.income : t.colors.text}
            >
              {r.type === 'INCOME' ? '+' : '−'}
              {Money.format(r.amountMinor, r.currency, locale)}
            </Text>
          </GlassCard>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingVertical: 2, paddingRight: 4 },
  card: { width: 150, borderRadius: 18, gap: 8 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
