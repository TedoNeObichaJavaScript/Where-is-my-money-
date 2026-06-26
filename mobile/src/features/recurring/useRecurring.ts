import { useMemo } from 'react';
import { AccountRepository } from '@/data/AccountRepository';
import { CategoryRepository } from '@/data/CategoryRepository';
import { RecurringRuleRepository } from '@/data/RecurringRuleRepository';
import { postDueRecurring } from '@/data/recurringPoster';
import { useLiveQuery } from '@/data/reactive';
import type { Account, Category, RecurringRule } from '@/domain/models';
import type { CategoryKind, Freq, TxnType } from '@/domain/enums';

export type RuleView = RecurringRule & {
  accountName: string;
  accountNameKey: string | null;
  accountColor: string;
  categoryName: string;
  categoryNameKey: string | null;
  categoryColor: string;
  categoryKind: CategoryKind;
};

export type NewRuleInput = {
  type: TxnType;
  amountMinor: number;
  currency: string;
  accountId: number;
  categoryId: number;
  freq: Freq;
  intervalCount: number;
  startAt: number;
  endAt: number | null;
  note: string | null;
};

/** View-model for the recurring-rules screen: reactive list + CRUD. */
export function useRecurring() {
  const accounts = useLiveQuery<Account[]>(() => AccountRepository.all(true), []);
  const categories = useLiveQuery<Category[]>(() => CategoryRepository.all(true), []);
  const rules = useLiveQuery<RecurringRule[]>(() => RecurringRuleRepository.all(), []);

  const views: RuleView[] = useMemo(
    () =>
      rules.map((r) => {
        const a = accounts.find((x) => x.id === r.accountId);
        const c = categories.find((x) => x.id === r.categoryId);
        return {
          ...r,
          accountName: a?.name ?? '',
          accountNameKey: a?.nameKey ?? null,
          accountColor: a?.colorHex ?? '#7A828F',
          categoryName: c?.name ?? '',
          categoryNameKey: c?.nameKey ?? null,
          categoryColor: c?.colorHex ?? '#7A828F',
          categoryKind: c?.kind ?? 'EXPENSE',
        };
      }),
    [rules, accounts, categories],
  );

  /** Create a rule whose first due date is its start, then post anything already due. */
  async function createRule(v: NewRuleInput): Promise<void> {
    await RecurringRuleRepository.create({ ...v, nextDueAt: v.startAt, active: true });
    await postDueRecurring();
  }

  const setActive = (id: number, active: boolean) => RecurringRuleRepository.setActive(id, active);
  const remove = (id: number) => RecurringRuleRepository.remove(id);

  return { accounts, categories, views, createRule, setActive, remove };
}
