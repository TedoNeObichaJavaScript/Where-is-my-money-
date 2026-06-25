/**
 * Raw color values for the holographic system. Semantic mapping lives in tokens.ts.
 * Rule: indigo-black base, never pure #000000. ≤2 neons per theme.
 */

export const canvas = {
  bg: '#0A0A14', // the void
  surface: '#12121F', // elevated section
  card: '#1A1A2E', // solid card base
  cardGlass: 'rgba(17,25,40,0.55)', // glass fill over orbs
  border: 'rgba(255,255,255,0.12)', // hairline glass border
  borderStrong: 'rgba(255,255,255,0.20)',
} as const;

export const ink = {
  text: '#E2F3FF', // primary text
  textMuted: '#8A93B2', // secondary
  textFaint: '#5A6080', // tertiary / disabled
  white: '#FFFFFF',
} as const;

/** Aurora — calm premium default. */
export const aurora = {
  accent: '#04E2B7', // teal
  accentBright: '#0EF3C5',
  accentBlue: '#5B8DFF',
  deep: '#025385',
} as const;

/** Prism — high energy. */
export const prism = {
  accent: '#FF6AD5',
  accentBright: '#FF9DFB',
  accentBlue: '#7AF5FF',
  deep: '#5B8DFF',
} as const;

/** Nebula — moody. */
export const nebula = {
  accent: '#EA00D9',
  accentBright: '#0ABDC6',
  accentBlue: '#711C91',
  deep: '#091833',
} as const;

/** Semantic money colors — always paired with an icon, never color-alone. */
export const semantic = {
  income: '#04E2B7',
  expense: '#FF6AD5',
  warning: '#E8C07A',
  danger: '#FF5C7A',
} as const;

export type AccentRamp = typeof aurora;
