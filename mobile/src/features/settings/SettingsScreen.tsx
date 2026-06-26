import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlassCard, PillButton, Sheet, Switch, Text } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { settings } from '@/storage/settings';
import { flags } from '@/storage/flags';
import { seedIfNeeded } from '@/data/seed';
import { wipeAllData } from '@/db/reset';
import { exportBackup, importBackup } from '@/data/backup';
import { bumpData } from '@/data/reactive';
import { setLanguage } from '@/i18n';
import { isBiometricAvailable } from '@/security/biometric';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'BGN'];

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={styles.group}>
      <Text variant="micro" color={t.colors.textMuted} style={styles.groupTitle}>
        {title.toUpperCase()}
      </Text>
      <GlassCard padded={false} style={{ borderRadius: 20 }}>
        <View style={{ paddingHorizontal: 16 }}>{children}</View>
      </GlassCard>
    </View>
  );
}

function Row({
  label,
  value,
  onPress,
  right,
  danger,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.row} disabled={!onPress && !right}>
      <Text variant="body" color={danger ? t.colors.danger : t.colors.text}>
        {label}
      </Text>
      <View style={styles.rowRight}>
        {value ? (
          <Text variant="caption" color={t.colors.textMuted}>
            {value}
          </Text>
        ) : null}
        {right}
      </View>
    </Pressable>
  );
}

export function SettingsScreen() {
  const t = useTheme();
  const { t: tr } = useTranslation();
  const insets = useSafeAreaInsets();

  const [biometric, setBiometric] = useState(settings.getBiometricEnabled());
  const [locale, setLocaleState] = useState(settings.getLocale() ?? 'en');
  const [currency, setCurrencyState] = useState(settings.getDisplayCurrency());
  const [lastBackup, setLastBackup] = useState(settings.getLastBackupAt());
  const [curSheet, setCurSheet] = useState(false);

  const toggleBiometric = async (v: boolean) => {
    if (v && !(await isBiometricAvailable())) {
      Alert.alert(tr('settings_notAvailable'), tr('settings_noBiometrics'));
      return;
    }
    settings.setBiometricEnabled(v);
    setBiometric(v);
  };

  const setLang = (l: string) => {
    setLanguage(l); // persists + switches i18next
    setLocaleState(l);
    bumpData(); // re-run live queries so seeded names re-localize
  };

  const pickCurrency = (c: string | null) => {
    settings.setDisplayCurrency(c);
    setCurrencyState(c);
    setCurSheet(false);
    bumpData();
  };

  const onBackup = async () => {
    await exportBackup();
    setLastBackup(settings.getLastBackupAt());
  };

  const onRestore = () => {
    Alert.alert(tr('settings_restoreTitle'), tr('settings_restoreMsg'), [
      { text: tr('common_cancel'), style: 'cancel' },
      {
        text: tr('common_restore'),
        style: 'destructive',
        onPress: async () => {
          const r = await importBackup();
          if (r.ok)
            Alert.alert(tr('settings_restored'), tr('settings_imported', { count: r.count ?? 0 }));
          else if (r.error) Alert.alert(tr('settings_restoreFailed'), r.error);
        },
      },
    ]);
  };

  const onWipe = () => {
    Alert.alert(tr('settings_eraseTitle'), tr('settings_eraseMsg'), [
      { text: tr('common_cancel'), style: 'cancel' },
      {
        text: tr('common_erase'),
        style: 'destructive',
        onPress: async () => {
          await wipeAllData();
          flags.clearAll();
          await seedIfNeeded();
          bumpData();
        },
      },
    ]);
  };

  const version = Constants.expoConfig?.version ?? '0.3.0';
  const backupLabel = lastBackup
    ? new Date(lastBackup).toLocaleDateString(locale)
    : tr('settings_never');

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
      <Text variant="title" color={t.colors.text} style={styles.h}>
        {tr('settings_title')}
      </Text>

      <Group title={tr('settings_security')}>
        <Row
          label={tr('settings_biometric')}
          right={<Switch value={biometric} onChange={toggleBiometric} />}
        />
      </Group>

      <Group title={tr('settings_appearance')}>
        <Row
          label={tr('settings_language')}
          right={
            <View style={styles.langs}>
              <PillButton label="EN" active={locale === 'en'} onPress={() => setLang('en')} />
              <PillButton label="BG" active={locale === 'bg'} onPress={() => setLang('bg')} />
            </View>
          }
        />
        <Row
          label={tr('settings_currency')}
          value={currency ?? tr('settings_auto')}
          onPress={() => setCurSheet(true)}
        />
      </Group>

      <Group title={tr('settings_data')}>
        <Row label={tr('manage_open')} onPress={() => router.push('/manage')} />
        <Row label={tr('recurring_open')} onPress={() => router.push('/recurring')} />
        <Row label={tr('settings_backup')} onPress={onBackup} />
        <Row label={tr('settings_restore')} onPress={onRestore} />
        <Row label={tr('settings_lastBackup')} value={backupLabel} />
      </Group>

      <Group title={tr('settings_about')}>
        <Row label={tr('settings_version')} value={version} />
        <Row label={tr('settings_privacy')} value={tr('settings_privacyValue')} />
      </Group>

      <Group title={tr('settings_danger')}>
        <Row label={tr('settings_erase')} danger onPress={onWipe} />
      </Group>

      <Sheet visible={curSheet} onClose={() => setCurSheet(false)}>
        {['Auto', ...CURRENCIES].map((c) => (
          <Pressable
            key={c}
            style={styles.curRow}
            onPress={() => pickCurrency(c === 'Auto' ? null : c)}
          >
            <Text variant="bodyMedium" color={t.colors.text}>
              {c === 'Auto' ? tr('settings_auto') : c}
            </Text>
          </Pressable>
        ))}
      </Sheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  h: { marginBottom: 14 },
  group: { marginBottom: 18 },
  groupTitle: { marginBottom: 8, marginLeft: 6, letterSpacing: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swatches: { flexDirection: 'row', gap: 8 },
  swatch: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  langs: { flexDirection: 'row', gap: 8 },
  curRow: { paddingVertical: 14, paddingHorizontal: 6 },
});
