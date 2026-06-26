import { useEffect, useState } from 'react';
import { getDb } from '@/db/connection';
import { getOrCreateDbKey } from '@/db/key';
import { seedIfNeeded } from '@/data/seed';

type BootState = { ready: boolean; error: Error | null };

/**
 * Boot guard: ensure the device key exists, open + migrate the encrypted DB, then
 * seed on first run. Nothing renders until `ready` is true (or `error` is set).
 */
export function useBootstrap(): BootState {
  const [state, setState] = useState<BootState>({ ready: false, error: null });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await getOrCreateDbKey();
        await getDb();
        await seedIfNeeded();
        if (active) setState({ ready: true, error: null });
      } catch (e) {
        if (active) setState({ ready: false, error: e as Error });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
