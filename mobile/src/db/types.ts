/** Raw SQLite row shapes (booleans are 0/1 INTEGER, money is INTEGER minor units). */

export interface AccountRow {
  id: number;
  name: string;
  nameKey: string | null;
  currency: string;
  openingMinor: number;
  colorHex: string;
  emoji: string;
  sortOrder: number;
  archived: number;
}

export interface CategoryRow {
  id: number;
  name: string;
  nameKey: string | null;
  kind: string;
  emoji: string;
  colorHex: string;
  sortOrder: number;
  hidden: number;
}

export interface TransactionRow {
  id: number;
  accountId: number;
  categoryId: number;
  type: string;
  amountMinor: number;
  currency: string;
  occurredAt: number;
  note: string | null;
  recurringRuleId: number | null;
  createdAt: number;
}

export interface RecurringRuleRow {
  id: number;
  accountId: number;
  categoryId: number;
  type: string;
  amountMinor: number;
  currency: string;
  freq: string;
  intervalCount: number;
  startAt: number;
  endAt: number | null;
  nextDueAt: number;
  note: string | null;
  active: number;
}

/** 0/1 INTEGER ↔ boolean helpers for the row<->domain boundary. */
export const fromBool = (b: boolean): number => (b ? 1 : 0);
export const toBool = (n: number): boolean => n === 1;
