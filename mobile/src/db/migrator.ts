import type { Db } from './connection';
import { migrations } from './migrations';

export type Migration = {
  version: number;
  name: string;
  up: (db: Db) => Promise<void>;
};

/**
 * Versioned migration runner. Tracks the applied version in SQLite's built-in
 * `user_version` pragma and applies pending migrations in a transaction each.
 * Idempotent: re-running with no new migrations is a no-op.
 */
export async function runMigrations(db: Db): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version;');
  let current = row?.user_version ?? 0;

  for (const m of [...migrations].sort((a, b) => a.version - b.version)) {
    if (m.version <= current) continue;
    await db.withTransactionAsync(async () => {
      await m.up(db);
    });
    await db.execAsync(`PRAGMA user_version = ${m.version};`);
    current = m.version;
  }
}
