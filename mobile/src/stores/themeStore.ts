import { create } from 'zustand';
import { makeTheme, type Theme, type ThemeName } from '@/theme/theme';
import { loadThemeName, saveThemeName } from '@/theme/persist';

type ThemeState = {
  name: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
};

const initial = loadThemeName();

/** Global theme store. Persists the chosen accent variant to MMKV. */
export const useThemeStore = create<ThemeState>((set) => ({
  name: initial,
  theme: makeTheme(initial),
  setTheme: (name) => {
    saveThemeName(name);
    set({ name, theme: makeTheme(name) });
  },
}));
