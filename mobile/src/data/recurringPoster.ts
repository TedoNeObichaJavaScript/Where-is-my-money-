import { bumpData } from './reactive';
import { RecurringRuleRepository } from './RecurringRuleRepository';
import { getDb } from '@/db/connection';
import { dueOccurrences, isExhausted, nextDueAfter } from '@/domain/recurring';

/**
 * Post every recurring occurrence due at or before `now` as a real transaction
 * (tagged with its rule id), then advance each rule's nextDueAt and deactivate
 * any that have run past their end date. Runs in one DB transaction and emits a
 * single reactive bump. Returns the number of transactions created.
 */
export async function postDueRecurring(now: number = Date.now()): Promise<number> {
  const rules = await RecurringRuleRepository.due(now);
  if (rules.length === 0) return 0;

  const db = await getDb();
  let posted = 0;

  await db.withTransactionAsync(async () => {
    for (const r of rules) {
      for (const occurredAt of dueOccurrences(r, now)) {
        await db.runAsync(
          `INSERT INTO transactions
            (accountId,categoryId,type,amountMinor,currency,occurredAt,note,recurringRuleId,createdAt)
           VALUES (?,?,?,?,?,?,?,?,?);`,
          r.accountId,
          r.categoryId,
          r.type,
          r.amountMinor,
          r.currency,
          occurredAt,
          r.note,
          r.id,
          now,
        );
        posted++;
      }
      const next = nextDueAfter(r, now);
      await db.runAsync(
        'UPDATE recurring_rules SET nextDueAt=?, active=? WHERE id=?;',
        next,
        isExhausted(r, next) ? 0 : 1,
        r.id,
      );
    }
  });

  if (posted > 0) bumpData();
  return posted;
}
