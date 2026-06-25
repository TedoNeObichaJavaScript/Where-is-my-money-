import { useEffect, useState } from 'react';
import { AccountRepository } from '@/data/AccountRepository';
import { TransactionRepository } from '@/data/TransactionRepository';
import { subscribeData } from '@/data/reactive';
import { addMonths, daysInMonth, startOfMonth } from '@/lib/dates';

export type CategoryTotal = {
  categoryId: number;
  name: string;
  emoji: string;
  colorHex: string;
  total: number;
};

/** Analytics view-model: month navigation + per-month aggregates (reactive). */
export function useAnalytics(locale = 'en') {
  const [monthStart, setMonthStart] = useState(startOfMonth());
  const [currency, setCurrency] = useState('EUR');
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [byCategory, setByCategory] = useState<CategoryTotal[]>([]);
  const [daily, setDaily] = useState<number[]>([]);
  const [prevExpense, setPrevExpense] = useState(0);

  const canNext = monthStart < startOfMonth();
  const prev = () => setMonthStart((m) => addMonths(m, -1));
  const next = () => setMonthStart((m) => (m < startOfMonth() ? addMonths(m, 1) : m));

  useEffect(() => {
    let active = true;
    const load = async () => {
      const from = monthStart;
      const to = addMonths(monthStart, 1);
      const [accts, tot, cats, series, prevTot] = await Promise.all([
        AccountRepository.all(),
        TransactionRepository.totalsBetween(from, to),
        TransactionRepository.byCategoryBetween(from, to, 'EXPENSE'),
        TransactionRepository.dailySeries(from, to, 'EXPENSE'),
        TransactionRepository.spentBetween(addMonths(from, -1), from),
      ]);
      if (!active) return;
      setCurrency(accts[0]?.currency ?? 'EUR');
      setTotals(tot);
      setByCategory(cats as CategoryTotal[]);
      const days = daysInMonth(monthStart);
      setDaily(Array.from({ length: days }, (_, i) => series.get(i) ?? 0));
      setPrevExpense(prevTot);
    };
    void load();
    const unsub = subscribeData(() => void load());
    return () => {
      active = false;
      unsub();
    };
  }, [monthStart]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(monthStart),
  );

  const trendPct =
    prevExpense > 0 ? Math.round(((totals.expense - prevExpense) / prevExpense) * 100) : null;

  return {
    monthStart,
    monthLabel,
    currency,
    totals,
    byCategory,
    daily,
    prevExpense,
    trendPct,
    canNext,
    prev,
    next,
  };
}
