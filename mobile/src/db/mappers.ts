import { toBool } from './types';
import type { AccountRow, CategoryRow, RecurringRuleRow, TransactionRow } from './types';
import type { Account, Category, RecurringRule, Transaction } from '@/domain/models';
import type { CategoryKind, Freq, TxnType } from '@/domain/enums';

/** Row → domain mappers (booleans from 0/1, enums narrowed from TEXT). */

export const toAccount = (r: AccountRow): Account => ({
  ...r,
  archived: toBool(r.archived),
});

export const toCategory = (r: CategoryRow): Category => ({
  ...r,
  kind: r.kind as CategoryKind,
  hidden: toBool(r.hidden),
});

export const toTransaction = (r: TransactionRow): Transaction => ({
  ...r,
  type: r.type as TxnType,
});

export const toRecurringRule = (r: RecurringRuleRow): RecurringRule => ({
  ...r,
  type: r.type as TxnType,
  freq: r.freq as Freq,
  active: toBool(r.active),
});
