import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { toAccount } from '@/db/mappers';
import { fromBool, type AccountRow } from '@/db/types';
import type { Account, NewAccount } from '@/domain/models';
import type { Minor } from '@/domain/Money';

export const AccountRepository = {
  async all(includeArchived = false): Promise<Account[]> {
    const db = await getDb();
    const where = includeArchived ? '' : 'WHERE archived = 0';
    const rows = await db.getAllAsync<AccountRow>(
      `SELECT * FROM accounts ${where} ORDER BY sortOrder, id;`,
    );
    return rows.map(toAccount);
  },

  async byId(id: number): Promise<Account | null> {
    const db = await getDb();
    const r = await db.getFirstAsync<AccountRow>('SELECT * FROM accounts WHERE id = ?;', id);
    return r ? toAccount(r) : null;
  },

  async create(a: NewAccount): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO accounts (name,nameKey,currency,openingMinor,colorHex,emoji,sortOrder,archived)
       VALUES (?,?,?,?,?,?,?,?);`,
      a.name,
      a.nameKey,
      a.currency,
      a.openingMinor,
      a.colorHex,
      a.emoji,
      a.sortOrder,
      fromBool(a.archived),
    );
    bumpData();
    return res.lastInsertRowId;
  },

  async update(a: Account): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE accounts SET name=?, nameKey=?, currency=?, openingMinor=?, colorHex=?, emoji=?,
       sortOrder=?, archived=? WHERE id=?;`,
      a.name,
      a.nameKey,
      a.currency,
      a.openingMinor,
      a.colorHex,
      a.emoji,
      a.sortOrder,
      fromBool(a.archived),
      a.id,
    );
    bumpData();
  },

  async setArchived(id: number, archived: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE accounts SET archived=? WHERE id=?;', fromBool(archived), id);
    bumpData();
  },

  /** opening + Σ(income) − Σ(expense) for one account, computed in SQL. */
  async balance(id: number): Promise<Minor> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ bal: number }>(
      `SELECT a.openingMinor +
         COALESCE(SUM(CASE WHEN t.type='INCOME' THEN t.amountMinor ELSE -t.amountMinor END),0) AS bal
       FROM accounts a LEFT JOIN transactions t ON t.accountId = a.id
       WHERE a.id = ? GROUP BY a.id;`,
      id,
    );
    return row?.bal ?? 0;
  },

  /**
   * Total balance across all non-archived accounts. Opening sums and transaction
   * sums are computed in separate subqueries — a JOIN would multiply each account's
   * opening balance by its transaction count.
   */
  async total(): Promise<Minor> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ bal: number }>(
      `SELECT
         (SELECT COALESCE(SUM(openingMinor),0) FROM accounts WHERE archived = 0) +
         (SELECT COALESCE(SUM(CASE WHEN type='INCOME' THEN amountMinor ELSE -amountMinor END),0)
            FROM transactions
            WHERE accountId IN (SELECT id FROM accounts WHERE archived = 0)) AS bal;`,
    );
    return row?.bal ?? 0;
  },
};
