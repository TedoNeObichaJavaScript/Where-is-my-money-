import { getDb } from './connection';

/**
 * Deletes every row from all tables (children first), preserving the schema.
 * Used by REPLACE-mode restore and the Settings "wipe all data" action.
 */
export async function wipeAllData(): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.execAsync('DELETE FROM transactions;');
    await db.execAsync('DELETE FROM recurring_rules;');
    await db.execAsync('DELETE FROM accounts;');
    await db.execAsync('DELETE FROM categories;');
    // reset AUTOINCREMENT counters so restored ids stay stable
    await db.execAsync(
      "DELETE FROM sqlite_sequence WHERE name IN ('transactions','recurring_rules','accounts','categories');",
    );
  });
}
