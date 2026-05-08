# Where Is My Money? · Къде са ми парите?

Free Android personal finance tracker. Manual entry, no auth, no backend, no banks, no ads.
Bilingual EN + BG. Local-only data, encrypted at rest, optional plain-JSON backup to a user-chosen file.

**Package:** `bg.parite.app` · **Min SDK:** 26 · **Target:** 35

## What it is

A finance app that **cannot leak your data because it never has any.** No login, no cloud sync of transactions, no aggregator. The privacy story is structural — not marketing.

## What it isn't (intentionally)

- No bank login (Plaid / Tink / Salt Edge)
- No subscription, ads, or tip jar
- No cloud backup of transactions (manual JSON export is the only path off-device)
- No analytics SDK (Crashlytics only)

## Quick docs

| Doc | When you need it |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | "Where does X live?" "How do flows fit together?" |
| [BUILD.md](BUILD.md) | Building and deploying to the emulator |
| [STRINGS.md](STRINGS.md) | Adding a new string (EN + BG rule) |
| [SECURITY.md](SECURITY.md) | Encryption model, backup format, threat model |
| [ROADMAP.md](ROADMAP.md) | What's done, queued, and deferred |

## v0.2 status

Deployed on Pixel_6 AVD (Android 16). Working: Home, Add (calculator + date picker + custom categories + favorites), History (search, swipe-delete with undo, tap-to-edit), Analytics (donut + daily bar + top categories + month selector), Settings (biometric toggle, JSON backup/restore).

See ROADMAP.md for what's next.
