import { useEffect, useRef, useState } from 'react';

/**
 * Minimal reactivity: repositories call bumpData() after any write; live queries
 * subscribe and re-run. Coarse-grained (any write invalidates all queries), which
 * is plenty for a single-user local DB and avoids a heavy query-cache dependency.
 */
type Listener = () => void;
const listeners = new Set<Listener>();

export function bumpData(): void {
  listeners.forEach((l) => l());
}

export function subscribeData(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/**
 * Runs an async query, re-running whenever data changes. A monotonic token ensures
 * only the most recently started query can apply its result — so a slow earlier
 * query resolving after a fast later one (under rapid writes) can't overwrite fresh
 * data with stale, and in-flight queries are ignored after unmount.
 */
export function useLiveQuery<T>(query: () => Promise<T>, initial: T, deps: unknown[] = []): T {
  const [data, setData] = useState<T>(initial);
  const queryRef = useRef(query);
  queryRef.current = query;
  const tokenRef = useRef(0);

  useEffect(() => {
    const run = () => {
      const token = ++tokenRef.current;
      void queryRef.current().then((r) => {
        if (token === tokenRef.current) setData(r);
      });
    };
    run();
    const unsub = subscribeData(run);
    return () => {
      tokenRef.current += 1; // invalidate any in-flight query on unmount
      unsub();
    };
    // re-run when caller-provided deps change (in addition to every data write)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return data;
}
