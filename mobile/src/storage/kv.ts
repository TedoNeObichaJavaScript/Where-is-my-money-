import { MMKV } from 'react-native-mmkv';

/**
 * Fast key-value store for non-secret app preferences (toggles, last-backup time,
 * locale). Encrypted at rest; the encryption key is injected at boot from
 * secure-store via encryptKv() — prefs hold no financial data, but we encrypt anyway.
 */
export const kv = new MMKV({ id: 'parite.kv' });

/** Re-encrypt the store with a device-bound key (called once during bootstrap). */
export function encryptKv(key: string): void {
  kv.recrypt(key);
}
