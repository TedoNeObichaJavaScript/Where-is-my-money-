import { bumpData } from './reactive';
import { getDb } from '@/db/connection';
import { toRecurringRule } from '@/db/mappers';
import { fromBool, type RecurringRuleRow } from '@/db/types';
import type { RecurringRule } from '@/domain/models';

type NewRule = Omit<RecurringRule, 'id'>;

export const RecurringRuleRepository = {
  /** All rules, active first then by next due date (for the management screen). */
  async all(): Promise<RecurringRule[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<RecurringRuleRow>(
      'SELECT * FROM recurring_rules ORDER BY active DESC, nextDueAt;',
    );
    return rows.map(toRecurringRule);
  },

  async active(): Promise<RecurringRule[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<RecurringRuleRow>(
      'SELECT * FROM recurring_rules WHERE active = 1 ORDER BY nextDueAt;',
    );
    return rows.map(toRecurringRule);
  },

  /** Rules due on or before `now` (candidates for auto-logging). */
  async due(now: number): Promise<RecurringRule[]> {
    const db = await getDb();
    const rows = await db.getAllAsync<RecurringRuleRow>(
      'SELECT * FROM recurring_rules WHERE active = 1 AND nextDueAt <= ? ORDER BY nextDueAt;',
      now,
    );
    return rows.map(toRecurringRule);
  },

  async create(r: NewRule): Promise<number> {
    const db = await getDb();
    const res = await db.runAsync(
      `INSERT INTO recurring_rules
        (accountId,categoryId,type,amountMinor,currency,freq,intervalCount,startAt,endAt,nextDueAt,note,active)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`,
      r.accountId,
      r.categoryId,
      r.type,
      r.amountMinor,
      r.currency,
      r.freq,
      r.intervalCount,
      r.startAt,
      r.endAt,
      r.nextDueAt,
      r.note,
      fromBool(r.active),
    );
    bumpData();
    return res.lastInsertRowId;
  },

  async update(r: RecurringRule): Promise<void> {
    const db = await getDb();
    await db.runAsync(
      `UPDATE recurring_rules SET
        accountId=?, categoryId=?, type=?, amountMinor=?, currency=?, freq=?, intervalCount=?,
        startAt=?, endAt=?, nextDueAt=?, note=?, active=? WHERE id=?;`,
      r.accountId,
      r.categoryId,
      r.type,
      r.amountMinor,
      r.currency,
      r.freq,
      r.intervalCount,
      r.startAt,
      r.endAt,
      r.nextDueAt,
      r.note,
      fromBool(r.active),
      r.id,
    );
    bumpData();
  },

  async remove(id: number): Promise<void> {
    const db = await getDb();
    await db.runAsync('DELETE FROM recurring_rules WHERE id = ?;', id);
    bumpData();
  },

  async setNextDue(id: number, nextDueAt: number): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE recurring_rules SET nextDueAt=? WHERE id=?;', nextDueAt, id);
    bumpData();
  },

  async setActive(id: number, active: boolean): Promise<void> {
    const db = await getDb();
    await db.runAsync('UPDATE recurring_rules SET active=? WHERE id=?;', fromBool(active), id);
    bumpData();
  },
};
