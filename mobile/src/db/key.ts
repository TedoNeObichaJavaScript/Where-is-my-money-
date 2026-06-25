import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * The SQLCipher passphrase. Generated once as 32 random bytes, then kept only in
 * the hardware-backed keychain/keystore via expo-secure-store. It never lives in
 * JS state longer than a DB open, and never touches disk in plaintext.
 */
const KEY_ALIAS = 'parite.db.key';

const secureOpts: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

function toHex(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += b.toString(16).padStart(2, '0');
  return out;
}

/** Returns the existing DB key, or generates + persists one on first launch. */
export async function getOrCreateDbKey(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEY_ALIAS, secureOpts);
  if (existing) return existing;

  const key = toHex(Crypto.getRandomBytes(32));
  await SecureStore.setItemAsync(KEY_ALIAS, key, secureOpts);
  return key;
}

/** Wipes the key — only used by a full data reset (renders the DB unrecoverable). */
export async function deleteDbKey(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_ALIAS, secureOpts);
}
