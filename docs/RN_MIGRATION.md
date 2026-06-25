# Parite — React Native Migration Plan (Android + iOS)

> Goal: port the native Android Kotlin app (`app/`) to a single **Expo / React Native**
> codebase that ships on **iOS + Android**, with a **holographic "out-of-space" cosmic UI**,
> responsive to every iPhone resolution and Android form factor.
>
> Method: **one task = one commit.** Work top-to-bottom. Check a box only when its commit lands.
> Legacy Android stays in `app/` for reference until Task 200 removes it.

## Stack (locked)

| Concern | Choice |
|---|---|
| Framework | Expo SDK (managed + EAS dev build) |
| Language | TypeScript (strict) |
| Navigation | expo-router (file-based, typed) |
| State/data | Zustand + custom DB repos over expo-sqlite |
| Animation | react-native-reanimated 3 + moti |
| Gradients/Blur | expo-linear-gradient + expo-blur |
| Hero shaders | @shopify/react-native-skia (1–2 surfaces only) |
| Charts | victory-native (Skia) w/ gifted-charts fallback |
| Encrypted DB | expo-sqlite + SQLCipher (`PRAGMA key`) |
| Key storage | expo-secure-store (hardware-backed) |
| Fast prefs | react-native-mmkv (encrypted) |
| Biometrics | expo-local-authentication |
| i18n | i18next + react-i18next + expo-localization |

## Design system (locked)

- Canvas `#0A0A14` (indigo-black, never pure black) · surface `#12121F` · card `#1A1A2E`
- Aurora accent: `#04E2B7` teal · `#5B8DFF` blue · secondary `#0EF3C5`
- Glass: fill `rgba(17,25,40,0.55)`, blur 12px saturate 160%, border `rgba(255,255,255,0.12)`, radius 16
- Neon halo (primary action / key metric ONLY): 3 stacked shadows, growing radius / falling opacity
- Type: one geometric sans (Space Grotesk / Inter), weight contrast carries hierarchy
- Rule: ≤2 neons, ambient color orbs behind glass, glow nothing but the hero number + Add button

---

## Phase 0 — Tooling & project bootstrap (1–15)

- [x] 1. Add `docs/RN_MIGRATION.md` (this plan)
- [x] 2. Add `docs/DESIGN_SYSTEM.md` (holographic spec)
- [x] 3. Create `mobile/` Expo project scaffold (`package.json`)
- [x] 4. Add `mobile/app.json` (name, slug, scheme, bundle ids, icons placeholder)
- [x] 5. Add `mobile/tsconfig.json` (strict, path aliases `@/*`)
- [x] 6. Add `mobile/babel.config.js` (reanimated plugin, module-resolver)
- [x] 7. Add `mobile/metro.config.js` (svg/asset transforms)
- [x] 8. Add `mobile/.gitignore` + update root `.gitignore` for node/expo
- [x] 9. Add ESLint + Prettier config (`eslint.config.js`, `.prettierrc`)
- [x] 10. Add `mobile/eas.json` (dev/preview/production build profiles)
- [x] 11. Add `mobile/README.md` (run, build, EAS, dev-client notes)
- [x] 12. Add `src/` folder structure + barrel `index.ts` stubs
- [x] 13. Add `app/_layout.tsx` root layout (providers shell)
- [x] 14. Add placeholder `app/index.tsx` boot screen
- [ ] 15. Verify `expo-doctor` / typecheck pipeline (`npm run typecheck`, `lint`)

## Phase 1 — Design tokens & theme engine (16–35)

