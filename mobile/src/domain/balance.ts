import type { Minor } from './Money';
import type { TxnType } from './enums';

/**
 * Pure balance computation: opening + Σ(income) − Σ(expense). Mirrors the SQL in
 * AccountRepository.balance(), and is reused for optimistic UI before a write lands.
 */
export function computeBalance(
  openingMinor: Minor,
  txns: readonly { type: TxnType; amountMinor: Minor }[],
): Minor {
  return txns.reduce(
    (bal, t) => bal + (t.type === 'INCOME' ? t.amountMinor : -t.amountMinor),
    openingMinor,
  );
}
