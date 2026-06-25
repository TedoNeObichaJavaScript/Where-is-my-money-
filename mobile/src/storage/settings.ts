import { kv } from './kv';

/** Typed preference accessors (keys mirror the Android DataStore spec). */
const K = {
  biometricEnabled: 'biometricEnabled',
  displayCurrency: 'displayCurrency',
  lastBackupAt: 'lastBackupAt',
  locale: 'locale',
} as const;

export const settings = {
  getBiometricEnabled: (): boolean => kv.getBoolean(K.biometricEnabled) ?? false,
  setBiometricEnabled: (v: boolean): void => kv.set(K.biometricEnabled, v),

  /** null = follow each account's own currency. */
  getDisplayCurrency: (): string | null => kv.getString(K.displayCurrency) ?? null,
  setDisplayCurrency: (v: string | null): void =>
    v == null ? kv.delete(K.displayCurrency) : kv.set(K.displayCurrency, v),

  getLastBackupAt: (): number => kv.getNumber(K.lastBackupAt) ?? 0,
  setLastBackupAt: (v: number): void => kv.set(K.lastBackupAt, v),

  /** null = follow device locale. */
  getLocale: (): string | null => kv.getString(K.locale) ?? null,
  setLocale: (v: string): void => kv.set(K.locale, v),
};
