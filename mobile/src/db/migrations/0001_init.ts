import type { Migration } from '../migrator';

/**
 * Schema v1 — ported 1:1 from the Android Room schema. Booleans are stored as
 * INTEGER 0/1; money as INTEGER minor units; timestamps as INTEGER millis.
 * DDL is appended table-by-table in the steps that follow.
 */
const STATEMENTS: string[] = [
  // transactions — FKs RESTRICT (can't delete an account/category in use)
  `CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    type TEXT NOT NULL,
    amountMinor INTEGER NOT NULL,
    currency TEXT NOT NULL,
    occurredAt INTEGER NOT NULL,
    note TEXT,
    recurringRuleId INTEGER,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
  );`,
  `CREATE INDEX idx_txn_account ON transactions(accountId);`,
  `CREATE INDEX idx_txn_category ON transactions(categoryId);`,
  `CREATE INDEX idx_txn_occurred ON transactions(occurredAt);`,

  // accounts
  `CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nameKey TEXT,
    currency TEXT NOT NULL,
    openingMinor INTEGER NOT NULL DEFAULT 0,
    colorHex TEXT NOT NULL,
    emoji TEXT NOT NULL,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    archived INTEGER NOT NULL DEFAULT 0
  );`,

  // categories
  `CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nameKey TEXT,
    kind TEXT NOT NULL,
    emoji TEXT NOT NULL,
    colorHex TEXT NOT NULL,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    hidden INTEGER NOT NULL DEFAULT 0
  );`,

  // recurring_rules
  `CREATE TABLE recurring_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accountId INTEGER NOT NULL,
    categoryId INTEGER NOT NULL,
    type TEXT NOT NULL,
    amountMinor INTEGER NOT NULL,
    currency TEXT NOT NULL,
    freq TEXT NOT NULL,
    intervalCount INTEGER NOT NULL DEFAULT 1,
    startAt INTEGER NOT NULL,
    endAt INTEGER,
    nextDueAt INTEGER NOT NULL,
    note TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (accountId) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT
  );`,
  `CREATE INDEX idx_rule_due ON recurring_rules(nextDueAt);`,
];

export const migration0001: Migration = {
  version: 1,
  name: 'init',
  up: async (db) => {
    for (const sql of STATEMENTS) {
      await db.execAsync(sql);
    }
  },
};
