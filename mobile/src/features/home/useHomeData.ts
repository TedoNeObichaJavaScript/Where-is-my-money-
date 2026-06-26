import { AccountRepository } from '@/data/AccountRepository';
import { TransactionRepository, type TransactionView } from '@/data/TransactionRepository';
import { useLiveQuery } from '@/data/reactive';
import { settings } from '@/storage/settings';
import { addDays, addMonths, startOfDay, startOfMonth } from '@/lib/dates';
import type { Account } from '@/domain/models';

export type AccountWithBalance = { account: Account; balance: number };

export type HomeData = {
  currency: string;
  total: number;
  accounts: AccountWithBalance[];
  todaySpent: number;
  monthSpent: number;
  prevMonthSpent: number;
  recent: TransactionView[];
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

  const currency = settings.getDisplayCurrency() ?? accounts[0]?.account.currency ?? 'EUR';

  return { currency, total, accounts, todaySpent, monthSpent, prevMonthSpent, recent };
}
