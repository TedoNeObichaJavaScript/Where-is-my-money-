import { aurora, canvas, ink, semantic, type AccentRamp } from './palette';

/**
 * Semantic color tokens. Built from the canvas/ink base plus a swappable accent
 * ramp (Aurora / Prism / Nebula), so theme switching only changes the accents.
 */
export function buildColors(accent: AccentRamp) {
  return {
    bg: canvas.bg,
    surface: canvas.surface,
    card: canvas.card,
    cardGlass: canvas.cardGlass,
    border: canvas.border,
    borderStrong: canvas.borderStrong,

    text: ink.text,
    textMuted: ink.textMuted,
    textFaint: ink.textFaint,
    onAccent: '#06121A',

    accent: accent.accent,
    accentBright: accent.accentBright,
    accentBlue: accent.accentBlue,
    deep: accent.deep,

    income: semantic.income,
    expense: semantic.expense,
    warning: semantic.warning,
    danger: semantic.danger,
  } as const;
}

export type Colors = ReturnType<typeof buildColors>;

/** Default token set. */
export const colors = buildColors(aurora);
