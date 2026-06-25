import { useEffect, useMemo, useState } from 'react';
import { AccountRepository } from '@/data/AccountRepository';
import { CategoryRepository } from '@/data/CategoryRepository';
import { TransactionRepository } from '@/data/TransactionRepository';
import { subscribeData, useLiveQuery } from '@/data/reactive';
import { Money } from '@/domain/Money';
import type { Account, Category } from '@/domain/models';
import type { TxnType } from '@/domain/enums';
import { applyKey, evaluate } from './calculator';

export type AddState = ReturnType<typeof useAddTransaction>;

/** View-model for the Add/Edit modal — keypad, pickers, validation, persistence. */
export function useAddTransaction(opts: { type?: TxnType; editId?: number }) {
  const [type, setType] = useState<TxnType>(opts.type ?? 'EXPENSE');
  const [display, setDisplay] = useState('');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [occurredAt, setOccurredAt] = useState<number>(Date.now());
  const [loaded, setLoaded] = useState(opts.editId == null);

  const accounts = useLiveQuery<Account[]>(() => AccountRepository.all(), []);

  // categories depend on `type`, so load explicitly (useLiveQuery has no deps)
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    let active = true;
    const load = () =>
      CategoryRepository.byKind(type === 'INCOME' ? 'INCOME' : 'EXPENSE').then((c) => {
        if (active) setCategories(c);
      });
    void load();
    const unsub = subscribeData(() => void load());
    return () => {
      active = false;
      unsub();
    };
  }, [type]);

  // default account once loaded
  useEffect(() => {
    if (accountId == null && accounts.length > 0) setAccountId(accounts[0].id);
  }, [accounts, accountId]);

  // load existing transaction for edit mode
  useEffect(() => {
    if (opts.editId == null) return;
    let active = true;
    void TransactionRepository.byId(opts.editId).then((txn) => {
      if (!active || !txn) return;
      setType(txn.type);
      setAccountId(txn.accountId);
      setCategoryId(txn.categoryId);
      setNote(txn.note ?? '');
      setOccurredAt(txn.occurredAt);
      setDisplay(String(Money.toMajor(txn.amountMinor, txn.currency)));
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [opts.editId]);

  const account = useMemo(
    () => accounts.find((a) => a.id === accountId) ?? null,
    [accounts, accountId],
  );
  const currency = account?.currency ?? 'EUR';

  const evaluated = evaluate(display);
  const amountMinor = evaluated != null ? Money.fromMajor(evaluated, currency) : 0;
  const valid = amountMinor > 0 && accountId != null && categoryId != null;

  const press = (key: string) => setDisplay((d) => applyKey(d, key));

  async function save(): Promise<boolean> {
    if (!valid || accountId == null || categoryId == null) return false;
    const base = {
      accountId,
      categoryId,
      type,
      amountMinor,
      currency,
      occurredAt,
      note: note.trim() || null,
      recurringRuleId: null,
    };
    if (opts.editId != null) {
      await TransactionRepository.update({ ...base, id: opts.editId, createdAt: 0 });
    } else {
      await TransactionRepository.create(base);
    }
    return true;
  }

  async function remove(): Promise<void> {
    if (opts.editId != null) await TransactionRepository.remove(opts.editId);
  }

  return {
    isEdit: opts.editId != null,
    loaded,
    type,
    setType,
    display,
    press,
    accounts,
    categories,
    account,
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    note,
    setNote,
    occurredAt,
    setOccurredAt,
    currency,
    amountMinor,
    valid,
    save,
    remove,
  };
}
