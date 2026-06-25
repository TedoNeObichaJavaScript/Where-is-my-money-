# Parite RN — Launch checklist (Tasks 199–200 expansion)

The headline plan keeps 200 lines; tasks 199–200 expand into the granular sub-commits below.

## 199 — i18n, store readiness, QA

### i18n
- [x] i18next + react-i18next + expo-localization wired (`src/i18n`)
- [x] EN + BG resource bundles (seeded names, theme labels, screen strings)
- [x] Stopgap label resolver upgraded to i18next (`resolveName`)
- [x] Runtime language switch from Settings (persists + re-localizes)
- [ ] Thread `useTranslation()` through every screen's hardcoded strings
      (Home/Add/History/Analytics/Settings still have inline English literals)
- [ ] Locale-aware date formats audited across screens
- [ ] EN/BG parity lint (no string ships in one language only)

### Build & verify
- [x] `cd mobile && npm install` + `npx expo install --fix` (versions aligned to SDK 52)
- [x] `npm run typecheck` — **0 errors**
- [x] `npm test` — **15/15 pass** (Money, calculator, balance, db key, migrator)
- [x] `npx eslint .` — **0 errors** (9 cosmetic warnings)
- [x] `npx expo-doctor` — **18/18 checks pass**
- [x] Branded cosmic icon + splash assets generated
- [ ] `eas build --profile development` (dev client; SQLCipher/Skia not in Expo Go) — needs EAS account
- [ ] Smoke test on device: boot → seed → add → history → analytics → settings → backup/restore

### Store assets
- [ ] App icon (1024²) + adaptive icon + splash (cosmic)
- [ ] iOS screenshots 6.9" (1290×2796); Android phone shots + feature graphic 1024×500
- [ ] `PrivacyInfo.xcprivacy` + App Privacy nutrition labels ("no data collected")
- [ ] Play Data Safety form + **Financial features declaration**
- [ ] `ios.config.usesNonExemptEncryption=false` (set) ; privacy policy URL
- [ ] EAS production profiles, bundle id `bg.parite.app`, version/build bump

### QA / a11y / perf
- [ ] Test iPhone SE → 16 Pro Max + Android (notch, Dynamic Island, nav bar)
- [ ] Reduce-motion + reduce-transparency fallbacks
- [ ] Blur perf cap on older Android; 60fps lists
- [ ] VoiceOver/TalkBack labels on icon-only controls

## Deferred screen features (non-blocking)
- [ ] 129 income quick-add shortcut · 130 recurring-bills strip · 132 collapsing header · 135 home polish
- [ ] 165 staggered list animations · 168 FlashList swap
- [ ] 177 Sankey cash-flow · 179 calendar heatmap · 180 custom date range · 181 chart entrance anim · 185 chart polish
- [ ] 196 account/category management UI

## 200 — Legacy removal & promotion (REQUIRES CONFIRMATION — destructive)
- [ ] Remove Android `app/`, `gradle/`, root `build.gradle.kts`, `settings.gradle.kts`, wrappers
- [ ] Promote `mobile/` contents to repo root
- [ ] Rewrite root README for cross-platform
- [ ] Tag release `v0.3.0`
