import { applyKey, evaluate } from '../calculator';

describe('calculator', () => {
  it('evaluates with ×÷ before +−', () => {
    expect(evaluate('12+3×2')).toBe(18);
    expect(evaluate('10-4÷2')).toBe(8);
    expect(evaluate('7')).toBe(7);
  });

  it('parses decimals and comma', () => {
    expect(evaluate('12.5+2')).toBe(14.5);
    expect(evaluate('12,5')).toBe(12.5);
  });

  it('returns null on empty/invalid', () => {
    expect(evaluate('')).toBeNull();
    expect(evaluate('+5')).toBeNull();
  });

  it('guards divide-by-zero', () => {
    expect(evaluate('5÷0')).toBeNull();
  });

  it('applyKey enforces one decimal per segment and replaces trailing ops', () => {
    expect(applyKey('12', '.')).toBe('12.');
    expect(applyKey('12.5', '.')).toBe('12.5');
    expect(applyKey('12+', '×')).toBe('12×');
    expect(applyKey('12', '⌫')).toBe('1');
    expect(applyKey('12', 'C')).toBe('');
  });
});
