/** String-literal enums (stored as TEXT) + runtime guards for the DB boundary. */

export const TxnType = { EXPENSE: 'EXPENSE', INCOME: 'INCOME' } as const;
export type TxnType = (typeof TxnType)[keyof typeof TxnType];

export const CategoryKind = { EXPENSE: 'EXPENSE', INCOME: 'INCOME' } as const;
export type CategoryKind = (typeof CategoryKind)[keyof typeof CategoryKind];

export const Freq = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;
export type Freq = (typeof Freq)[keyof typeof Freq];

export const isTxnType = (v: string): v is TxnType => v === 'EXPENSE' || v === 'INCOME';
export const isFreq = (v: string): v is Freq =>
  v === 'DAILY' || v === 'WEEKLY' || v === 'MONTHLY' || v === 'YEARLY';
