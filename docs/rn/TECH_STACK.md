# Parite (React Native) — Tech Stack

Exact stack for the Expo app in [`mobile/`](../../mobile). Rationale in
[DECISIONS.md](DECISIONS.md); structure in [ARCHITECTURE.md](ARCHITECTURE.md).

## Platform

| | |
|---|---|
| Framework | **Expo SDK ~52** (managed workflow + EAS dev/prod builds) |
| Runtime | React Native **0.76.9**, React **18.3.1**, **New Architecture ON** |
| Language | **TypeScript ~5.6** (strict, `noUncheckedIndexedAccess`) |
| Targets | iOS 15+ · Android (compile/target SDK 35 via expo-build-properties) |
| Bundle id | `bg.parite.app` (iOS + Android) |

## Runtime dependencies

| Concern | Package | Version |
|---|---|---|
| Navigation | expo-router | ~4.0 |
| Tab bar types | @react-navigation/bottom-tabs | ^7.0 |
| Animation | react-native-reanimated | ~3.16 |
| Animation sugar | moti | ^0.29 |
| Gestures | react-native-gesture-handler | ~2.20 |
| Safe area | react-native-safe-area-context | 4.12 |
| Native screens | react-native-screens | ~4.4 |
| Icons | **lucide-react-native** | ^1.21 |
| Vector/charts | react-native-svg | 15.8.0 |
| Blur (bottom sheet only) | expo-blur | ~14.0 |
| Gradients (chart fills) | expo-linear-gradient | ~14.0 |
| ~~GPU shaders~~ | @shopify/react-native-skia | 1.5.0 — *now unused after the refined-dark redesign; pending removal* |
| Encrypted DB | expo-sqlite (+ SQLCipher plugin) | ~15.1 |
| Key storage | expo-secure-store | ~14.0 |
| Randomness | expo-crypto | ~14.0 |
| Fast prefs (enc.) | react-native-mmkv | ~3.1 |
| Biometrics | expo-local-authentication | ~15.0 |
| State | zustand | ^5.0 |
| i18n | i18next + react-i18next | ^23 / ^15 |
| Locale detect | expo-localization | ~16.0 |
| Fonts | expo-font + @expo-google-fonts/{space-grotesk,inter} | — |
| Date picker | @react-native-community/datetimepicker | 8.2.0 |
| Backup I/O | expo-file-system · expo-sharing · expo-document-picker | — |
| Haptics | expo-haptics | ~14.0 |
| System bars | expo-system-ui · expo-navigation-bar · expo-status-bar | — |

## Dev / build tooling

| Concern | Package |
|---|---|
| Test runner | jest ^29 + jest-expo ~52 (+ @types/jest) |
| Lint | eslint ^9 (flat config) + eslint-config-expo ^56 |
| Format | prettier ^3 |
| Path alias `@/*` | babel-plugin-module-resolver + tsconfig paths |
| Android SDK config | expo-build-properties |
| Schema validator pin | ajv ^8 (resolves an ajv-keywords hoisting conflict) |

## Fonts

- **Space Grotesk** — display / money figures (tabular).
- **Inter** — body / UI.

## Verification gates (all green)

- `npm run typecheck` → 0 errors
- `npm test` → 27 tests / 8 suites pass
- `npx eslint .` → 0 problems
- `npx expo-doctor` → 18/18

## Known constraints

- **Dev client required** (not Expo Go): SQLCipher and Skia are native modules → must run
  via `eas build --profile development` or a local prebuild.
- **eslint-config-expo** is pinned to the flat-config v56 line and added to
  `expo.install.exclude` (Expo SDK 52 otherwise expects the legacy v8 eslintrc config).
- **Audit**: remaining `npm audit` advisories are all in build-time/dev transitive deps
  (Expo plist tooling, the jest chain) that ship nothing to the device; not force-fixed so
  the SDK-aligned tree stays intact.
- Installs use `--legacy-peer-deps` (mixed peer ranges across the Expo + RN ecosystem).
