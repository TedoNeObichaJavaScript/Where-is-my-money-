import { getDb } from '@/db/connection';
import { toRecurringRule } from '@/db/mappers';
import { fromBool, type RecurringRuleRow } from '@/db/types';
import type { RecurringRule } from '@/domain/models';
import { bumpData } from './reactive';

type NewRule = Omit<RecurringRule, 'id'>;

export const RecurringRuleRepository = {
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
