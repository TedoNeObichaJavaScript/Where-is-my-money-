# Parite (React Native) — Architecture

How the Expo app in [`mobile/`](../../mobile) is put together. For *why* each choice was
made see [DECISIONS.md](DECISIONS.md); for versions see [TECH_STACK.md](TECH_STACK.md).

## 1. One-paragraph summary

A privacy-first, **offline-only** personal finance app. No backend, no accounts. All data
lives in an on-device **SQLCipher-encrypted SQLite** database whose key never leaves the
hardware keychain. The UI is a holographic ("out-of-space") dark theme built on expo-router
file routes, a token-driven theme engine, and a hand-rolled component kit. State flows
**DB → repositories → a tiny reactive layer → screen view-models → components**.

## 2. Layered structure

```
app/                         expo-router routes (thin; delegate to src/features/*)
  _layout.tsx                providers → CosmicBackground → BootGate → LockGate → Stack
  (tabs)/                    Home · History · Analytics · Settings + custom TabBar
  add/[type].tsx, edit/[id]  transaction entry/edit (modal)
  manage.tsx                 account/category management (modal)

src/
  theme/        design tokens + ThemeProvider + responsive/scale + system bars
  domain/       PURE: Money, models, enums, balance math (no RN/db imports)
  db/           SQLCipher connection, migrations, row types + mappers, key, reset
  data/         repositories (CRUD + aggregate SQL), reactive layer, seed, backup
  storage/      MMKV prefs (settings, flags) + encryption hook
  security/     biometric helpers + LockGate
  boot/         useBootstrap + BootGate + BootScreen (startup orchestration)
  components/   ui/ kit · charts/ (svg) · background/ (Skia orbs) · nav/ · layout/
  features/     one folder per screen: <Screen>.tsx + use<Screen> view-model + parts
  i18n/         i18next init + en/bg bundles + nameKey resolver
  lib/          haptics, dates
```

**Dependency rule:** `domain` depends on nothing. `db` depends on `domain`. `data` depends
on `db` + `domain`. `features` depend on `data` + `components` + `theme` + `i18n`. Routes
(`app/`) depend only on `features`. Nothing lower imports upward.

## 3. Startup sequence

```
RootLayout
 └─ ThemeProvider (persisted accent variant)
     └─ CosmicBackground (always behind everything, pointerEvents=none)
     └─ BootGate                     ← gates render on:
         1. useAppFonts()            Space Grotesk + Inter loaded
         2. useBootstrap():
              getOrCreateDbKey()      32-byte key from / into expo-secure-store
              encryptKv(key)          MMKV recrypted with the device key
              getDb()                 open DB → PRAGMA key → FK/WAL → runMigrations()
              seedIfNeeded()          first run: 3 accounts + 15 categories
         └─ LockGate                 if biometric enabled → require Face/Touch ID
             └─ Stack (tabs + modals)
```

If secure storage is unavailable the bootstrap throws `SecureStorageUnavailableError`
and BootGate shows a blocking, explained error instead of a white screen.

## 4. Data layer

- **System of record:** `expo-sqlite` opened with SQLCipher. `PRAGMA key` is the first
  statement on the connection; `foreign_keys=ON` and `journal_mode=WAL` follow.
- **Schema** (v1, `db/migrations/0001_init.ts`): `accounts`, `categories`, `transactions`,
  `recurring_rules` — ported 1:1 from the original Android Room schema. Booleans are
  INTEGER 0/1, money is INTEGER **minor units**, timestamps are INTEGER millis.
- **Migrations:** versioned runner keyed on SQLite's `user_version` pragma; idempotent.
- **Repositories** (`data/*Repository.ts`): the only place that writes SQL. Aggregates
  (balance, monthly totals, by-category, daily series) are computed **in SQL**, never
  summed on the client beyond display. Each write calls `bumpData()`.
- **Reactivity** (`data/reactive.ts`): a coarse pub-sub. `bumpData()` notifies all
  `useLiveQuery` subscribers, which re-run their query. No query-cache dependency — fine
  for a single-user local DB.

```
Component → useLiveQuery(() => Repo.query())
                 ▲                         │ writes
                 └──── bumpData() ◄────────┘
```

## 5. Money

`domain/Money.ts` — integer **minor units** + an ISO currency code, never a float. Scale
(10^fractionDigits) is derived from `Intl.NumberFormat` so JPY (0) and EUR (2) both work.
`format`/`fromMajor`/`fromString` ('.' and ',' accepted) wrap Intl. A pure `computeBalance`
mirrors the SQL for optimistic UI. All money logic is unit-tested.

## 6. Theme & UI

- **Tokens** (`theme/`): palette → semantic tokens → composed `Theme` object exposing
  `colors / space / radius / type / glass / gradients / shadow / motion`. Three accent
  variants (Aurora default, Prism, Nebula); switching only swaps the accent ramp.
- **Provider:** `ThemeProvider` reads a persisted Zustand store; `useTheme()` everywhere.
- **Components** (`components/ui`): ~25 primitives (GlassCard, NeonButton, BalanceHero,
  AnimatedNumber, SegmentedControl, Sheet, SwipeableRow, …) all theme-driven.
- **Charts** (`components/charts`): donut, bars, **Sankey cash-flow**, calendar heatmap —
  drawn with `react-native-svg` (no chart library; avoids the victory-native↔Skia trap).
- **Background** (`components/background`): Skia-rendered blurred nebula orbs + aurora
  gradient. The single signature surface that justifies the Skia dependency.
- **Design law:** indigo-black base (never pure black), ≤2 neons, glow rationed to the
  hero balance and the Add button. See [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

## 7. Screens (feature folders)

Each screen is a `<Screen>.tsx` (presentation) + a `use<Screen>` hook (view-model that owns
state + reactive queries). Routes in `app/` are one-liners delegating to these.

| Screen | View-model does |
|---|---|
| Home | total/today/month aggregates, accounts-with-balances, recent 20 |
| Add | calculator keypad state, pickers, validation, insert/update/delete |
| History | debounced search, pagination, day-grouping, undo-delete |
| Analytics | month nav, per-month totals/by-category/daily/trend |
| Settings | prefs, theme/lang/currency, backup/restore, wipe |
| Manage | account/category list + archive/hide + create |

## 8. Security & privacy

- DB key: 32 random bytes → `expo-secure-store` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`).
  Survives app-data clears, lost only on factory reset — the intended threat model.
- MMKV prefs encrypted with the same device key.
- Optional biometric gate (`expo-local-authentication`) via `LockGate`.
- Backup is plain JSON (schema v1) the user explicitly exports/shares; restore is
  REPLACE-only and confirmed. Nothing is ever sent to a network.

## 9. i18n

`i18next` + `react-i18next`, EN + BG bundles, language from saved pref → device → English.
Seeded rows store a `nameKey` (not a frozen name) and resolve through i18n, so categories
re-translate on language switch. EN/BG key parity is enforced by TypeScript *and* a test.

## 10. Testing

`jest-expo`. 8 suites / 27 tests covering the pure, high-risk logic: Money, calculator
(precedence, ÷0), balance math, DB key round-trip, migration idempotency, row mappers,
date helpers, and i18n parity. UI/native-dependent paths are validated via typecheck +
`expo-doctor` and (the remaining step) an on-device dev build.
