import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { toTransaction } from '@/db/mappers';
import type { TransactionRow } from '@/db/types';
import type { NewTransaction, Transaction } from '@/domain/models';
import type { Minor } from '@/domain/Money';
import type { TxnType } from '@/domain/enums';

/** A transaction joined with its account/category display fields (for lists). */
export interface TransactionView extends Transaction {
  categoryName: string;
  categoryNameKey: string | null;
  categoryEmoji: string;
  categoryColor: string;
  accountName: string;
  accountNameKey: string | null;
}

const VIEW_SELECT = `
  SELECT t.*,
         c.name AS categoryName, c.nameKey AS categoryNameKey,
         c.emoji AS categoryEmoji, c.colorHex AS categoryColor,
         a.name AS accountName, a.nameKey AS accountNameKey
  FROM transactions t
  JOIN categories c ON c.id = t.categoryId
  JOIN accounts a ON a.id = t.accountId`;

export const TransactionRepository = {
  async recent(limit = 20): Promise<TransactionView[]> {
    const db = await getDb();
    return db.getAllAsync<TransactionView>(
      `${VIEW_SELECT} ORDER BY t.occurredAt DESC, t.id DESC LIMIT ?;`,
      limit,
    );
  },

  /** Paged history with optional note search (case-insensitive). */
  async page(opts: { limit: number; offset: number; search?: string }): Promise<TransactionView[]> {
    const db = await getDb();
    const hasSearch = !!opts.search?.trim();
    const where = hasSearch ? "WHERE t.note LIKE '%' || ? || '%' COLLATE NOCASE" : '';
    const params: (string | number)[] = hasSearch
      ? [opts.search!.trim(), opts.limit, opts.offset]
      : [opts.limit, opts.offset];
    return db.getAllAsync<TransactionView>(
      `${VIEW_SELECT} ${where} ORDER BY t.occurredAt DESC, t.id DESC LIMIT ? OFFSET ?;`,
      ...params,
    );
  },

  async byId(id: number): Promise<Transaction | null> {
    const db = await getDb();
    const r = await db.getFirstAsync<TransactionRow>('SELECT * FROM transactions WHERE id = ?;', id);
    return r ? toTransaction(r) : null;
  },

  async create(t: NewTransaction): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO transactions (accountId,categoryId,type,amountMinor,currency,occurredAt,note,recurringRuleId,createdAt)
       VALUES (?,?,?,?,?,?,?,?,?);`,
      t.accountId,
      t.categoryId,
      t.type,
      t.amountMinor,
      t.currency,
      t.occurredAt,
      t.note,
      t.recurringRuleId,
      Date.now(),
    );
    bumpData();
    return res.lastInsertRowId;
  },

  async update(t: Transaction): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE transactions SET accountId=?, categoryId=?, type=?, amountMinor=?, currency=?,
       occurredAt=?, note=?, recurringRuleId=? WHERE id=?;`,
      t.accountId,
      t.categoryId,
      t.type,
      t.amountMinor,
      t.currency,
      t.occurredAt,
      t.note,
      t.recurringRuleId,
      t.id,
    );
    bumpData();
  },

  async remove(id: number): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM transactions WHERE id = ?;', id);
    bumpData();
  },

  /** Σ(expense) over [from, to). */
  async spentBetween(from: number, to: number): Promise<Minor> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ s: number }>(
      `SELECT COALESCE(SUM(amountMinor),0) AS s FROM transactions
       WHERE type='EXPENSE' AND occurredAt >= ? AND occurredAt < ?;`,
      from,
      to,
    );
    return row?.s ?? 0;
  },

  /** Per-type totals over [from, to). */
  async totalsBetween(from: number, to: number): Promise<{ income: Minor; expense: Minor }> {
    const db = await getDb();
    const row = await db.getFirstAsync<{ income: number; expense: number }>(
      `SELECT
         COALESCE(SUM(CASE WHEN type='INCOME' THEN amountMinor END),0) AS income,
         COALESCE(SUM(CASE WHEN type='EXPENSE' THEN amountMinor END),0) AS expense
       FROM transactions WHERE occurredAt >= ? AND occurredAt < ?;`,
      from,
      to,
    );
    return { income: row?.income ?? 0, expense: row?.expense ?? 0 };
  },

  /** Daily expense totals over [from, to) keyed by day index from `from`. */
  async dailySeries(from: number, to: number, type: TxnType = 'EXPENSE'): Promise<Map<number, number>> {
    const db = await getDb();
    const rows = await db.getAllAsync<{ dayIndex: number; total: number }>(
      `SELECT CAST((occurredAt - ?) / 86400000 AS INTEGER) AS dayIndex, SUM(amountMinor) AS total
       FROM transactions
       WHERE type = ? AND occurredAt >= ? AND occurredAt < ?
       GROUP BY dayIndex ORDER BY dayIndex;`,
      from,
      type,
      from,
      to,
    );
    return new Map(rows.map((r) => [r.dayIndex, r.total]));
  },

  /** Expense totals grouped by category over [from, to) — drives the donut. */
  async byCategoryBetween(
    from: number,
    to: number,
    type: TxnType = 'EXPENSE',
  ): Promise<{ categoryId: number; name: string; emoji: string; colorHex: string; total: Minor }[]> {
    const db = await getDb();
    return db.getAllAsync(
      `SELECT c.id AS categoryId, c.name AS name, c.emoji AS emoji, c.colorHex AS colorHex,
              SUM(t.amountMinor) AS total
       FROM transactions t JOIN categories c ON c.id = t.categoryId
       WHERE t.type = ? AND t.occurredAt >= ? AND t.occurredAt < ?
       GROUP BY c.id ORDER BY total DESC;`,
      type,
      from,
      to,
    );
  },
};
