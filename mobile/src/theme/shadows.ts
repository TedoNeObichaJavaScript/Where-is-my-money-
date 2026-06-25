import { Platform } from 'react-native';

/**
 * RN allows only one shadow per view. `depth` is the cross-platform card shadow.
 * Neon halos can't be done with a single shadow — `glowLayers` returns specs for
 * stacked absolutely-positioned glow views (or a Skia blur) behind the hero element.
 */

type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export const depth: Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.36,
  shadowRadius: 16,
  elevation: 8,
};

export const depthSm: Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.28,
  shadowRadius: 8,
  elevation: 4,
};

/** A single-shadow approximation of a neon glow (good enough for small chips). */
export function glow(color: string, radius = 16): Shadow {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Platform.OS === 'ios' ? 0.9 : 1,
    shadowRadius: radius,
    elevation: 12,
  };
}

/** Layered halo for hero number / primary CTA — render as stacked glow views. */
export function glowLayers(color: string): { radius: number; opacity: number }[] {
  return [
    { radius: 4, opacity: 0.9 },
    { radius: 12, opacity: 0.5 },
    { radius: 28, opacity: 0.25 },
  ].map((l) => ({ ...l }));
}
