/**
 * Gradient recipes for expo-linear-gradient and radial orb layers.
 * `coords` use the LinearGradient start/end convention (0..1).
 * Add extra stops to fight banding on dark gradients.
 */

export const gradients = {
  aurora: {
    colors: ['#025385', '#04E2B7', '#0EF3C5', '#5B8DFF'] as const,
    locations: [0, 0.45, 0.7, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }, // ~120deg
  },
  hero: {
    colors: ['#0A0A14', '#1A0A2E', '#2D1B4E'] as const,
    locations: [0, 0.5, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 0.4, y: 1 }, // ~160deg
  },
  iridescent: {
    colors: ['#FF6AD5', '#7AF5FF', '#5B8DFF', '#FF9DFB'] as const,
    locations: [0, 0.4, 0.7, 1] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

/** Blurred radial orbs painted behind glass for "light leaks". */
export const orbs = [
  { color: '#711C91', cx: 0.3, cy: 0.2, size: 0.9, opacity: 0.55 },
  { color: '#EA00D9', cx: 0.75, cy: 0.7, size: 0.8, opacity: 0.45 },
  { color: '#04E2B7', cx: 0.85, cy: 0.1, size: 0.6, opacity: 0.3 },
] as const;

export type GradientKey = keyof typeof gradients;
