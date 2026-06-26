import type { ThemeName } from './theme';

/** Single refined theme — variant metadata kept minimal for API compatibility. */
export const themeVariants: {
  name: ThemeName;
  labelKey: string;
  swatch: [string, string, string];
}[] = [{ name: 'refined', labelKey: 'theme_refined', swatch: ['#3DD68C', '#5B8DEF', '#181B21'] }];

export const themeNames: ThemeName[] = ['refined'];
