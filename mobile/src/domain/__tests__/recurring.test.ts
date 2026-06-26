import { advance, dueOccurrences, isExhausted, nextDueAfter } from '../recurring';
import type { RecurringRule } from '../models';

const DAY = 86_400_000;
const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 9, 0, 0, 0).getTime();

function rule(over: Partial<RecurringRule> = {}): RecurringRule {
  return {
    id: 1,
    accountId: 1,
    categoryId: 1,
    type: 'EXPENSE',
    amountMinor: 1000,
    currency: 'EUR',
    freq: 'MONTHLY',
    intervalCount: 1,
    startAt: at(2025, 1, 1),
    endAt: null,
    nextDueAt: at(2025, 1, 1),
    note: null,
    active: true,
    ...over,
  };
}

describe('recurring engine', () => {
  it('advances each frequency by one interval (calendar-aware)', () => {
    const base = at(2025, 1, 31);
    expect(advance(base, 'DAILY')).toBe(at(2025, 2, 1));
    expect(advance(base, 'WEEKLY')).toBe(at(2025, 2, 7));
    expect(advance(base, 'YEARLY')).toBe(at(2026, 1, 31));
    // Jan 31 + 1 month rolls into March (JS Date semantics) — documented behavior
    expect(new Date(advance(base, 'MONTHLY')).getMonth()).toBe(2);
  });

  it('honors intervalCount (every N units)', () => {
    expect(advance(at(2025, 1, 1), 'DAILY', 3)).toBe(at(2025, 1, 4));
    expect(advance(at(2025, 1, 1), 'WEEKLY', 2)).toBe(at(2025, 1, 15));
  });

  it('lists every occurrence due at or before now, oldest first', () => {
    const r = rule({ freq: 'WEEKLY', nextDueAt: at(2025, 1, 1) });
    const occ = dueOccurrences(r, at(2025, 1, 20));
    expect(occ).toEqual([at(2025, 1, 1), at(2025, 1, 8), at(2025, 1, 15)]);
  });

  it('returns no occurrences when nothing is due yet', () => {
    const r = rule({ nextDueAt: at(2025, 6, 1) });
    expect(dueOccurrences(r, at(2025, 1, 1))).toEqual([]);
  });

  it('stops at endAt and reports exhaustion', () => {
    const r = rule({ freq: 'WEEKLY', nextDueAt: at(2025, 1, 1), endAt: at(2025, 1, 10) });
    expect(dueOccurrences(r, at(2025, 2, 1))).toEqual([at(2025, 1, 1), at(2025, 1, 8)]);
    const next = nextDueAfter(r, at(2025, 2, 1));
    expect(next).toBe(at(2025, 1, 15));
    expect(isExhausted(r, next)).toBe(true);
  });

  it('computes the next due timestamp after catch-up', () => {
    const r = rule({ freq: 'DAILY', nextDueAt: at(2025, 1, 1) });
    expect(nextDueAfter(r, at(2025, 1, 3))).toBe(at(2025, 1, 4));
  });

  it('caps a runaway catch-up', () => {
    const r = rule({ freq: 'DAILY', nextDueAt: 0 });
    expect(dueOccurrences(r, 1000 * DAY, 5)).toHaveLength(5);
  });
});
