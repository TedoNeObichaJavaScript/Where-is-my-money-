import { Dimensions, PixelRatio } from 'react-native';

/**
 * Responsive scaling against a 375pt guideline (iPhone SE/13 mini width).
 * Clamped so text/space never balloon on tablets or shrink to nothing.
 */
const GUIDELINE_WIDTH = 375;
const GUIDELINE_HEIGHT = 812;

const { width, height } = Dimensions.get('window');
const shortest = Math.min(width, height);
const longest = Math.max(width, height);

/** Horizontal scale, clamped to [0.85, 1.3]. */
export function scale(size: number): number {
  const factor = clamp(shortest / GUIDELINE_WIDTH, 0.85, 1.3);
  return round(size * factor);
}

/** Vertical scale, clamped. */
export function vScale(size: number): number {
  const factor = clamp(longest / GUIDELINE_HEIGHT, 0.85, 1.3);
  return round(size * factor);
}

/** Moderate scale — softer growth for font sizes (default factor 0.5). */
export function ms(size: number, factor = 0.5): number {
  return round(size + (scale(size) - size) * factor);
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function round(n: number): number {
  return PixelRatio.roundToNearestPixel(n);
}
