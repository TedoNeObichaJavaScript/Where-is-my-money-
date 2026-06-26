import { useMemo, useState } from 'react';
import { AccountRepository } from '@/data/AccountRepository';
import { TransactionRepository } from '@/data/TransactionRepository';
import { useLiveQuery } from '@/data/reactive';
import { addDays, addMonths, startOfDay, startOfMonth } from '@/lib/dates';

const DAY = 86_400_000;

export type CategoryTotal = {
  categoryId: number;
  name: string;
  nameKey: string | null;
  colorHex: string;
  total: number;
};

/** A whole calendar month, or an explicit inclusive day range picked by the user. */
type Period =
  | { mode: 'month'; anchor: number } // anchor = startOfMonth
  | { mode: 'custom'; from: number; to: number }; // [from, to), to is exclusive

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

/** Analytics view-model: month nav or custom range + aggregates (reactive, race-safe). */
export function useAnalytics(locale = 'en') {
  const [period, setPeriod] = useState<Period>({ mode: 'month', anchor: startOfMonth() });

  // Resolve the period into a concrete half-open window [from, to).
  const { from, to } = useMemo(() => {
    if (period.mode === 'month') return { from: period.anchor, to: addMonths(period.anchor, 1) };
    return { from: period.from, to: period.to };
  }, [period]);

  const isMonth = period.mode === 'month';
  const canNext = isMonth && from < startOfMonth();
  const prev = () =>
    setPeriod((p) => (p.mode === 'month' ? { mode: 'month', anchor: addMonths(p.anchor, -1) } : p));
  const next = () =>
    setPeriod((p) =>
      p.mode === 'month' && p.anchor < startOfMonth()
        ? { mode: 'month', anchor: addMonths(p.anchor, 1) }
        : p,
    );
  const setMonthMode = () => setPeriod({ mode: 'month', anchor: startOfMonth() });
  /** `f`/`t` are any millis on the chosen days; end day is treated inclusively. */
  const setCustom = (f: number, t: number) => {
    const a = startOfDay(Math.min(f, t));
    const b = addDays(startOfDay(Math.max(f, t)), 1); // inclusive end → exclusive next-day bound
    setPeriod({ mode: 'custom', from: a, to: b });
  };

  const snap = useLiveQuery<Snapshot>(
    async () => {
      const len = to - from;
      const [accts, totals, cats, series, prevExpense] = await Promise.all([
        AccountRepository.all(),
        TransactionRepository.totalsBetween(from, to),
        TransactionRepository.byCategoryBetween(from, to, 'EXPENSE'),
        TransactionRepository.dailySeries(from, to, 'EXPENSE'),
        TransactionRepository.spentBetween(from - len, from), // preceding equal-length window
      ]);
      const days = Math.max(1, Math.round(len / DAY));
      return {
        currency: accts[0]?.currency ?? 'EUR',
        totals,
        byCategory: cats as CategoryTotal[],
        daily: Array.from({ length: days }, (_, i) => series.get(i) ?? 0),
        prevExpense,
      };
    },
    EMPTY,
    [from, to],
  );

  const periodLabel = useMemo(() => {
    if (isMonth)
      return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
        new Date(from),
      );
    const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
    return `${fmt.format(new Date(from))} – ${fmt.format(new Date(to - DAY))}`;
  }, [isMonth, from, to, locale]);

  const trendPct =
    snap.prevExpense > 0
      ? Math.round(((snap.totals.expense - snap.prevExpense) / snap.prevExpense) * 100)
      : null;

  return {
    mode: period.mode,
    rangeStart: from,
    rangeEnd: to,
    periodLabel,
    currency: snap.currency,
    totals: snap.totals,
    byCategory: snap.byCategory,
    daily: snap.daily,
    prevExpense: snap.prevExpense,
    trendPct,
    canNext,
    prev,
    next,
    setMonthMode,
    setCustom,
  };
}
