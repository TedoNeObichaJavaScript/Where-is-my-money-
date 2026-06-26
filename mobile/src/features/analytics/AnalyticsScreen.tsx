import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { ChartPie } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAnalytics } from './useAnalytics';
import { EmptyState, GlassCard, SectionHeader, Text } from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { categoryIcon } from '@/components/icons/catalog';
import { DonutChart, type DonutSlice } from '@/components/charts/DonutChart';
import { BarChart } from '@/components/charts/BarChart';
import { SankeyFlow, type FlowNode } from '@/components/charts/SankeyFlow';
import { CalendarHeatmap } from '@/components/charts/CalendarHeatmap';
import { resolveName } from '@/i18n/labels';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

/** Animated card wrapper — staggered fade-up entrance for each chart block. */
function ChartCard({
  index,
  children,
  style,
}: {
  index: number;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .springify()
        .damping(18)}
      style={style}
    >
      <GlassCard style={styles.card}>{children}</GlassCard>
    </Animated.View>
  );
}

function Arrow({
  dir,
  color,
  onPress,
  disabled,
}: {
  dir: 'l' | 'r';
  color: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      style={{ opacity: disabled ? 0.3 : 1 }}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
          d={dir === 'l' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </Pressable>
  );
}

export function AnalyticsScreen() {
  const t = useTheme();
  const { t: tr, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const locale = i18n.language;
  const a = useAnalytics(locale);

  const slices: DonutSlice[] = a.byCategory.slice(0, 8).map((c) => ({
    id: c.categoryId,
    value: c.total,
    color: c.colorHex,
    label: resolveName(c.nameKey, c.name),
  }));

  const hasData = a.totals.expense > 0 || a.totals.income > 0;

  const outflows: FlowNode[] = a.byCategory.slice(0, 6).map((c) => ({
    label: resolveName(c.nameKey, c.name),
    color: c.colorHex,
    value: c.total,
  }));
  const firstWeekday = new Date(a.monthStart).getDay();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingHorizontal: 16,
        paddingBottom: 140,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* month selector */}
      <View style={styles.monthRow}>
        <Arrow dir="l" color={t.colors.textMuted} onPress={a.prev} />
        <Text variant="title" color={t.colors.text}>
          {a.monthLabel}
        </Text>
        <Arrow dir="r" color={t.colors.textMuted} onPress={a.next} disabled={!a.canNext} />
      </View>

      {!hasData ? (
        <EmptyState icon={ChartPie} title={tr('analytics_noData')} />
      ) : (
        <>
          {/* summary */}
          <View style={styles.summary}>
            <GlassCard style={styles.sumCard}>
              <Text variant="micro" color={t.colors.textMuted}>
                {tr('analytics_income').toUpperCase()}
              </Text>
              <Text variant="heading" color={t.colors.income}>
                {Money.format(a.totals.income, a.currency, locale)}
              </Text>
            </GlassCard>
            <GlassCard style={styles.sumCard}>
              <Text variant="micro" color={t.colors.textMuted}>
                {tr('analytics_expense').toUpperCase()}
              </Text>
              <Text variant="heading" color={t.colors.expense}>
                {Money.format(a.totals.expense, a.currency, locale)}
              </Text>
              {a.trendPct != null ? (
                <Text
                  variant="caption"
                  color={a.trendPct <= 0 ? t.colors.income : t.colors.expense}
                >
                  {a.trendPct <= 0 ? '↓' : '↑'} {Math.abs(a.trendPct)}% vs last month
                </Text>
              ) : null}
            </GlassCard>
          </View>

          {/* donut */}
          <ChartCard index={0}>
            <View style={{ alignItems: 'center' }}>
              <DonutChart
                slices={slices}
                totalMinor={a.totals.expense}
                currency={a.currency}
                locale={locale}
              />
            </View>
          </ChartCard>

          {/* cash-flow (Sankey) — the differentiator */}
          {a.totals.income > 0 && outflows.length > 0 ? (
            <ChartCard index={1}>
              <Text variant="caption" color={t.colors.textMuted} style={{ marginBottom: 12 }}>
                {tr('analytics_cashflow').toUpperCase()}
              </Text>
              <SankeyFlow
                incomeLabel={tr('analytics_income')}
                savedLabel={tr('analytics_saved')}
                income={a.totals.income}
                outflows={outflows}
                currency={a.currency}
                locale={locale}
              />
            </ChartCard>
          ) : null}

          {/* spending calendar heatmap */}
          <ChartCard index={2}>
            <Text variant="caption" color={t.colors.textMuted} style={{ marginBottom: 12 }}>
              {tr('analytics_heatmap').toUpperCase()}
            </Text>
            <CalendarHeatmap values={a.daily} firstWeekday={firstWeekday} color={t.colors.accent} />
          </ChartCard>

          {/* daily bars */}
          <GlassCard style={styles.card}>
            <Text variant="caption" color={t.colors.textMuted} style={{ marginBottom: 12 }}>
              {tr('analytics_daily').toUpperCase()}
            </Text>
            <BarChart values={a.daily} />
          </GlassCard>

          {/* top categories */}
          <View style={styles.card}>
            <SectionHeader title={tr('analytics_top')} />
            <GlassCard padded={false} style={{ borderRadius: 20 }}>
              <View style={{ padding: 14, gap: 14 }}>
                {a.byCategory.slice(0, 5).map((c) => {
                  const pct = a.totals.expense ? c.total / a.totals.expense : 0;
                  return (
                    <Pressable
                      key={c.categoryId}
                      onPress={() => router.push('/(tabs)/history')}
                      style={styles.catRow}
                    >
                      <IconTile
                        icon={categoryIcon(c.nameKey, 'EXPENSE')}
                        color={c.colorHex}
                        size={36}
                      />
                      <View style={{ flex: 1, gap: 6 }}>
                        <View style={styles.catTop}>
                          <Text variant="bodyMedium" color={t.colors.text}>
                            {resolveName(c.nameKey, c.name)}
                          </Text>
                          <Text variant="caption" color={t.colors.textMuted}>
                            {Money.format(c.total, a.currency, locale)}
                          </Text>
                        </View>
                        <View style={[styles.track, { backgroundColor: t.colors.surface }]}>
                          <View
                            style={{
                              width: `${Math.round(pct * 100)}%`,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: c.colorHex,
                            }}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </GlassCard>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summary: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  sumCard: { flex: 1, borderRadius: 20 },
  card: { borderRadius: 24, marginVertical: 8 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catTop: { flexDirection: 'row', justifyContent: 'space-between' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
});
