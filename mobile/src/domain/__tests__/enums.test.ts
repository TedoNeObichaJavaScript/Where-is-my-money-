import { Freq, TxnType, isFreq, isTxnType } from '../enums';

describe('enum guards', () => {
  it('isTxnType accepts only EXPENSE/INCOME', () => {
    expect(isTxnType(TxnType.EXPENSE)).toBe(true);
    expect(isTxnType(TxnType.INCOME)).toBe(true);
    expect(isTxnType('TRANSFER')).toBe(false);
    expect(isTxnType('')).toBe(false);
  });

  it('isFreq accepts only the four frequencies', () => {
    for (const f of [Freq.DAILY, Freq.WEEKLY, Freq.MONTHLY, Freq.YEARLY]) {
      expect(isFreq(f)).toBe(true);
    }
    expect(isFreq('HOURLY')).toBe(false);
    expect(isFreq('monthly')).toBe(false); // case-sensitive
  });
});
