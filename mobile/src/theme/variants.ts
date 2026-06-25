import type { ThemeName } from './theme';

/** Selectable themes with display metadata + a swatch for the settings picker. */
export const themeVariants: {
  name: ThemeName;
  labelKey: string; // i18n key
  swatch: [string, string, string];
}[] = [
  { name: 'aurora', labelKey: 'theme_aurora', swatch: ['#04E2B7', '#5B8DFF', '#0EF3C5'] },
  { name: 'prism', labelKey: 'theme_prism', swatch: ['#FF6AD5', '#7AF5FF', '#5B8DFF'] },
  { name: 'nebula', labelKey: 'theme_nebula', swatch: ['#EA00D9', '#0ABDC6', '#711C91'] },
];

export const themeNames: ThemeName[] = themeVariants.map((v) => v.name);
