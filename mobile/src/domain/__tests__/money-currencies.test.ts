import { Money } from '../Money';

describe('Money — currency scales & rounding', () => {
  it('handles 3-decimal currencies (BHD)', () => {
    expect(Money.scale('BHD')).toBe(1000);
    expect(Money.fromMajor(1.234, 'BHD')).toBe(1234);
    expect(Money.toMajor(1234, 'BHD')).toBeCloseTo(1.234);
  });

  it('rounds to the nearest minor unit', () => {
    expect(Money.fromMajor(0.005, 'EUR')).toBe(1);
    expect(Money.fromMajor(0.004, 'EUR')).toBe(0);
  });

  it('formatPlain omits the currency symbol', () => {
    const s = Money.formatPlain(1840, 'EUR', 'en');
    expect(s).not.toMatch(/[€$£]/);
    expect(s).toContain('18.40');
  });

  it('falls back to 2 decimals for unknown currency codes', () => {
    expect(Money.scale('ZZZ')).toBe(100);
  });
});