- [x] 16. Add `src/theme/palette.ts` (Aurora + raw color ramps)
- [x] 17. Add `src/theme/space.ts` (4pt spacing scale)
- [x] 18. Add `src/theme/radius.ts` (radii scale)
- [x] 19. Add `src/theme/typography.ts` (sizes, weights, line-heights)
- [x] 20. Add `src/theme/shadows.ts` (depth + neon-halo presets)
- [x] 21. Add `src/theme/glass.ts` (glass surface recipes)
- [x] 22. Add `src/theme/gradients.ts` (aurora/nebula/iridescent recipes)
- [x] 23. Add `src/theme/motion.ts` (durations, easings, spring presets)
- [x] 24. Add `src/theme/tokens.ts` (semantic tokens: bg/surface/text/accent)
- [x] 25. Add `src/theme/theme.ts` (compose tokens → Theme object)
- [x] 26. Add `src/theme/ThemeProvider.tsx` + `useTheme()` hook
- [x] 27. Add multi-theme support (Aurora / Prism / Nebula variants)
- [x] 28. Wire Space Grotesk + Inter via `expo-font` loader
- [x] 29. Add `src/theme/elevation.ts` z-index scale
- [x] 30. Add responsive scaling util `src/theme/scale.ts` (guideline 375pt)
- [x] 31. Add `useResponsive()` hook (breakpoints, orientation)
- [x] 32. Add safe-area wiring via react-native-safe-area-context
- [x] 33. Add dark status bar / nav bar styling
- [x] 34. Add theme persistence to MMKV
- [x] 35. Add theme switcher store + selector

## Phase 2 — Secure storage & DB infrastructure (36–60)

- [x] 36. Install + configure expo-sqlite with SQLCipher plugin
- [x] 37. Add `src/db/key.ts` — generate 32-byte DB key once
- [x] 38. Store DB key in expo-secure-store (WHEN_UNLOCKED_THIS_DEVICE_ONLY)
- [x] 39. Add `src/db/connection.ts` — open DB, `PRAGMA key` first stmt
- [x] 40. Add `src/db/migrations/0001_init.ts` — schema v1
- [x] 41. Add `transactions` table DDL + indices
- [x] 42. Add `accounts` table DDL
- [x] 43. Add `categories` table DDL
- [x] 44. Add `recurring_rules` table DDL
- [x] 45. Add `src/db/migrator.ts` — versioned migration runner
- [x] 46. Add `user_version` pragma tracking
- [x] 47. Add foreign-key enforcement pragma + WAL mode
- [x] 48. Add `src/db/types.ts` — row ↔ domain mappers
- [x] 49. Add MMKV encrypted instance `src/storage/kv.ts`
- [x] 50. Add `src/storage/settings.ts` typed prefs (keys from spec)
- [x] 51. Add prefs: biometricEnabled, displayCurrency, lastBackupAt, themeKey
- [x] 52. Add `src/storage/migrationFlag.ts` (first-run / seeded flags)
- [x] 53. Add DB transaction helper `withTxn()`
- [x] 54. Add query logging in __DEV__ only
- [x] 55. Add DB reset/wipe util (for restore)
- [x] 56. Add unit test harness (jest + ts-jest) config
- [x] 57. Test: DB opens + key round-trips
- [x] 58. Test: migration runner is idempotent
- [x] 59. Add secure-store error fallbacks (no biometrics hw)
- [x] 60. Add boot guard: DB ready before render

## Phase 3 — Domain models, money, repositories, seed (61–80)

- [x] 61. Add `src/domain/Money.ts` (Long minor units, scale per currency)
- [x] 62. Add `Money.format(currency, locale)` via Intl.NumberFormat
- [x] 63. Add `Money.fromMajor` / `fromString` (`.` and `,` parsing)
- [x] 64. Add `src/domain/models.ts` (Account, Category, Transaction, RecurringRule)
- [x] 65. Add `TxnType` / `CategoryKind` / `Freq` enums + guards
- [x] 66. Add `src/data/AccountRepository.ts` (CRUD + archive)
- [x] 67. Add account balance query (opening + SUM income − SUM expense)
- [x] 68. Add `src/data/CategoryRepository.ts` (CRUD + hide)
- [x] 69. Add `src/data/TransactionRepository.ts` (CRUD, paged, search-by-note)
- [x] 70. Add range/aggregate queries (today, month, by-category)
- [x] 71. Add `src/data/RecurringRuleRepository.ts`
- [x] 72. Add reactive query layer (subscribe → re-fetch on write)
- [x] 73. Add `src/data/seed.ts` — 3 accounts (Cash/Card/Savings)
- [x] 74. Add seed — 12 expense categories w/ emoji + color
- [x] 75. Add seed — 3 income categories
- [x] 76. Add `nameKey` localization keys on seeded rows
- [x] 77. Add first-run seeding orchestration
- [x] 78. Add device-currency detection for seed default
- [x] 79. Test: balance math across mixed txns
- [x] 80. Test: Money formatting EN + BG locales

