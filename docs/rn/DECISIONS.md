# Parite (React Native) — Decision Log

Architecture Decision Records for the Android→React Native migration. Each entry: the
decision, why, and the trade-off accepted. Newest concerns first within sections.

---

## ADR-001 — Expo (managed) over bare React Native
**Decision:** Build on Expo SDK 52 managed workflow, not bare RN.
**Why:** Fastest path to both stores + every iPhone resolution; EAS build/submit; config
plugins for native modules without touching Xcode/Gradle by hand.
**Trade-off:** Native modules (SQLCipher, Skia) need a custom **dev client** — the app
cannot run in Expo Go. Accepted: a one-time `eas build --profile development`.

## ADR-002 — New app in `mobile/`, legacy Android kept
**Decision:** Put the Expo app in `mobile/`; leave the Kotlin app in `app/` until migration
is signed off (task 200).
**Why:** expo-router uses an `app/` routes dir that would collide with the Android module
`app/`. Keeping the original as reference de-risks parity checks.
**Trade-off:** Two apps in one repo temporarily. Final task promotes `mobile/` to root.

## ADR-003 — SQLCipher + secure-store key, not plaintext SQLite
**Decision:** `expo-sqlite` with the SQLCipher option; a 32-byte key generated once and
stored only in `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
**Why:** Preserve the original's structural-privacy threat model — data is encrypted at
rest with a hardware-bound key; survives app-data clears, lost only on factory reset.
**Trade-off:** Forces a dev client; key handling adds a boot step. Worth it — privacy is
the product.

## ADR-004 — Money as integer minor units, never float
**Decision:** `Money` = integer minor units + ISO currency; scale from `Intl`.
**Why:** Floats mis-count money (0.1 + 0.2). Mirrors the Kotlin `@JvmInline value class`.
**Trade-off:** Manual scale handling per currency; covered by unit tests.

## ADR-005 — Custom reactive layer over a query library
**Decision:** A ~30-line pub-sub (`bumpData` + `useLiveQuery`) instead of TanStack Query /
WatermelonDB / Drizzle-live.
**Why:** Single-user local DB; writes are rare and coarse invalidation is fine. Avoids a
heavy dependency and keeps the data flow obvious.
**Trade-off:** Any write re-runs all live queries (no per-row granularity). Negligible at
this data scale; revisit if a screen ever holds thousands of rows.

## ADR-006 — Repositories own all SQL; aggregates computed in SQL
**Decision:** No ORM. Hand-written repositories; balances/totals via SQL `SUM/CASE`.
**Why:** Full control, no codegen, matches the original's "compute in SQL" rule. Caught a
real bug early (a JOIN that multiplied opening balance by transaction count → fixed with
subqueries).
**Trade-off:** More SQL to maintain by hand vs. an ORM's safety. Mitigated by typed row
mappers + tests.

## ADR-007 — Charts in react-native-svg, no chart library
**Decision:** Draw donut, bars, **Sankey cash-flow**, and calendar heatmap by hand in svg.
**Why:** `victory-native` v41 peers on Skia v1 while the SDK ships a different Skia → a
known version conflict. Hand-svg gives full holographic control and zero version risk.
**Trade-off:** We maintain the chart math (arc offsets, ribbons). Small and tested-by-eye;
the Sankey is the analytics differentiator, worth owning.

## ADR-008 — Skia reserved for one signature surface
**Decision:** Use `@shopify/react-native-skia` only for the blurred nebula-orb background;
everything else uses expo-blur / expo-linear-gradient / svg.
**Why:** Skia is heavy; the design needs exactly one GPU-blurred "light leak" surface.
**Trade-off:** A large dependency for one component — justified by the signature look and
60fps blur that CSS-style approaches can't match on Android.

## ADR-009 — MMKV for prefs, encrypted with the device key
**Decision:** `react-native-mmkv` (encrypted) for settings/flags/theme; SQLite stays the
system of record for financial data.
**Why:** ~30× faster than AsyncStorage for tiny synchronous reads (theme on first paint).
**Trade-off:** Two storage systems. Clear split: money → SQLite, preferences → MMKV.

## ADR-010 — Holographic design constraints encoded as law
**Decision:** Indigo-black base (never `#000`), ≤2 neons, glow only the hero number + Add
button, glass only over the orb/gradient backdrop.
**Why:** Premium cosmic look vs. tacky neon soup is a matter of restraint; codifying it
keeps every new component on-brand.
**Trade-off:** Less freedom per component — intentional.

