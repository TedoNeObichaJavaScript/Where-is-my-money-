import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Repeat, Trash2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRecurring, type NewRuleInput, type RuleView } from './useRecurring';
import { CategoryGrid } from '@/features/add/CategoryGrid';
import {
  DatePickerField,
  EmptyState,
  GlassCard,
  NeonButton,
  PickerRow,
  SegmentedControl,
  Switch,
  Text,
  TextField,
} from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { accountIcon, categoryIcon } from '@/components/icons/catalog';
import { resolveName } from '@/i18n/labels';
import { Money } from '@/domain/Money';
import { addDays, startOfDay } from '@/lib/dates';
import { Freq, type TxnType } from '@/domain/enums';
import { useTheme } from '@/theme/ThemeProvider';

const FREQS: { value: Freq; key: string }[] = [
  { value: Freq.DAILY, key: 'recurring_freq_daily' },
  { value: Freq.WEEKLY, key: 'recurring_freq_weekly' },
  { value: Freq.MONTHLY, key: 'recurring_freq_monthly' },
  { value: Freq.YEARLY, key: 'recurring_freq_yearly' },
];

function BackChevron({ color }: { color: string }) {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

export function RecurringScreen() {
  const t = useTheme();
  const { t: tr, i18n } = useTranslation();
  const locale = i18n.language;
  const insets = useSafeAreaInsets();
  const { accounts, categories, views, createRule, setActive, remove } = useRecurring();

  const [creating, setCreating] = useState(false);

  // form state
  const [type, setType] = useState<TxnType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [freq, setFreq] = useState<Freq>(Freq.MONTHLY);
  const [interval, setIntervalStr] = useState('1');
  const [startAt, setStartAt] = useState(() => startOfDay());
  const [hasEnd, setHasEnd] = useState(false);
  const [endAt, setEndAt] = useState(() => addDays(startOfDay(), 365));

  const formCategories = useMemo(
    () => categories.filter((c) => c.kind === (type === 'INCOME' ? 'INCOME' : 'EXPENSE')),
    [categories, type],
  );
  const account = accounts.find((a) => a.id === accountId) ?? accounts[0] ?? null;
  const currency = account?.currency ?? 'EUR';
  const amountMinor = Money.fromString(amount, currency) ?? 0;
  const intervalCount = Math.max(1, parseInt(interval, 10) || 1);
  const valid = amountMinor > 0 && accountId != null && categoryId != null;

  const freqUnit = (f: Freq) => tr(FREQS.find((x) => x.value === f)!.key);
  const scheduleLabel = (r: RuleView) =>
    `${tr('recurring_every')} ${r.intervalCount > 1 ? `${r.intervalCount} ` : ''}${freqUnit(
      r.freq,
    ).toLowerCase()}`;
  const dateLabel = (ms: number) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(ms));

  const openForm = () => {
    setType('EXPENSE');
    setAmount('');
    setAccountId(accounts[0]?.id ?? null);
    setCategoryId(null);
    setFreq(Freq.MONTHLY);
    setIntervalStr('1');
    setStartAt(startOfDay());
    setHasEnd(false);
    setEndAt(addDays(startOfDay(), 365));
    setCreating(true);
  };

  const save = async () => {
    if (!valid || accountId == null || categoryId == null) return;
    const input: NewRuleInput = {
      type,
      amountMinor,
      currency,
      accountId,
      categoryId,
      freq,
      intervalCount,
      startAt,
      endAt: hasEnd ? endAt : null,
      note: null,
    };
    await createRule(input);
    setCreating(false);
  };

  const confirmDelete = (id: number) =>
    Alert.alert(tr('recurring_deleteTitle'), tr('recurring_deleteMsg'), [
      { text: tr('common_cancel'), style: 'cancel' },
      { text: tr('common_delete'), style: 'destructive', onPress: () => void remove(id) },
    ]);

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => (creating ? setCreating(false) : router.back())} hitSlop={12}>
          <BackChevron color={t.colors.textMuted} />
        </Pressable>
        <Text variant="heading" color={t.colors.text}>
          {creating ? tr('recurring_new') : tr('recurring_title')}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      {creating ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formPad}>
          <SegmentedControl<TxnType>
            options={[
              { value: 'EXPENSE', label: tr('add_expense') },
              { value: 'INCOME', label: tr('add_income') },
            ]}
            value={type}
            onChange={(v) => {
              setType(v);
              setCategoryId(null);
            }}
          />

          <TextField
            label={tr('recurring_amount')}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0"
            style={{ marginTop: 16 }}
          />

          <Text variant="caption" color={t.colors.textMuted} style={styles.lbl}>
            {tr('add_selectAccount')}
          </Text>
          <GlassCard padded={false} style={styles.card}>
            <View style={{ padding: 8 }}>
              {accounts.map((a) => (
                <PickerRow
                  key={a.id}
                  icon={accountIcon(a.nameKey)}
                  color={a.colorHex}
                  label={resolveName(a.nameKey, a.name)}
                  selected={accountId === a.id}
                  onPress={() => setAccountId(a.id)}
                />
              ))}
            </View>
          </GlassCard>

          <Text variant="caption" color={t.colors.textMuted} style={styles.lbl}>
            {tr('add_category')}
          </Text>
          <CategoryGrid
            categories={formCategories}
            selectedId={categoryId}
            onSelect={setCategoryId}
          />

          <Text variant="caption" color={t.colors.textMuted} style={styles.lbl}>
            {tr('recurring_every')}
          </Text>
          <View style={styles.everyRow}>
            <TextField
              value={interval}
              onChangeText={setIntervalStr}
              keyboardType="number-pad"
              style={styles.intervalInput}
            />
            <View style={{ flex: 1 }}>
              <SegmentedControl<Freq>
                options={FREQS.map((f) => ({ value: f.value, label: tr(f.key) }))}
                value={freq}
                onChange={setFreq}
              />
            </View>
          </View>

          <View style={{ marginTop: 16, gap: 12 }}>
            <DatePickerField
              label={tr('recurring_start')}
              value={startAt}
              onChange={setStartAt}
              locale={locale}
            />
            <View style={styles.endRow}>
              <Text variant="bodyMedium" color={t.colors.text}>
                {tr('recurring_end')}
              </Text>
              <Switch value={hasEnd} onChange={setHasEnd} />
            </View>
            {hasEnd ? (
              <DatePickerField
                label={tr('recurring_end')}
                value={endAt}
                onChange={setEndAt}
                locale={locale}
              />
            ) : null}
          </View>

          <NeonButton
            label={tr('common_save')}
            onPress={save}
            disabled={!valid}
            style={{ marginTop: 24 }}
          />
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {views.length === 0 ? (
            <View style={{ marginTop: 80 }}>
              <EmptyState
                icon={Repeat}
                title={tr('recurring_empty')}
                subtitle={tr('recurring_emptySub')}
              />
            </View>
          ) : (
            <GlassCard padded={false} style={styles.card}>
              <View style={styles.list}>
                {views.map((r) => (
                  <View key={r.id} style={styles.ruleRow}>
                    <IconTile
                      icon={categoryIcon(r.categoryNameKey, r.categoryKind)}
                      color={r.categoryColor}
                      size={40}
                    />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="bodyMedium" color={t.colors.text}>
                        {resolveName(r.categoryNameKey, r.categoryName)}
                      </Text>
                      <Text variant="caption" color={t.colors.textMuted}>
                        {scheduleLabel(r)} · {tr('recurring_next')} {dateLabel(r.nextDueAt)}
                        {r.active ? '' : ` · ${tr('recurring_paused')}`}
                      </Text>
                    </View>
                    <View style={styles.ruleEnd}>
                      <Text
                        variant="bodyMedium"
                        color={r.type === 'INCOME' ? t.colors.income : t.colors.text}
                      >
                        {r.type === 'INCOME' ? '+' : '−'}
                        {Money.format(r.amountMinor, r.currency, locale)}
                      </Text>
                      <View style={styles.ruleActions}>
                        <Switch
                          value={r.active}
                          onChange={(on) => void setActive(r.id, on)}
                        />
                        <Pressable onPress={() => confirmDelete(r.id)} hitSlop={10}>
                          <Trash2 size={18} color={t.colors.textMuted} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          <Pressable onPress={openForm} style={styles.add}>
            <Text variant="bodyMedium" color={t.colors.accent}>
              {tr('recurring_add')}
            </Text>
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formPad: { paddingBottom: 60 },
  card: { borderRadius: 20 },
  list: { paddingHorizontal: 10, paddingVertical: 4 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  ruleEnd: { alignItems: 'flex-end', gap: 6 },
  ruleActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  lbl: { marginTop: 18, marginBottom: 8, marginLeft: 4, letterSpacing: 1 },
  everyRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  intervalInput: { width: 64, textAlign: 'center' },
  endRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  add: { paddingVertical: 14, paddingHorizontal: 6, alignItems: 'center' },
});
