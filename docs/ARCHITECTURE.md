# Architecture

Single-module Android app. Kotlin + Jetpack Compose + Material 3. Manual DI (no Hilt).

## Package layout

```
bg.parite.app/
├── PariteApp.kt              Application; constructs AppContainer
├── MainActivity.kt           FragmentActivity; biometric gate; hosts Compose
├── di/AppContainer.kt        Manual DI graph (DB, repos, services)
├── security/
│   ├── KeystoreHelper.kt     AES-GCM wraps SQLCipher passphrase via Android Keystore
│   └── BiometricGate.kt      BiometricPrompt wrapper + capability check
├── data/
│   ├── model/                Account, Category, Transaction, RecurringRule, Money
│   ├── db/                   Room DAOs + PariteDatabase + SQLCipher helper + Seed
│   ├── repo/                 Account/Category/Transaction repositories
│   ├── prefs/SettingsRepository.kt   DataStore wrapper
│   └── backup/BackupService.kt       org.json export/import via SAF
└── ui/
    ├── theme/                Color, Type, Theme — coral/sage palette
    ├── components/           Reusable: PariteCard, PariteLargeTopBar, Donut, BarChart, softShadow()
    ├── nav/                  Routes + PariteNav (NavHost + bottom nav)
    └── screens/
        ├── home/             HomeScreen + HomeViewModel
        ├── add/              AddTransactionScreen + AddTransactionViewModel (also handles Edit)
        ├── history/          HistoryScreen + HistoryViewModel
        ├── analytics/        AnalyticsScreen + AnalyticsViewModel
        └── settings/         SettingsScreen + SettingsViewModel
```

## Key design decisions

- **Manual DI via `AppContainer`** — no Hilt. ~80 lines instead of a kapt/KSP graph. Trivial to swap later.
- **MainActivity = FragmentActivity** — `BiometricPrompt` requires it. `enableEdgeToEdge()` still works.
- **SQLCipher passphrase** = random 32 bytes generated once, AES-GCM-encrypted with an Android Keystore key (alias `parite_db_key`), ciphertext + IV in plain SharedPreferences `parite_secure`. Survives app data clear; lost only on factory reset.
- **Money is `Long` minor units** + currency code per transaction. Never float/double.
- **Entities carry `nameKey`** so seeded names can be re-translated when locale changes (e.g. `"cat_food"` → look up `R.string.cat_food`). Currently `name` holds the resolved string at seed time; `nameKey` enables future re-translation.
- **`RecurringRule` table exists in v0.1** even though no UI consumes it yet — v1.x widget/recurring features won't need a Room migration.
- **Backup = plain JSON via `org.json`**, REPLACE-mode restore inside a `withTransaction` block. No encryption — passphrase backups create a "user forgot, lost data" support nightmare; user controls the file's location which has its own encryption.
- **No paid deps. No `kotlinx.serialization`. No chart library.** Custom Compose Canvas for donut + bar chart.

## Data flow

```
Room DAO  →  Repository  →  ViewModel (StateFlow via combine + stateIn)
                                ↓
                          Composable (collectAsState)
```

- All DAOs return `Flow<...>` for observable state, `suspend` for one-shots.
- ViewModels expose a single `state: StateFlow<UiState>`.
- All amounts in DB are `amountMinor: Long` with `currency: String`.
- Account balance is computed via SQL `JOIN` in `observeBalances()` — never sum on the client beyond display.

## Theme tokens

- `MaterialTheme.colorScheme.primary` = coral `#E07A5F` (expense)
- `MaterialTheme.colorScheme.secondary` = sage `#7BA98C` (income)
- Background = cream `#FAF6F1` light / dark `#1A1816`
- Use `PariteCard` for any surfaced container. It applies `softShadow()` + correct corner radius.
- Use `PariteLargeTopBar(title)` on full-screen tabs. Use plain `TopAppBar` for nested screens (Add/Edit).
