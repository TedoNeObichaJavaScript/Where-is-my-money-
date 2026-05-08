# Strings & localization

**Hard rule: every string ships in EN + BG simultaneously.** Never commit a string that exists in only one locale.

## Where they live

```
app/src/main/res/values/strings.xml       — English (default)
app/src/main/res/values-bg/strings.xml    — Bulgarian
```

## Adding a new string

1. Add `<string name="my_key">English text</string>` to **both** files.
2. Reference via `R.string.my_key` in code or `stringResource(R.string.my_key)` in Compose.
3. For format args, use positional placeholders: `%1$s`, `%2$d`. Never use unpositioned `%s`.

## Key conventions

- Prefix by feature area: `home_*`, `add_*`, `history_*`, `analytics_*`, `settings_*`, `cat_*`, `acc_*`, `day_*`, `biometric_*`, `backup_*`, `restore_*`, `custom_cat_*`, `nav_*`.
- App name lives in `app_name` (full) and `app_name_short` (launcher / brand).
- Day labels (`day_today`, `day_yesterday`) are reused across History grouping and the Add date pill.

## Bulgarian style notes

- "Account" (financial) → `Сметка`. "Bills" (utilities) → `Сметки`. Yes, same word; context disambiguates.
- "Categories" → `Категории`. "Categorize" verb is rarely needed.
- Currency labels: don't translate `BGN` / `EUR` / `USD`. The `NumberFormat.getCurrencyInstance` localized symbol handles display (`лв.`, `€`, `$`).
- Use the formal "you" (implicit / second-person plural verbs) in long-form copy; imperative singular is fine for buttons (`Запази`, `Отказ`).

## Re-translation on locale change

Seeded entities (default accounts, default categories) carry a `nameKey` field (e.g. `"cat_food"`). The seeded `name` is the resolved string at install time. v1.1 will add a "re-translate seeded entities" step on locale change that looks up `nameKey` against the current locale's `R.string`. Custom entities created by the user keep their literal `name` and have `nameKey = null`.
