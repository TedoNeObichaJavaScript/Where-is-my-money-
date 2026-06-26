// In-memory MMKV mock so settings/flags can be tested without the native module.
jest.mock('react-native-mmkv', () => {
  class MMKV {
    private m = new Map<string, unknown>();
    getBoolean(k: string) {
      return this.m.get(k) as boolean | undefined;
    }
    getString(k: string) {
      return this.m.get(k) as string | undefined;
    }
    getNumber(k: string) {
      return this.m.get(k) as number | undefined;
    }
    set(k: string, v: unknown) {
      this.m.set(k, v);
    }
    delete(k: string) {
      this.m.delete(k);
    }
    recrypt() {}
  }
  return { MMKV };
});

import { settings } from '../settings';
import { flags } from '../flags';

describe('settings', () => {
  it('biometric defaults false and round-trips', () => {
    expect(settings.getBiometricEnabled()).toBe(false);
    settings.setBiometricEnabled(true);
    expect(settings.getBiometricEnabled()).toBe(true);
  });

  it('displayCurrency: set, read, and null clears', () => {
    settings.setDisplayCurrency('USD');
    expect(settings.getDisplayCurrency()).toBe('USD');
    settings.setDisplayCurrency(null);
    expect(settings.getDisplayCurrency()).toBeNull();
  });

  it('lastBackupAt defaults 0; locale round-trips', () => {
    expect(settings.getLastBackupAt()).toBe(0);
    settings.setLastBackupAt(1234);
    expect(settings.getLastBackupAt()).toBe(1234);
    settings.setLocale('bg');
    expect(settings.getLocale()).toBe('bg');
  });
});

describe('flags', () => {
  it('seeded/onboarded toggle and clearAll resets', () => {
    expect(flags.isSeeded()).toBe(false);
    flags.markSeeded();
    flags.markOnboarded();
    expect(flags.isSeeded()).toBe(true);
    expect(flags.isOnboarded()).toBe(true);
    flags.clearAll();
    expect(flags.isSeeded()).toBe(false);
    expect(flags.isOnboarded()).toBe(false);
  });
});