## ADR-011 — `nameKey` seeds + i18next, EN/BG parity enforced
**Decision:** Seeded accounts/categories store a `nameKey`, resolved through i18next at
render; bundles for EN + BG; parity enforced by TypeScript *and* a runtime test.
**Why:** The original's hard rule — a string ships in both languages or not at all — and
names must re-translate on language switch, not freeze at install.
**Trade-off:** Indirection (no literal name on seeds). Worth it for true bilingual parity.

## ADR-012 — Verify-after-build, accept writing ahead
**Decision:** The app was authored before `npm install`, then verified once deps landed.
**Why:** Granular one-task-per-commit progress was the goal; the toolchain confirmed it
afterward (fixed 6 type bugs + an `ajv` hoisting conflict; aligned versions; doctor 18/18).
**Trade-off:** Some intermediate commits don't compile in isolation — expected in granular
history. The branch tip is fully green.

## ADR-013 — Disable React-Compiler ESLint rules; pin eslint-config-expo flat
**Decision:** Turn off `react-hooks/{immutability,refs,set-state-in-effect}`; use
eslint-config-expo flat-config v56 and exclude it from Expo's version check.
**Why:** Those v6 rules assume the React Compiler (not in use) and misfire on Reanimated
shared-value writes, external-store refs, and async data-loading effects. SDK 52 otherwise
pins the legacy eslintrc config, incompatible with our flat config.
**Trade-off:** Slightly less strict hooks linting; `rules-of-hooks` + `exhaustive-deps`
kept. Documented in `eslint.config.js`.

## ADR-014 — Don't force-fix build-time-only audit advisories
**Decision:** Run non-breaking `npm audit fix` only; leave advisories that need `--force`.
**Why:** The remaining vulns are all in Expo/jest **transitive build-time** deps (e.g.
`@xmldom/xmldom`, `js-yaml`) that ship nothing to the device. `--force` would break the
SDK-aligned tree that `expo-doctor` validates.
**Trade-off:** A non-zero audit count that is build-time-only. Re-evaluate when Expo bumps
its own tooling.

## ADR-015 — Refined Dark over the cosmic/holographic look
**Decision:** Replace the holographic theme (nebula gradients, neon glow, glass blur) with a
clean **Refined Dark** system: flat `#0F1216` canvas, bordered `#181B21` cards, one emerald
accent, no glow.
**Why:** On a real device the cosmic look read as edgy and unpolished — wrong for a finance
app, which must feel calm and trustworthy. Verified against fintech references (Mercury,
Linear, Copilot).
**Trade-off:** Loses the distinctive "out of space" identity the project started with.
Accepted — clarity and trust matter more for this product.

## ADR-016 — Lucide line icons over emoji
**Decision:** Use `lucide-react-native` for all category/account/tab icons via a
`nameKey → icon` catalog; emoji are gone from the UI.
**Why:** Emoji render inconsistently across platforms and look cheap; Lucide gives a
consistent, professional, 1:1-representative set (Food→Utensils, Transport→Car, …).
**Trade-off:** Custom (user-created) categories fall back to a generic icon until an
icon-picker is added; the DB keeps an unused `emoji` column for now.

---

## Deferred (tracked in [../RN_LAUNCH.md](../RN_LAUNCH.md))
On-device dev build + smoke test (needs an EAS account); recurring-bill creation UI;
FlashList swap; custom analytics date range; final glow/transition polish; and task 200
(remove legacy Android, promote `mobile/` to root) — destructive, awaiting sign-off.
