import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal reactivity: repositories call bumpData() after any write; live queries
 * subscribe and re-run. Coarse-grained (any write invalidates all queries), which
 * is plenty for a single-user local DB and avoids a heavy query-cache dependency.
 */
type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;

export function bumpData(): void {
  version += 1;
  listeners.forEach((l) => l());
}

export function subscribeData(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Runs an async query, re-running whenever data changes. */
export function useLiveQuery<T>(query: () => Promise<T>, initial: T): T {
  const [data, setData] = useState<T>(initial);
  const queryRef = useRef(query);
  queryRef.current = query;

  const run = useCallback(() => {
    let active = true;
    queryRef.current().then((r) => {
      if (active) setData(r);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const cancel = run();
    const unsub = subscribeData(() => run());
    return () => {
      cancel();
      unsub();
    };
  }, [run]);

  return data;
}
