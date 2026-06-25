import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AmountField,
  GlassCard,
  IconBadge,
  NeonButton,
  PickerRow,
  PressableScale,
  SegmentedControl,
  Sheet,
  TextField,
  Text,
} from '@/components/ui';
import { DatePickerField } from '@/components/ui';
import { resolveName } from '@/i18n/labels';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import type { TxnType } from '@/domain/enums';
import { Keypad } from './Keypad';
import { CategoryGrid } from './CategoryGrid';
import { useAddTransaction } from './useAddTransaction';

function symbolOf(currency: string, locale: string): string {
  const parts = new Intl.NumberFormat(locale, { style: 'currency', currency }).formatToParts(0);
  return parts.find((p) => p.type === 'currency')?.value ?? currency;
}

export function AddScreen({ type, editId }: { type?: TxnType; editId?: number }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const locale = 'en';
  const vm = useAddTransaction({ type, editId });
  const [accountSheet, setAccountSheet] = useState(false);

  const onSave = async () => {
    const ok = await vm.save();
    if (ok) {
      void haptics.success();
      router.back();
    }
  };

  const onDelete = () => {
    Alert.alert('Delete transaction?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await vm.remove();
          void haptics.warn();
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            <Path d="M6 6l12 12M18 6L6 18" stroke={t.colors.textMuted} strokeWidth={2} strokeLinecap="round" />
          </Svg>
        </Pressable>
        <Text variant="heading" color={t.colors.text}>
          {vm.isEdit ? 'Edit' : 'New transaction'}
        </Text>
        {vm.isEdit ? (
          <Pressable onPress={onDelete} hitSlop={12}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" stroke={t.colors.danger} strokeWidth={1.8} fill="none" strokeLinecap="round" />
            </Svg>
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* type toggle */}
        <View style={styles.block}>
          <SegmentedControl<TxnType>
            value={vm.type}
            onChange={vm.setType}
            options={[
              { value: 'EXPENSE', label: 'Expense' },
              { value: 'INCOME', label: 'Income' },
            ]}
          />
        </View>

        {/* amount */}
        <View style={styles.amount}>
          <AmountField
            display={vm.display || '0'}
            currencySymbol={symbolOf(vm.currency, locale)}
            expense={vm.type === 'EXPENSE'}
          />
        </View>

        {/* account */}
        <PressableScale
          onPress={() => setAccountSheet(true)}
          style={[styles.accountRow, { borderColor: t.colors.border, borderRadius: t.radius.base }]}
        >
          {vm.account ? (
            <>
              <IconBadge emoji={vm.account.emoji} color={vm.account.colorHex} size={32} />
              <Text variant="bodyMedium" color={t.colors.text} style={{ flex: 1 }}>
                {resolveName(vm.account.nameKey, vm.account.name)}
              </Text>
            </>
          ) : (
            <Text variant="body" color={t.colors.textMuted} style={{ flex: 1 }}>
              Select account
            </Text>
          )}
          <Text variant="caption" color={t.colors.accentBlue}>
            Change
          </Text>
        </PressableScale>

        {/* category grid */}
        <View style={styles.block}>
          <Text variant="caption" color={t.colors.textMuted} style={styles.lbl}>
            CATEGORY
          </Text>
          <CategoryGrid
            categories={vm.categories}
            selectedId={vm.categoryId}
            onSelect={vm.setCategoryId}
          />
        </View>

        {/* note + date */}
        <View style={styles.block}>
          <TextField
            label="Note"
            placeholder="Optional"
            value={vm.note}
            onChangeText={vm.setNote}
          />
        </View>
        <View style={styles.block}>
          <DatePickerField
            label="DATE"
            value={vm.occurredAt}
            onChange={vm.setOccurredAt}
            locale={locale}
          />
        </View>

        {/* keypad */}
        <GlassCard style={styles.keypadCard}>
          <Keypad onKey={vm.press} />
        </GlassCard>
      </ScrollView>

      {/* save */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <NeonButton label={vm.isEdit ? 'Save changes' : 'Add'} onPress={onSave} disabled={!vm.valid} />
      </View>

      {/* account picker sheet */}
      <Sheet visible={accountSheet} onClose={() => setAccountSheet(false)}>
        {vm.accounts.map((a) => (
          <PickerRow
            key={a.id}
            emoji={a.emoji}
            color={a.colorHex}
            label={resolveName(a.nameKey, a.name)}
            selected={a.id === vm.accountId}
            onPress={() => {
              vm.setAccountId(a.id);
              setAccountSheet(false);
            }}
          />
        ))}
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  block: { marginVertical: 8 },
  lbl: { marginBottom: 8, marginLeft: 2, letterSpacing: 1 },
  amount: { paddingVertical: 18 },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, padding: 12, marginVertical: 8 },
  keypadCard: { borderRadius: 24, marginTop: 8 },
  footer: { paddingTop: 8 },
});
