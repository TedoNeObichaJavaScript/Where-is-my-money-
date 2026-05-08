# Roadmap

## Done — v0.3 (deployed 2026-05-07)

- ✅ Splash, manifest, theme (Material 3, coral/sage palette, soft shadows via `PariteCard`)
- ✅ Encrypted Room DB (SQLCipher + Keystore-wrapped passphrase)
- ✅ Account / Category / Transaction / RecurringRule entities + DAOs + repos
- ✅ Seed: 12 default expense + 3 default income categories, 3 default accounts (Cash / Card / Savings)
- ✅ Bottom nav with 5 tabs
- ✅ Home: total balance via `observeBalances()` JOIN, today/month spent stats, recent list
- ✅ Add: type switcher, **date picker**, **calculator (÷ × − + =)**, account chips, **custom-category dialog**, **favorites row**, note field
- ✅ Edit transaction: tap row in History → reopens Add prefilled, with delete action
- ✅ History: search, day grouping (Today / Yesterday / dated), swipe-to-delete with undo
- ✅ Analytics: month selector, totals, **donut by category**, **daily bar chart**, top-categories list
- ✅ Settings: biometric toggle, **JSON backup-to-file**, **restore-from-file**
- ✅ Biometric app lock (FragmentActivity + BiometricPrompt)
- ✅ EN + BG strings parity for everything

## Queued

| # | Feature | Why | Notes |
|---|---|---|---|
| 1 | Onboarding bottom sheet (first launch) | Currency picker + welcome | Pref `onboardingCompleted: Boolean` in `SettingsRepository` |
| 2 | Quick Settings tile | Retention superpower from Nooze playbook | `TileService` + manifest entry; opens MainActivity with `LAUNCH_TARGET=add` extra |
| 3 | Home-screen widget | Same as above | `AppWidgetProvider` + GlanceAppWidget (no extra dep — ships with Compose) |
| 4 | Recurring transactions | Auto-confirm pattern | `RecurringRule` table already exists; needs WorkManager + notification |
| 5 | Streaks (logging-day count) | Soft retention nudge | DataStore counter + Home card |
| 6 | Edit / rename / hide categories | Currently only creatable | Dialog reuse from custom-category create |
| 7 | Edit / archive / re-order accounts | Currently only seeded | Account settings sub-screen |
| 8 | "Insights" cards on Home | Insight magnetism — "you spent 31% more on coffee" | Computed in HomeViewModel; needs prior-period comparisons |
| 9 | Multi-currency display in analytics | Currently single display currency | Snapshotted exchange rates from frankfurter.app, cached 24h |
| 10 | CSV import | Power-user data migration | Single-screen mapper, parse via OkIO |

## Deferred (v1.x or later)

- **Transfer** between accounts (third TxnType) — needs DB migration. Acceptable in v1.0 with `fallbackToDestructiveMigration` since no real users yet.
- **Receipt photo + OCR** — on-device only via ML Kit. Permission scope creep; defer until other features have settled.
- **Tags** beyond category — adds complexity; users rarely use them in MVP finance apps.
- **Split transactions** — complex UX; few users actually need it.
- **Custom periods in analytics** — biweekly, last 30 days, custom range. Use month-only until users ask.
- **Data export to CSV** — users can already get JSON; CSV is for spreadsheet workflows specifically.

## Never (against product principles)

- Bank login / aggregation (Plaid, Tink, Salt Edge) — kills zero-cost.
- Cloud sync of transactions — breaks "we cannot leak your data."
- Subscriptions, ads, tip jars.
- User accounts of any kind.
- Cloud OCR / cloud AI categorization.
