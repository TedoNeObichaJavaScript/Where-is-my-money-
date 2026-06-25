# Parite — Mobile (React Native / Expo)

Cross-platform (iOS + Android) rebuild of the privacy-first finance tracker.
Holographic "out-of-space" UI. No backend, no accounts, on-device encrypted storage.

See [`../docs/RN_MIGRATION.md`](../docs/RN_MIGRATION.md) for the task plan and
[`../docs/DESIGN_SYSTEM.md`](../docs/DESIGN_SYSTEM.md) for the visual language.

## Prerequisites

- Node 20+, Git
- `npm i -g eas-cli`
- iOS: macOS + Xcode 16 (or use EAS cloud builds)
- Android: Android Studio + SDK 35

## First run

```bash
cd mobile
npm install
# align native module versions to the installed Expo SDK
npx expo install --fix

# A custom dev client is required (SQLCipher + Skia are not in Expo Go):
eas build --profile development --platform ios      # or android
# then:
npm run start            # Metro for the dev client
```

## Scripts

| Command | What |
|---|---|
| `npm run start` | Metro bundler (dev client) |
| `npm run ios` / `android` | Local native build + run |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Jest |

## Builds

- Dev: `eas build --profile development`
- Store: `eas build --profile production` → `eas submit -p ios|android`

## Notes

- New Architecture is **on** (`newArchEnabled: true`).
- Financial data lives in an SQLCipher DB; the key is in the device keychain/keystore
  via `expo-secure-store`. Nothing leaves the device.
