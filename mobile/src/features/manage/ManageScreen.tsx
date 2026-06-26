import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard, NeonButton, Sheet, Switch, Text, TextField } from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { accountIcon, categoryIcon } from '@/components/icons/catalog';
import { AccountRepository } from '@/data/AccountRepository';
import { CategoryRepository } from '@/data/CategoryRepository';
import { useLiveQuery } from '@/data/reactive';
import { deviceCurrency } from '@/data/seed';
import { resolveName } from '@/i18n/labels';
import { useTheme } from '@/theme/ThemeProvider';
import type { Account, Category } from '@/domain/models';

const PALETTE = [
  '#3DD68C',
  '#5B8DEF',
  '#F4725E',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  '#14B8A6',
];

type Draft = { kind: 'account' | 'category'; income: boolean } | null;

export function ManageScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();

  const accounts = useLiveQuery<Account[]>(() => AccountRepository.all(true), []);
  const categories = useLiveQuery<Category[]>(() => CategoryRepository.all(true), []);

  const [draft, setDraft] = useState<Draft>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(PALETTE[0]!);

  const openCreate = (kind: 'account' | 'category', income = false) => {
    setName('');
    setColor(PALETTE[0]!);
    setDraft({ kind, income });
  };

  const save = async () => {
    if (!draft || !name.trim()) return;
    if (draft.kind === 'account') {
      await AccountRepository.create({
        name: name.trim(),
        nameKey: null,
        currency: deviceCurrency(),
        openingMinor: 0,
        colorHex: color,
        emoji: '',
        sortOrder: accounts.length,
        archived: false,
      });
    } else {
      await CategoryRepository.create({
        name: name.trim(),
        nameKey: null,
        kind: draft.income ? 'INCOME' : 'EXPENSE',
        emoji: '',
        colorHex: color,
        sortOrder: categories.length,
        hidden: false,
      });
    }
    setDraft(null);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            <Path
              d="M15 6l-6 6 6 6"
              stroke={t.colors.textMuted}
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
        <Text variant="heading" color={t.colors.text}>
          {tr('manage_title')}
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* accounts */}
        <Text variant="micro" color={t.colors.textMuted} style={styles.lbl}>
          {tr('manage_accounts').toUpperCase()}
        </Text>
        <GlassCard padded={false} style={styles.card}>
          <View style={styles.list}>
            {accounts.map((a) => (
              <View key={a.id} style={styles.row}>
                <IconTile icon={accountIcon(a.nameKey)} color={a.colorHex} size={38} />
                <Text variant="bodyMedium" color={t.colors.text} style={{ flex: 1 }}>
                  {resolveName(a.nameKey, a.name)}
                </Text>
                <Switch
                  value={!a.archived}
                  onChange={(on) => void AccountRepository.setArchived(a.id, !on)}
                />
              </View>
            ))}
          </View>
        </GlassCard>
        <Pressable onPress={() => openCreate('account')} style={styles.add}>
          <Text variant="bodyMedium" color={t.colors.accent}>
            {tr('manage_addAccount')}
          </Text>
        </Pressable>

        {/* categories */}
        <Text variant="micro" color={t.colors.textMuted} style={styles.lbl}>
          {tr('manage_categories').toUpperCase()}
        </Text>
        <GlassCard padded={false} style={styles.card}>
          <View style={styles.list}>
            {categories.map((c) => (
              <View key={c.id} style={styles.row}>
                <IconTile icon={categoryIcon(c.nameKey, c.kind)} color={c.colorHex} size={38} />
                <Text variant="bodyMedium" color={t.colors.text} style={{ flex: 1 }}>
                  {resolveName(c.nameKey, c.name)}
                </Text>
                <Switch
                  value={!c.hidden}
                  onChange={(on) => void CategoryRepository.setHidden(c.id, !on)}
                />
              </View>
            ))}
          </View>
        </GlassCard>
        <View style={styles.addRow}>
          <Pressable onPress={() => openCreate('category', false)} style={styles.add}>
            <Text variant="bodyMedium" color={t.colors.accent}>
              {tr('manage_addCategory')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* create sheet */}
      <Sheet visible={draft != null} onClose={() => setDraft(null)}>
        <Text variant="heading" color={t.colors.text} style={{ marginBottom: 16 }}>
          {draft?.kind === 'account' ? tr('manage_newAccount') : tr('manage_newCategory')}
        </Text>
        <View style={{ gap: 14, marginBottom: 16 }}>
          <TextField label={tr('manage_name')} value={name} onChangeText={setName} />
          <View>
            <Text variant="caption" color={t.colors.textMuted} style={{ marginBottom: 8 }}>
              {tr('manage_color')}
            </Text>
            <View style={styles.swatches}>
              {PALETTE.map((c) => (
                <Pressable key={c} onPress={() => setColor(c)}>
                  <View
                    style={[
                      styles.swatch,
                      {
                        backgroundColor: c,
                        borderColor: color === c ? t.colors.text : 'transparent',
                      },
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
        <NeonButton label={tr('common_save')} onPress={save} disabled={!name.trim()} />
      </Sheet>
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
  lbl: { marginTop: 16, marginBottom: 8, marginLeft: 6, letterSpacing: 1 },
  card: { borderRadius: 20 },
  list: { paddingHorizontal: 14, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  add: { paddingVertical: 12, paddingHorizontal: 6 },
  addRow: { marginBottom: 8 },
  swatches: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  swatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 2 },
});
