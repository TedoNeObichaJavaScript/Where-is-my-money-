# Parite — React Native docs

Documentation for the cross-platform Expo rebuild in [`mobile/`](../../mobile).

| Doc | Read it when… |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | "Where does X live? How do the layers fit?" |
| [TECH_STACK.md](TECH_STACK.md) | You need exact packages/versions or the verification gates. |
| [DECISIONS.md](DECISIONS.md) | "Why was it built this way?" — ADRs + trade-offs. |
| [../DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md) | The holographic visual language (colors, glass, motion). |
| [../RN_MIGRATION.md](../RN_MIGRATION.md) | The 200-task migration plan (one task = one commit). |
| [../RN_LAUNCH.md](../RN_LAUNCH.md) | Remaining build/store/QA checklist + deferred items. |

## Status snapshot

- 193/200 plan tasks complete; all five screens + management screen built and i18n'd.
- Verified green: typecheck 0 · 27 tests · eslint 0 · expo-doctor 18/18.
- Remaining: on-device dev build (needs EAS account), a few deferred polish items, and the
  destructive legacy-removal step (task 200) — see RN_LAUNCH.md.

## Quickstart

```bash
cd mobile
npm install --legacy-peer-deps
npx expo install --fix
eas build --profile development   # dev client (SQLCipher + Skia aren't in Expo Go)
npm run start
```
