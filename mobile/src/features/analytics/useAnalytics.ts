import { useState } from 'react';
import { AccountRepository } from '@/data/AccountRepository';
import { TransactionRepository } from '@/data/TransactionRepository';
import { useLiveQuery } from '@/data/reactive';
import { addMonths, daysInMonth, startOfMonth } from '@/lib/dates';

export type CategoryTotal = {
  categoryId: number;
  name: string;
  emoji: string;
  colorHex: string;
  total: number;
};

type Snapshot = {
  currency: string;
  totals: { income: number; expense: number };
  byCategory: CategoryTotal[];
  daily: number[];
  prevExpense: number;
};

const EMPTY: Snapshot = {
  currency: 'EUR',
  totals: { income: 0, expense: 0 },
  byCategory: [],
  daily: [],
  prevExpense: 0,
};

/** Analytics view-model: month navigation + per-month aggregates (reactive, race-safe). */
export function useAnalytics(locale = 'en') {
  const [monthStart, setMonthStart] = useState(startOfMonth());

  const canNext = monthStart < startOfMonth();
  const prev = () => setMonthStart((m) => addMonths(m, -1));
  const next = () => setMonthStart((m) => (m < startOfMonth() ? addMonths(m, 1) : m));

  const snap = useLiveQuery<Snapshot>(
    async () => {
      const from = monthStart;
      const to = addMonths(monthStart, 1);
      const [accts, totals, cats, series, prevExpense] = await Promise.all([
        AccountRepository.all(),
        TransactionRepository.totalsBetween(from, to),
        TransactionRepository.byCategoryBetween(from, to, 'EXPENSE'),
        TransactionRepository.dailySeries(from, to, 'EXPENSE'),
        TransactionRepository.spentBetween(addMonths(from, -1), from),
      ]);
      const days = daysInMonth(monthStart);
      return {
        currency: accts[0]?.currency ?? 'EUR',
        totals,
        byCategory: cats as CategoryTotal[],
        daily: Array.from({ length: days }, (_, i) => series.get(i) ?? 0),
        prevExpense,
      };
    },
    EMPTY,
    [monthStart],
  );

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(monthStart),
  );
  const trendPct =
    snap.prevExpense > 0
      ? Math.round(((snap.totals.expense - snap.prevExpense) / snap.prevExpense) * 100)
      : null;

  return {
    monthStart,
    monthLabel,
    currency: snap.currency,
    totals: snap.totals,
    byCategory: snap.byCategory,
    daily: snap.daily,
    prevExpense: snap.prevExpense,
    trendPct,
    canNext,
    prev,
    next,
  };
}
