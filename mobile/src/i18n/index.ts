import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { en } from './en';
import { bg } from './bg';
import { settings } from '@/storage/settings';

/** Resolve the startup language: saved preference → device → English. */
function initialLanguage(): string {
  const saved = settings.getLocale();
  if (saved) return saved;
  const device = getLocales()[0]?.languageCode;
  return device === 'bg' ? 'bg' : 'en';
}

void i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, bg: { translation: bg } },
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  // Hermes lacks Intl.PluralRules; v3 JSON plural format avoids the runtime warning.
  compatibilityJSON: 'v3',
});

export { i18n };

/** Non-hook translation for use outside React (e.g. seeded-name resolution). */
export function translate(key: string): string {
  return i18n.t(key);
}

/** Switch language at runtime and persist it. */
export function setLanguage(lng: string): void {
  settings.setLocale(lng);
  void i18n.changeLanguage(lng);
}
