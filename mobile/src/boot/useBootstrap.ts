import { useEffect, useState } from 'react';
import { getDb } from '@/db/connection';
import { getOrCreateDbKey } from '@/db/key';
import { seedIfNeeded } from '@/data/seed';
import { encryptKv } from '@/storage/kv';

type BootState = { ready: boolean; error: Error | null };

/**
 * Boot guard: derive the device key, encrypt the prefs store, open + migrate the
 * encrypted DB. Nothing renders until `ready` is true (or `error` is set).
 * Phase 3 plugs first-run seeding in here (task 77).
 */
export function useBootstrap(): BootState {
  const [state, setState] = useState<BootState>({ ready: false, error: null });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const key = await getOrCreateDbKey();
        encryptKv(key);
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
