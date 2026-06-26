import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransactionRepository, type TransactionView } from '@/data/TransactionRepository';
import { subscribeData } from '@/data/reactive';
import { dayKey } from '@/lib/dates';

const PAGE = 30;
const UNDO_MS = 4000;

export type DaySection = {
  key: string;
  title: string;
  expenseMinor: number;
  currency: string;
  data: TransactionView[];
};

function sectionTitle(key: string, locale: string): string {
  const today = dayKey(Date.now());
  const yest = dayKey(Date.now() - 86_400_000);
  if (key === today) return 'Today';
  if (key === yest) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(y!, m! - 1, d!));
}

/** History view-model: debounced search, pagination, day grouping, undo-delete. */
export function useHistory(locale = 'en') {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<TransactionView[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const offset = useRef(0);
  const reloadToken = useRef(0);
  const [pendingUndo, setPendingUndo] = useState<TransactionView | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // debounce the search box
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // clear a pending undo timer if the screen unmounts (avoids setState-after-unmount)
  useEffect(
    () => () => {
      if (undoTimer.current) clearTimeout(undoTimer.current);
    },
    [],
  );

  const reload = useCallback(async () => {
    const token = ++reloadToken.current;
    const rows = await TransactionRepository.page({ limit: PAGE, offset: 0, search });
    if (token !== reloadToken.current) return; // a newer reload superseded this one
    setItems(rows);
    setHasMore(rows.length === PAGE);
    offset.current = rows.length;
  }, [search]);

  useEffect(() => {
    void reload();
    const unsub = subscribeData(() => void reload());
    return unsub;
  }, [reload]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    const rows = await TransactionRepository.page({ limit: PAGE, offset: offset.current, search });
    setItems((prev) => [...prev, ...rows]);
    setHasMore(rows.length === PAGE);
    offset.current += rows.length;
  }, [hasMore, search]);

  // group into day sections with per-day expense subtotals
  const sections = useMemo<DaySection[]>(() => {
    const map = new Map<string, DaySection>();
    for (const txn of items) {
      const key = dayKey(txn.occurredAt);
      let sec = map.get(key);
      if (!sec) {
        sec = {
          key,
          title: sectionTitle(key, locale),
          expenseMinor: 0,
          currency: txn.currency,
          data: [],
        };
        map.set(key, sec);
      }
      sec.data.push(txn);
      if (txn.type === 'EXPENSE') sec.expenseMinor += txn.amountMinor;
    }
    return [...map.values()];
  }, [items, locale]);

  async function deleteWithUndo(txn: TransactionView) {
    await TransactionRepository.remove(txn.id);
    setPendingUndo(txn);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setPendingUndo(null), UNDO_MS);
  }

  async function undo() {
    if (!pendingUndo) return;
    const {
      id: _id,
      createdAt: _c,
      categoryName,
      categoryNameKey,
      categoryEmoji,
      categoryColor,
      accountName,
      accountNameKey,
      ...rest
    } = pendingUndo;
    void categoryName;
    void categoryNameKey;
    void categoryEmoji;
    void categoryColor;
    void accountName;
    void accountNameKey;
    await TransactionRepository.create(rest);
    setPendingUndo(null);
  }

  return {
    searchInput,
    setSearchInput,
    search,
    sections,
    loadMore,
    hasMore,
    pendingUndo,
    deleteWithUndo,
    undo,
  };
}
