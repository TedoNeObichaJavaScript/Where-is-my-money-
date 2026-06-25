import type { Minor } from './Money';
import type { CategoryKind, Freq, TxnType } from './enums';

/** Domain entities (camelCase, typed booleans/enums) — mapped from DB rows. */

export interface Account {
  id: number;
  name: string;
  nameKey: string | null;
  currency: string;
  openingMinor: Minor;
  colorHex: string;
  emoji: string;
  sortOrder: number;
  archived: boolean;
}

export interface Category {
  id: number;
  name: string;
  nameKey: string | null;
  kind: CategoryKind;
  emoji: string;
  colorHex: string;
  sortOrder: number;
  hidden: boolean;
}

export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  type: TxnType;
  amountMinor: Minor;
  currency: string;
  occurredAt: number;
  note: string | null;
  recurringRuleId: number | null;
  createdAt: number;
}

export interface RecurringRule {
  id: number;
  accountId: number;
  categoryId: number;
  type: TxnType;
  amountMinor: Minor;
  currency: string;
  freq: Freq;
  intervalCount: number;
  startAt: number;
  endAt: number | null;
  nextDueAt: number;
  note: string | null;
  active: boolean;
}

/** New-row inputs (id/createdAt assigned by the repository). */
export type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>;
export type NewAccount = Omit<Account, 'id'>;
export type NewCategory = Omit<Category, 'id'>;
