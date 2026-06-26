import { AccountRepository } from '@/data/AccountRepository';
import { CategoryRepository } from '@/data/CategoryRepository';
import { RecurringRuleRepository } from '@/data/RecurringRuleRepository';
import { TransactionRepository, type TransactionView } from '@/data/TransactionRepository';
import { useLiveQuery } from '@/data/reactive';
import { settings } from '@/storage/settings';
import { addDays, addMonths, startOfDay, startOfMonth } from '@/lib/dates';
import type { Account } from '@/domain/models';
import type { CategoryKind, TxnType } from '@/domain/enums';

export type AccountWithBalance = { account: Account; balance: number };

/** A compact upcoming recurring rule for the Home strip. */
export type UpcomingRule = {
  id: number;
  type: TxnType;
  amountMinor: number;
  currency: string;
  nextDueAt: number;
  categoryName: string;
  categoryNameKey: string | null;
  categoryColor: string;
  categoryKind: CategoryKind;
};

export type HomeData = {
  currency: string;
  total: number;
  accounts: AccountWithBalance[];
  todaySpent: number;
  monthSpent: number;
  prevMonthSpent: number;
  recent: TransactionView[];
  upcoming: UpcomingRule[];
};

/** Home view-model: reactive aggregates pulled from the repositories. */
export function useHomeData(): HomeData {
  const accounts = useLiveQuery<AccountWithBalance[]>(async () => {
    const accs = await AccountRepository.all();
    return Promise.all(
      accs.map(async (account) => ({
        account,
        balance: await AccountRepository.balance(account.id),
      })),
    );
  }, []);

  const total = useLiveQuery(() => AccountRepository.total(), 0);

  const todaySpent = useLiveQuery(
    () => TransactionRepository.spentBetween(startOfDay(), addDays(startOfDay(), 1)),
    0,
  );

  const monthStart = startOfMonth();
  const monthSpent = useLiveQuery(
    () => TransactionRepository.spentBetween(monthStart, addMonths(monthStart, 1)),
    0,
  );
  const prevMonthSpent = useLiveQuery(
    () => TransactionRepository.spentBetween(addMonths(monthStart, -1), monthStart),
    0,
  );

  const recent = useLiveQuery(() => TransactionRepository.recent(20), []);

  const upcoming = useLiveQuery<UpcomingRule[]>(async () => {
    const [rules, cats] = await Promise.all([
      RecurringRuleRepository.active(), // already ordered by nextDueAt
      CategoryRepository.all(true),
    ]);
    return rules.slice(0, 5).map((r) => {
      const c = cats.find((x) => x.id === r.categoryId);
      return {
        id: r.id,
        type: r.type,
        amountMinor: r.amountMinor,
        currency: r.currency,
        nextDueAt: r.nextDueAt,
        categoryName: c?.name ?? '',
        categoryNameKey: c?.nameKey ?? null,
        categoryColor: c?.colorHex ?? '#7A828F',
        categoryKind: c?.kind ?? 'EXPENSE',
      };
    });
  }, []);

  const currency = settings.getDisplayCurrency() ?? accounts[0]?.account.currency ?? 'EUR';

  return { currency, total, accounts, todaySpent, monthSpent, prevMonthSpent, recent, upcoming };
}
