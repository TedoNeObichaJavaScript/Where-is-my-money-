/**
 * Refined-dark palette. Calm, clean, finance-appropriate — indigo-charcoal canvas,
 * subtle bordered surfaces, ONE emerald accent. No neon, no nebula, no glow.
 */

export const canvas = {
  bg: '#0F1216', // app background (clean near-black)
  surface: '#181B21', // cards
  surfaceAlt: '#13161B', // tab bar / sunken areas
  card: '#181B21',
  cardGlass: '#181B21', // (kept for API compat; no blur)
  border: '#232830', // hairline card border
  borderStrong: '#2D343E',
} as const;

export const ink = {
  text: '#E7E9EE', // primary
  textMuted: '#7A828F', // secondary
  textFaint: '#4B515C', // tertiary / disabled
  white: '#FFFFFF',
} as const;

/** Single accent ramp — emerald. */
export const accent = {
  accent: '#3DD68C',
  accentBright: '#52E39C',
  accentBlue: '#5B8DEF', // secondary accent (links, info)
  deep: '#1C6B4A',
} as const;

/** Semantic money + state colors. */
export const semantic = {
  income: '#3DD68C',
  expense: '#E7E9EE', // neutral; the −/+ sign conveys direction
  warning: '#F59E0B',
  danger: '#EF4444',
} as const;

export type AccentRamp = {
  accent: string;
  accentBright: string;
  accentBlue: string;
  deep: string;
};
