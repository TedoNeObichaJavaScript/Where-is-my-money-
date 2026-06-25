import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GlassCard,
  PillButton,
  Sheet,
  Switch,
  Text,
} from '@/components/ui';
import { useThemeControls } from '@/theme/ThemeProvider';
import { themeVariants } from '@/theme/variants';
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
  const insets = useSafeAreaInsets();
  const { name: themeName, setTheme } = useThemeControls();

  const [biometric, setBiometric] = useState(settings.getBiometricEnabled());
  const [locale, setLocaleState] = useState(settings.getLocale() ?? 'en');
  const [currency, setCurrencyState] = useState(settings.getDisplayCurrency());
  const [lastBackup, setLastBackup] = useState(settings.getLastBackupAt());
  const [curSheet, setCurSheet] = useState(false);

  const toggleBiometric = async (v: boolean) => {
    if (v && !(await isBiometricAvailable())) {
      Alert.alert('Not available', 'No biometrics are set up on this device.');
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
    Alert.alert('Restore backup?', 'This REPLACES all current data.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Restore',
        style: 'destructive',
        onPress: async () => {
          const r = await importBackup();
          if (r.ok) Alert.alert('Restored', `${r.count ?? 0} transactions imported.`);
          else if (r.error) Alert.alert('Could not restore', r.error);
        },
      },
    ]);
  };

  const onWipe = () => {
    Alert.alert('Erase all data?', 'Every transaction, account and category will be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Erase',
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
  const backupLabel = lastBackup ? new Date(lastBackup).toLocaleDateString(locale) : 'Never';

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title" color={t.colors.text} style={styles.h}>
        Settings
      </Text>

      <Group title="Security">
        <Row label="Biometric lock" right={<Switch value={biometric} onChange={toggleBiometric} />} />
      </Group>

      <Group title="Appearance">
        <Row
          label="Theme"
          right={
            <View style={styles.swatches}>
              {themeVariants.map((v) => (
                <Pressable key={v.name} onPress={() => setTheme(v.name)}>
                  <View
                    style={[
                      styles.swatch,
                      { backgroundColor: v.swatch[0], borderColor: themeName === v.name ? t.colors.text : 'transparent' },
                    ]}
                  />
                </Pressable>
              ))}
            </View>
          }
        />
        <Row
          label="Language"
          right={
            <View style={styles.langs}>
              <PillButton label="EN" active={locale === 'en'} onPress={() => setLang('en')} />
              <PillButton label="BG" active={locale === 'bg'} onPress={() => setLang('bg')} />
            </View>
          }
        />
        <Row label="Display currency" value={currency ?? 'Auto'} onPress={() => setCurSheet(true)} />
      </Group>

      <Group title="Data">
        <Row label="Back up to file" onPress={onBackup} />
        <Row label="Restore from file" onPress={onRestore} />
        <Row label="Last backup" value={backupLabel} />
      </Group>

      <Group title="About">
        <Row label="Version" value={version} />
        <Row label="Privacy" value="On-device only" />
      </Group>

      <Group title="Danger zone">
        <Row label="Erase all data" danger onPress={onWipe} />
      </Group>

      <Sheet visible={curSheet} onClose={() => setCurSheet(false)}>
        {['Auto', ...CURRENCIES].map((c) => (
          <Pressable key={c} style={styles.curRow} onPress={() => pickCurrency(c === 'Auto' ? null : c)}>
            <Text variant="bodyMedium" color={t.colors.text}>
              {c}
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
