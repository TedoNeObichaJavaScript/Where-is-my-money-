import { getLocales } from 'expo-localization';
import { getDb } from '@/db/connection';
import { flags } from '@/storage/flags';
import { bumpData } from './reactive';

/** Device currency for seeded accounts, falling back to EUR. */
export function deviceCurrency(): string {
  return getLocales()[0]?.currencyCode ?? 'EUR';
}

/** Seed accounts — names carry a nameKey so they re-translate on locale switch. */
const SEED_ACCOUNTS = [
  { nameKey: 'acc_cash', emoji: '💵', colorHex: '#04E2B7' },
  { nameKey: 'acc_card', emoji: '💳', colorHex: '#5B8DFF' },
  { nameKey: 'acc_savings', emoji: '🏦', colorHex: '#FFB454' },
];

/** 12 expense categories. */
const SEED_EXPENSE = [
  { nameKey: 'cat_food', emoji: '🍕', colorHex: '#FF6AD5' },
  { nameKey: 'cat_groceries', emoji: '🛒', colorHex: '#04E2B7' },
  { nameKey: 'cat_transport', emoji: '🚗', colorHex: '#5B8DFF' },
  { nameKey: 'cat_housing', emoji: '🏠', colorHex: '#A78BFA' },
  { nameKey: 'cat_bills', emoji: '⚡', colorHex: '#FFD166' },
  { nameKey: 'cat_fun', emoji: '🎉', colorHex: '#F472B6' },
  { nameKey: 'cat_clothing', emoji: '👕', colorHex: '#7AF5FF' },
  { nameKey: 'cat_health', emoji: '💊', colorHex: '#34D399' },
  { nameKey: 'cat_education', emoji: '📚', colorHex: '#60A5FA' },
  { nameKey: 'cat_gifts', emoji: '🎁', colorHex: '#FB7185' },
  { nameKey: 'cat_travel', emoji: '✈️', colorHex: '#22D3EE' },
  { nameKey: 'cat_other_exp', emoji: '📦', colorHex: '#94A3B8' },
];

/** 3 income categories. */
const SEED_INCOME = [
  { nameKey: 'cat_salary', emoji: '💰', colorHex: '#04E2B7' },
  { nameKey: 'cat_gift_in', emoji: '🎁', colorHex: '#5B8DFF' },
  { nameKey: 'cat_other_inc', emoji: '✨', colorHex: '#FFD166' },
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
