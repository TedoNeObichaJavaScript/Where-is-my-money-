import { kv } from './kv';

/** One-shot lifecycle flags (first-run seeding, onboarding completion). */
const SEEDED = 'flag.seeded';
const ONBOARDED = 'flag.onboarded';

export const flags = {
  isSeeded: (): boolean => kv.getBoolean(SEEDED) ?? false,
  markSeeded: (): void => kv.set(SEEDED, true),

  isOnboarded: (): boolean => kv.getBoolean(ONBOARDED) ?? false,
  markOnboarded: (): void => kv.set(ONBOARDED, true),

  /** cleared on full data reset so the next launch re-seeds. */
  clearAll: (): void => {
    kv.delete(SEEDED);
    kv.delete(ONBOARDED);
  },
};
