# Security model

The app's privacy promise is **structural**: it cannot leak data because it never collects any to a server. Local data is still encrypted at rest because phones get lost / borrowed / sold.

## At-rest encryption

| Layer | Mechanism |
|---|---|
| SQLite database | **SQLCipher** (`net.zetetic:sqlcipher-android`) with a 256-bit random passphrase |
| Passphrase storage | AES-GCM encrypted by an Android Keystore key (alias `parite_db_key`), ciphertext + IV in `SharedPreferences("parite_secure")` |
| User prefs | DataStore (`parite_settings.preferences_pb`) — not encrypted; contains only flags (biometric on/off, last backup time), no user data |
| Backup file | Plain JSON via SAF — encryption is the user's responsibility (e.g. they can put it in encrypted Drive folder) |

## Authentication

- **No app account, ever.** No email, no OAuth, no anonymous user IDs.
- **Biometric app lock** is opt-in (Settings → Lock with biometric). Backed by `androidx.biometric:BiometricPrompt`.
- The biometric is gated by the device having an enrolled biometric **or** a screen lock (`BIOMETRIC_STRONG | BIOMETRIC_WEAK | DEVICE_CREDENTIAL`). If none, the toggle disables itself.

## Backup file format

Plain UTF-8 JSON, version-tagged:

```json
{
  "version": 1,
  "exportedAt": 1714838400000,
  "accounts":     [...],
  "categories":   [...],
  "transactions": [...],
  "recurringRules":[...]
}
```

Restore is **REPLACE-only**: wipes all tables in a single Room `withTransaction` block, then bulk-inserts. No partial / merge mode in v0.x — id-conflict resolution is its own design problem.

## What does NOT leave the device

- Transactions, categories, accounts, notes, balances, budgets, recurring rules — never.
- App opening times, screen views, button taps — never (no analytics SDK).

## What MAY leave the device

- **Crashlytics** (when wired in v0.3) — stack traces, device model, OS version. No transaction content.
- **The backup JSON file** — only when the user explicitly picks a destination via SAF.

## Threat model assumptions we accept

- Factory reset destroys data (Keystore key gone → DB unreadable). Users must back up before reset.
- A determined attacker with root + the unlocked phone can read the DB. Our scope is "casual finder of a stolen phone" + "shared device", not "nation-state forensics".
- The backup JSON is plaintext — by design. Users picking a destination is consent.

## Forbidden patterns

- `@RequiresApi` on framework-called overrides → use `Build.VERSION.SDK_INT` inside.
- Storing transaction content in `SharedPreferences` / `DataStore` (it's not encrypted at rest).
- Any feature that requires sending transaction data over the network.
- Any auth backend.
