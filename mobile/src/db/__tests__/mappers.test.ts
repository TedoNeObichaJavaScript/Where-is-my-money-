import { toAccount, toCategory, toRecurringRule, toTransaction } from '../mappers';
import type { AccountRow, CategoryRow, RecurringRuleRow, TransactionRow } from '../types';

describe('row → domain mappers', () => {
  it('maps account 0/1 archived to boolean', () => {
    const row: AccountRow = {
      id: 1,
      name: 'Cash',
      nameKey: 'acc_cash',
      currency: 'EUR',
      openingMinor: 5000,
      colorHex: '#04E2B7',
      emoji: '💵',
      sortOrder: 0,
      archived: 1,
    };
    expect(toAccount(row).archived).toBe(true);
    expect(toAccount({ ...row, archived: 0 }).archived).toBe(false);
  });

  it('narrows category kind + hidden flag', () => {
    const row: CategoryRow = {
      id: 2,
      name: '',
      nameKey: 'cat_food',
      kind: 'EXPENSE',
      emoji: '🍕',
      colorHex: '#FF6AD5',
      sortOrder: 1,
      hidden: 0,
    };
    const c = toCategory(row);
    expect(c.kind).toBe('EXPENSE');
    expect(c.hidden).toBe(false);
  });

  it('narrows transaction type', () => {
    const row: TransactionRow = {
      id: 3,
      accountId: 1,
      categoryId: 2,
      type: 'INCOME',
      amountMinor: 2400,
      currency: 'EUR',
      occurredAt: 1000,
      note: null,
      recurringRuleId: null,
      createdAt: 1000,
    };
    expect(toTransaction(row).type).toBe('INCOME');
  });

  it('maps recurring rule enums + active flag', () => {
    const row: RecurringRuleRow = {
      id: 4,
      accountId: 1,
      categoryId: 2,
      type: 'EXPENSE',
      amountMinor: 999,
      currency: 'EUR',
      freq: 'MONTHLY',
      intervalCount: 1,
      startAt: 0,
      endAt: null,
      nextDueAt: 100,
      note: null,
      active: 1,
    };
    const r = toRecurringRule(row);
    expect(r.freq).toBe('MONTHLY');
    expect(r.active).toBe(true);
  });
});
