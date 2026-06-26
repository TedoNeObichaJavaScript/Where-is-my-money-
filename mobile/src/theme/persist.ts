import { MMKV } from 'react-native-mmkv';
import type { ThemeName } from './theme';
import { themeNames } from './variants';

const store = new MMKV({ id: 'parite.theme' });
const KEY = 'themeName';

export function loadThemeName(): ThemeName {
  const v = store.getString(KEY);
  return v && (themeNames as string[]).includes(v) ? (v as ThemeName) : 'refined';
}

export function saveThemeName(name: ThemeName): void {
  store.set(KEY, name);
}
