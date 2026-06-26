import { getLocales } from 'expo-localization';
import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { flags } from '@/storage/flags';

/** Device currency for seeded accounts, falling back to EUR. */
export function deviceCurrency(): string {
  return getLocales()[0]?.currencyCode ?? 'EUR';
}

/** Seed accounts — names carry a nameKey so they re-translate on locale switch. */
const SEED_ACCOUNTS = [
  { nameKey: 'acc_cash', emoji: '', colorHex: '#3DD68C' },
  { nameKey: 'acc_card', emoji: '', colorHex: '#5B8DEF' },
  { nameKey: 'acc_savings', emoji: '', colorHex: '#8B5CF6' },
];

/** 12 expense categories — refined, distinct, non-neon colors. */
const SEED_EXPENSE = [
  { nameKey: 'cat_food', emoji: '', colorHex: '#F4725E' },
  { nameKey: 'cat_groceries', emoji: '', colorHex: '#3DD68C' },
  { nameKey: 'cat_transport', emoji: '', colorHex: '#5B8DEF' },
  { nameKey: 'cat_housing', emoji: '', colorHex: '#8B5CF6' },
  { nameKey: 'cat_bills', emoji: '', colorHex: '#F59E0B' },
  { nameKey: 'cat_fun', emoji: '', colorHex: '#EC4899' },
  { nameKey: 'cat_clothing', emoji: '', colorHex: '#06B6D4' },
  { nameKey: 'cat_health', emoji: '', colorHex: '#EF4444' },
  { nameKey: 'cat_education', emoji: '', colorHex: '#3B82F6' },
  { nameKey: 'cat_gifts', emoji: '', colorHex: '#F472B6' },
  { nameKey: 'cat_travel', emoji: '', colorHex: '#14B8A6' },
  { nameKey: 'cat_other_exp', emoji: '', colorHex: '#94A3B8' },
];

/** 3 income categories. */
const SEED_INCOME = [
  { nameKey: 'cat_salary', emoji: '', colorHex: '#3DD68C' },
  { nameKey: 'cat_gift_in', emoji: '', colorHex: '#5B8DEF' },
  { nameKey: 'cat_other_inc', emoji: '', colorHex: '#F59E0B' },
];

/**
 * Seeds default accounts + categories once. The display `name` is left empty and
 * resolved from `nameKey` at render time, so it follows the active locale.
 * Idempotent via the `seeded` flag.
 */
export async function seedIfNeeded(): Promise<void> {
  if (flags.isSeeded()) return;
  const db = await getDb();
  const currency = deviceCurrency();

  await db.withTransactionAsync(async () => {
    let sort = 0;
    for (const a of SEED_ACCOUNTS) {
      await db.runAsync(
        `INSERT INTO accounts (name,nameKey,currency,openingMinor,colorHex,emoji,sortOrder,archived)
         VALUES ('',?,?,0,?,?,?,0);`,
        a.nameKey,
        currency,
        a.colorHex,
        a.emoji,
        sort++,
      );
    }
    sort = 0;
    for (const c of SEED_EXPENSE) {
      await db.runAsync(
        `INSERT INTO categories (name,nameKey,kind,emoji,colorHex,sortOrder,hidden)
         VALUES ('',?,'EXPENSE',?,?,?,0);`,
        c.nameKey,
        c.emoji,
        c.colorHex,
        sort++,
      );
    }
    sort = 0;
    for (const c of SEED_INCOME) {
      await db.runAsync(
        `INSERT INTO categories (name,nameKey,kind,emoji,colorHex,sortOrder,hidden)
         VALUES ('',?,'INCOME',?,?,?,0);`,
        c.nameKey,
        c.emoji,
        c.colorHex,
        sort++,
      );
    }
  });

  flags.markSeeded();
  bumpData();
}
