import { MMKV } from 'react-native-mmkv';

/**
 * Fast key-value store for **non-secret** app preferences (theme, locale, toggles,
 * last-backup time, first-run flags). All financial data lives in the SQLCipher DB;
 * these prefs reveal nothing about the user's money, so the store is plain.
 *
 * NOTE: this store must NOT be recrypted per-boot. MMKV is opened synchronously at
 * module load (before the async device key is available), so re-encrypting it each
 * launch would make the previous launch's data unreadable — which silently reset the
 * "seeded" flag and re-seeded duplicate accounts on every start.
 */
export const kv = new MMKV({ id: 'parite.kv' });