## Phase 4 — Navigation shell & app frame (81–95)

- [x] 81. Add expo-router `(tabs)` group layout
- [x] 82. Add custom holographic tab bar component
- [x] 83. Add center floating "Add" action button (glow)
- [x] 84. Add tabs: Home / History / (Add) / Analytics / Settings
- [x] 85. Add tab icons (animated, accent-on-focus)
- [x] 86. Add `app/(tabs)/index.tsx` Home route
- [x] 87. Add `app/(tabs)/history.tsx` route
- [x] 88. Add `app/(tabs)/analytics.tsx` route
- [x] 89. Add `app/(tabs)/settings.tsx` route
- [x] 90. Add modal route `app/add/[type].tsx` (quick add)
- [x] 91. Add modal route `app/add/edit/[id].tsx` (edit)
- [x] 92. Add deep-link config + scheme handling
- [x] 93. Add animated screen transitions (shared element / fade-up)
- [x] 94. Add global background (nebula orbs + aurora gradient)
- [x] 95. Add app-frame providers compose (theme, db, i18n, safe-area, gesture)

## Phase 5 — Reusable holographic component kit (96–120)

- [x] 96. Add `GlassCard` (blur + border + ambient orb)
- [x] 97. Add `NeonButton` (primary glow CTA)
- [x] 98. Add `GhostButton` / `PillButton` variants
- [x] 99. Add `AuroraBackground` (animated gradient mesh)
- [x] 100. Add `NebulaOrbs` (blurred radial light leaks)
- [x] 101. Add `Text` primitives (Display/Title/Body/Caption tokens)
- [x] 102. Add `AnimatedNumber` (count-up money ticker)
- [x] 103. Add `BalanceHero` (glowing primary number)
- [x] 104. Add `IconBadge` (emoji/category chip with colored halo)
- [x] 105. Add `TextField` (glass input + focus glow)
- [x] 106. Add `AmountField` (large monospace money input)
- [x] 107. Add `SegmentedControl` (Expense/Income toggle)
- [x] 108. Add `Sheet` / `BottomSheet` (gorhom or reanimated)
- [x] 109. Add `Picker` rows (account/category select)
- [x] 110. Add `ListRow` / `TransactionRow` (emoji + amount + note)
- [x] 111. Add `SwipeableRow` (delete + undo, reanimated gesture)
- [x] 112. Add `Snackbar` / `Toast` (undo host)
- [x] 113. Add `EmptyState` (cosmic illustration + copy)
- [x] 114. Add `Skeleton` / shimmer loaders
- [x] 115. Add `Chip` / `FilterChip`
- [x] 116. Add `Divider` / `SectionHeader`
- [x] 117. Add `Switch` (glowing toggle)
- [x] 118. Add `DatePicker` wrapper (platform native + themed)
- [x] 119. Add `Haptics` util + tap feedback wiring
- [x] 120. Add `Pressable` w/ scale+glow press animation

## Phase 6 — Home screen (121–135)

- [x] 121. Build Home scaffold + safe-area + scroll
- [x] 122. Add total balance hero card (animated)
- [x] 123. Add swipeable account tiles row
- [x] 124. Add "today spent" stat card
- [x] 125. Add "this month spent" stat card + vs-last-month delta
- [x] 126. Add recent transactions list (latest 20)
- [x] 127. Add tap-row → edit navigation
- [x] 128. Add empty state (no transactions yet)
- [ ] 129. Add quick-add entry points (expense/income shortcuts)
- [ ] 130. Add upcoming recurring preview strip
- [x] 131. Add pull-to-refresh / live reactive updates
- [ ] 132. Add scroll-linked collapsing header (reanimated)
- [x] 133. Add Home view-model/store binding
- [x] 134. Add greeting + date header
- [ ] 135. Polish Home animations + glow timing

## Phase 7 — Add / Edit transaction (136–155)

