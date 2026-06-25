import { computeBalance } from '../balance';

describe('computeBalance', () => {
  it('adds income and subtracts expense from opening', () => {
    const bal = computeBalance(10000, [
      { type: 'INCOME', amountMinor: 2400 },
      { type: 'EXPENSE', amountMinor: 1840 },
      { type: 'EXPENSE', amountMinor: 640 },
    ]);
    expect(bal).toBe(10000 + 2400 - 1840 - 640);
  });

  it('returns opening when there are no transactions', () => {
    expect(computeBalance(500, [])).toBe(500);
  });

  it('can go negative', () => {
    expect(computeBalance(0, [{ type: 'EXPENSE', amountMinor: 999 }])).toBe(-999);
  });
});
