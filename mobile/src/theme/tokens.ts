import { accent, canvas, ink, semantic, type AccentRamp } from './palette';

/** Semantic color tokens for the refined-dark theme. */
export function buildColors(ramp: AccentRamp = accent) {
  return {
    bg: canvas.bg,
    surface: canvas.surface,
    surfaceAlt: canvas.surfaceAlt,
    card: canvas.card,
    cardGlass: canvas.cardGlass,
    border: canvas.border,
    borderStrong: canvas.borderStrong,

    text: ink.text,
    textMuted: ink.textMuted,
    textFaint: ink.textFaint,
    onAccent: '#0F1216',

    accent: ramp.accent,
    accentBright: ramp.accentBright,
    accentBlue: ramp.accentBlue,
    deep: ramp.deep,

    income: semantic.income,
    expense: semantic.expense,
    warning: semantic.warning,
    danger: semantic.danger,
  } as const;
}

export type Colors = ReturnType<typeof buildColors>;
export const colors = buildColors();
