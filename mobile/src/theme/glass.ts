import { canvas } from './palette';
import { radius } from './radius';

/**
 * "Glass" is now a clean bordered card (no blur, no nebula). Kept under the same
 * name so existing imports keep working after the refined-dark redesign.
 */
export const glass = {
  fill: canvas.surface,
  blurIntensity: 0, // no blur
  saturation: 1,
  border: canvas.border,
  borderWidth: 1,
  radius: radius.base,
} as const;

export const glassRaised = {
  ...glass,
  fill: canvas.surface,
  border: canvas.borderStrong,
  radius: radius.lg,
} as const;
