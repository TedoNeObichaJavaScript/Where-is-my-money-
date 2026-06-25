import { canvas } from './palette';
import { radius } from './radius';

/**
 * Glass surface recipe. Use with <BlurView intensity={blur} tint="dark"> plus an
 * overlay View carrying `fill` + `border`. Glass only reads over a busy backdrop
 * (gradient / nebula orbs) — never over flat color.
 */
export const glass = {
  fill: canvas.cardGlass, // rgba(17,25,40,0.55)
  blurIntensity: 30, // expo-blur scale (~12px css)
  saturation: 1.6,
  border: canvas.border, // rgba(255,255,255,0.12)
  borderWidth: 1,
  radius: radius.base,
} as const;

/** Stronger glass for modals/sheets that sit closer to the user. */
export const glassRaised = {
  ...glass,
  fill: 'rgba(20,28,46,0.7)',
  blurIntensity: 45,
  border: canvas.borderStrong,
  radius: radius.lg,
} as const;
