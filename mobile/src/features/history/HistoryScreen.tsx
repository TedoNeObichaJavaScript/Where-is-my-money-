import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHistory, type DaySection } from './useHistory';
import {
  EmptyState,
  FilterChip,
  GlassCard,
  Snackbar,
  SwipeableRow,
  TextField,
  Text,
  TransactionRow,
} from '@/components/ui';
import { resolveName } from '@/i18n/labels';
import { Money } from '@/domain/Money';
import type { TxnType } from '@/domain/enums';
import { useTheme } from '@/theme/ThemeProvider';

type Filter = 'ALL' | TxnType;

export function HistoryScreen() {
  const t = useTheme();
  const { t: tr, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = i18n.language;
  const h = useHistory(locale);
  const [filter, setFilter] = useState<Filter>('ALL');

  const sections = useMemo<DaySection[]>(() => {
    if (filter === 'ALL') return h.sections;
    return h.sections
      .map((s) => ({ ...s, data: s.data.filter((tx) => tx.type === filter) }))
      .filter((s) => s.data.length > 0);
  }, [h.sections, filter]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text variant="title" color={t.colors.text} style={styles.h}>
        {tr('history_title')}
      </Text>

      <TextField
        placeholder={tr('history_search')}
        value={h.searchInput}
        onChangeText={h.setSearchInput}
        style={styles.search}
      />

      <View style={styles.chips}>
        {(['ALL', 'EXPENSE', 'INCOME'] as Filter[]).map((f) => (
          <FilterChip
            key={f}
            label={f === 'ALL' ? tr('history_all') : f === 'EXPENSE' ? tr('add_expense') : tr('add_income')}
            active={filter === f}
            onPress={() => setFilter(f)}
          />
        ))}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => void h.loadMore()}
        ListEmptyComponent={
          <EmptyState
            emoji={h.search ? '🔭' : '🪐'}
            title={h.search ? tr('history_noMatches') : tr('history_empty')}
          />
        }
        renderSectionHeader={({ section }) => (
          <View style={[styles.secHead, { backgroundColor: t.colors.bg }]}>
            <Text variant="caption" color={t.colors.textMuted}>
              {section.title}
            </Text>
            <Text variant="caption" color={t.colors.textFaint}>
              −{Money.format(section.expenseMinor, section.currency, locale).replace('-', '')}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <SwipeableRow onDelete={() => void h.deleteWithUndo(item)}>
            <GlassCard padded={false} style={styles.rowCard}>
              <View style={styles.rowInner}>
                <TransactionRow
                  txn={item}
                  title={resolveName(item.categoryNameKey, item.categoryName)}
                  subtitle={`${resolveName(item.accountNameKey, item.accountName)}${item.note ? ` · ${item.note}` : ''}`}
                  locale={locale}
                  onPress={() => router.push(`/add/edit/${item.id}`)}
                />
              </View>
            </GlassCard>
          </SwipeableRow>
        )}
      />

      {h.pendingUndo && (
        <Snackbar message="Transaction deleted" actionLabel="Undo" onAction={() => void h.undo()} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16 },
  h: { marginBottom: 14 },
  search: { marginBottom: 12 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  secHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  rowCard: { borderRadius: 16, marginVertical: 4 },
  rowInner: { paddingHorizontal: 14, paddingVertical: 2 },
});
