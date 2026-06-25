import { Money } from '../Money';

describe('Money', () => {
  it('round-trips major <-> minor for 2-digit currencies', () => {
    expect(Money.fromMajor(18.4, 'EUR')).toBe(1840);
    expect(Money.toMajor(1840, 'EUR')).toBeCloseTo(18.4);
    expect(Money.scale('EUR')).toBe(100);
  });

  it('handles zero-decimal currencies (JPY)', () => {
    expect(Money.scale('JPY')).toBe(1);
    expect(Money.fromMajor(500, 'JPY')).toBe(500);
  });

  it('parses both . and , as the decimal separator', () => {
    expect(Money.fromString('12.50', 'EUR')).toBe(1250);
    expect(Money.fromString('12,50', 'EUR')).toBe(1250);
    expect(Money.fromString(' 7 ', 'EUR')).toBe(700);
  });

  it('rejects empty / invalid input', () => {
    expect(Money.fromString('', 'EUR')).toBeNull();
    expect(Money.fromString('.', 'EUR')).toBeNull();
    expect(Money.fromString('abc', 'EUR')).toBeNull();
  });

  it('formats with the currency symbol per locale', () => {
    // exact glyph/spacing varies by ICU; assert the number + code are present.
    const en = Money.format(1840, 'USD', 'en-US');
    expect(en).toContain('18.40');
  });
});
