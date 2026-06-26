import { accent } from './palette';
import { glass, glassRaised } from './glass';
import { gradients, orbs } from './gradients';
import { duration, easing, press, spring } from './motion';
import { radius } from './radius';
import { depth, depthSm, glow, glowLayers } from './shadows';
import { space } from './space';
import { buildColors } from './tokens';
import { type } from './typography';

/** Single refined-dark theme. (Type kept for API compatibility.) */
export type ThemeName = 'refined';

export function makeTheme(_name: ThemeName = 'refined') {
  return {
    name: 'refined' as const,
    colors: buildColors(accent),
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
export const defaultTheme = makeTheme();
