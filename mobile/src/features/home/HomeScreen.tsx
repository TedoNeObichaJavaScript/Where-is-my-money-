import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountTiles } from './AccountTiles';
import { StatCard } from './StatCard';
import { useHomeData } from './useHomeData';
import { bumpData } from '@/data/reactive';
import {
  BalanceHero,
  EmptyState,
  GlassCard,
  SectionHeader,
  Text,
  TransactionRow,
} from '@/components/ui';
import { resolveName } from '@/i18n/labels';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function HomeScreen() {
  const t = useTheme();
  const { t: tr, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const d = useHomeData();
  const locale = i18n.language;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    bumpData();
    setTimeout(() => setRefreshing(false), 400);
  };

  const monthDelta = useMemo(() => {
    if (d.prevMonthSpent === 0) return undefined;
    const pct = Math.round(((d.monthSpent - d.prevMonthSpent) / d.prevMonthSpent) * 100);
    return { text: `${pct <= 0 ? '↓' : '↑'} ${Math.abs(pct)}% vs last`, good: pct <= 0 };
  }, [d.monthSpent, d.prevMonthSpent]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 16,
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={t.colors.accent} />
      }
    >
      {/* header */}
      <View style={styles.header}>
        <View>
          <Text variant="caption" color={t.colors.textMuted}>
            {greeting()}
          </Text>
          <Text variant="title" color={t.colors.text}>
            Where’s your money?
          </Text>
        </View>
      </View>

      {/* hero */}
      <GlassCard style={styles.hero}>
        <BalanceHero
          label={tr('home_balance')}
          valueMinor={d.total}
          currency={d.currency}
          locale={locale}
        />
      </GlassCard>

      {/* accounts */}
      {d.accounts.length > 0 && (
        <View style={styles.block}>
          <AccountTiles data={d.accounts} locale={locale} />
        </View>
      )}

      {/* stats */}
      <View style={styles.stats}>
        <StatCard
          label={tr('home_today')}
          amountMinor={d.todaySpent}
          currency={d.currency}
          locale={locale}
        />
        <StatCard
          label={tr('home_month')}
          amountMinor={d.monthSpent}
          currency={d.currency}
          locale={locale}
          delta={monthDelta}
        />
      </View>

      {/* recent */}
      <View style={styles.block}>
        <SectionHeader
          title={tr('home_recent')}
          actionLabel={d.recent.length ? tr('home_seeAll') : undefined}
          onAction={() => router.push('/(tabs)/history')}
        />
        {d.recent.length === 0 ? (
          <EmptyState emoji="🪐" title={tr('home_empty_title')} subtitle={tr('home_empty_sub')} />
        ) : (
          <GlassCard padded={false} style={{ borderRadius: 20 }}>
            <View style={styles.list}>
              {d.recent.map((txn, i) => (
                <Animated.View
                  key={txn.id}
                  entering={FadeInDown.delay(Math.min(i, 8) * 40).springify()}
                >
                  <TransactionRow
                    txn={txn}
                    title={resolveName(txn.categoryNameKey, txn.categoryName)}
                    subtitle={`${resolveName(txn.accountNameKey, txn.accountName)}${txn.note ? ` · ${txn.note}` : ''}`}
                    locale={locale}
                    onPress={() => router.push(`/add/edit/${txn.id}`)}
                  />
                </Animated.View>
              ))}
            </View>
          </GlassCard>
        )}
      </View>

      {/* tiny footer note to confirm money formatting wiring */}
      <Text variant="micro" color={t.colors.textFaint} style={styles.foot}>
        {Money.format(d.total, d.currency, locale)} across {d.accounts.length} accounts
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  hero: { borderRadius: 24, padding: 22, marginBottom: 16 },
  block: { marginTop: 8, marginBottom: 8 },
  stats: { flexDirection: 'row', gap: 12, marginVertical: 8 },
  list: { paddingHorizontal: 14, paddingVertical: 4 },
  foot: { textAlign: 'center', marginTop: 16 },
});
