import { i18n } from './index';

/**
 * Resolve a display name for seeded rows that carry a nameKey (empty name).
 * Now backed by i18next, so names follow the active locale (EN/BG).
 */
export function resolveName(nameKey: string | null, name: string): string {
  if (name) return name;
  if (nameKey && i18n.exists(nameKey)) return i18n.t(nameKey);
  return nameKey ?? '';
}
