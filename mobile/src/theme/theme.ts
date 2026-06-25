import { aurora, nebula, prism, type AccentRamp } from './palette';
import { glass, glassRaised } from './glass';
import { gradients, orbs } from './gradients';
import { duration, easing, press, spring } from './motion';
import { radius } from './radius';
import { depth, depthSm, glow, glowLayers } from './shadows';
import { space } from './space';
import { buildColors } from './tokens';
import { type } from './typography';

export type ThemeName = 'aurora' | 'prism' | 'nebula';

const ramps: Record<ThemeName, AccentRamp> = {
  aurora,
  prism,
  nebula,
};

/** Compose the full theme object for a given accent variant. */
export function makeTheme(name: ThemeName) {
  return {
    name,
    colors: buildColors(ramps[name]),
    space,
    radius,
    type,
    glass,
    glassRaised,
    gradients,
    orbs,
    shadow: { depth, depthSm, glow, glowLayers },
    motion: { duration, easing, spring, press },
  } as const;
}

export type Theme = ReturnType<typeof makeTheme>;

export const defaultTheme = makeTheme('aurora');
