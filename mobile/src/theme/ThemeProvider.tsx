import { createContext, useContext, type ReactNode } from 'react';
import type { Theme, ThemeName } from './theme';
import { useThemeStore } from '@/stores/themeStore';

type ThemeContextValue = {
  theme: Theme;
  name: ThemeName;
  setTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Provides the active theme. Backed by the persisted Zustand store,
 * so theme switches re-render every consumer of useTheme().
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, name, setTheme } = useThemeStore();
  return (
    <ThemeContext.Provider value={{ theme, name, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx.theme;
}

export function useThemeControls() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeControls must be used within <ThemeProvider>');
  return { name: ctx.name, setTheme: ctx.setTheme };
}