- [x] 136. Build Add screen scaffold (modal)
- [x] 137. Add Expense/Income segmented toggle
- [x] 138. Add large amount display field
- [x] 139. Add calculator keypad (0–9, decimal)
- [x] 140. Add operators (+ − × ÷) + evaluation
- [x] 141. Add backspace + clear
- [x] 142. Add account picker sheet
- [x] 143. Add category grid (emoji, color, favorites first)
- [x] 144. Add favorites/frequently-used ordering
- [x] 145. Add note input field
- [x] 146. Add date/time picker
- [x] 147. Add save → repository insert + balance update
- [x] 148. Add validation (amount > 0, account, category)
- [x] 149. Add edit mode (load by id, prefill)
- [x] 150. Add update + delete from edit mode
- [x] 151. Add success haptic + dismiss animation
- [x] 152. Add currency handling per account
- [x] 153. Add Add view-model/store binding
- [x] 154. Add keypad press animations + glow
- [ ] 155. Polish Add screen transitions

## Phase 8 — History (156–168)

- [x] 156. Build History scaffold + list
- [x] 157. Add day-grouped sections (sticky headers)
- [x] 158. Add search-by-note field (debounced)
- [x] 159. Add swipe-to-delete + undo snackbar
- [x] 160. Add tap-to-edit navigation
- [x] 161. Add infinite scroll / pagination
- [x] 162. Add per-day subtotals
- [x] 163. Add filter chips (type/account/category)
- [x] 164. Add empty + no-results states
- [ ] 165. Add list enter animations (staggered)
- [x] 166. Add reactive refresh on data change
- [x] 167. Add History store binding
- [ ] 168. Polish History performance (FlashList)

## Phase 9 — Analytics (169–185)

- [ ] 169. Build Analytics scaffold
- [ ] 170. Add month selector (prev/next, clamp to current)
- [ ] 171. Add income vs expense summary cards
- [ ] 172. Add category donut chart (victory-native/Skia)
- [ ] 173. Add donut center total + legend
- [ ] 174. Add tap-segment → drill to filtered list
- [ ] 175. Add daily spending bar chart
- [ ] 176. Add top-5 categories list w/ bars
- [ ] 177. Add Sankey/cash-flow diagram (differentiator)
- [ ] 178. Add trend vs previous month
- [ ] 179. Add calendar heatmap
- [ ] 180. Add date-range custom selector
- [ ] 181. Add chart entrance animations
- [ ] 182. Add color-blind-safe encodings (not red/green only)
- [ ] 183. Add empty state (no data for month)
- [ ] 184. Add Analytics store binding
- [ ] 185. Polish chart glow + holographic styling

## Phase 10 — Settings, security, backup (186–198)

- [ ] 186. Build Settings scaffold (grouped list)
- [ ] 187. Add biometric toggle (expo-local-authentication)
- [ ] 188. Add biometric lock screen on launch
- [ ] 189. Add theme selector (Aurora/Prism/Nebula)
- [ ] 190. Add language selector (EN/BG)
- [ ] 191. Add display-currency override
- [ ] 192. Add JSON backup export (expo-file-system + sharing)
- [ ] 193. Add backup format parity w/ Android (version 1 schema)
- [ ] 194. Add JSON restore (REPLACE mode + confirm)
- [ ] 195. Add last-backup timestamp display
- [ ] 196. Add account/category management (add/edit/archive)
- [ ] 197. Add about / privacy / version section
- [ ] 198. Add danger zone (wipe all data + confirm)

## Phase 11 — i18n, store launch, cleanup (199–200 + sub-tasks)

- [ ] 199. Wire i18next: EN + BG resource bundles (port 102 keys), expo-localization detection, runtime switch; App Store + Play Store assets (icons, splash, screenshots, privacy manifest, data-safety, financial-features declaration, EAS production profiles); QA across iPhone SE→16 Pro Max + Android; accessibility + perf pass
- [ ] 200. Remove legacy Android `app/`, gradle, root build files; promote `mobile/` to repo root; update README to cross-platform; final release tag

> Tasks 199–200 are umbrellas — each expands into its own granular sub-commit checklist
> (`docs/RN_LAUNCH.md`) when reached, keeping the headline count at 200 while preserving
> one-commit-per-line discipline within each.
