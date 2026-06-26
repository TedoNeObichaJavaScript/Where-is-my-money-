import { accent } from './palette';
import { glass, glassRaised } from './glass';
import { duration, easing, press, spring } from './motion';
import { radius } from './radius';
import { depth, depthSm } from './shadows';
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
    shadow: { depth, depthSm },
    motion: { duration, easing, spring, press },
  } as const;
}

export type Theme = ReturnType<typeof makeTheme>;
export const defaultTheme = makeTheme();
