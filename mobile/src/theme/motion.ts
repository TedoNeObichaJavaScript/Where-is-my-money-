import { Easing } from 'react-native-reanimated';

/** Durations (ms). */
export const duration = {
  fast: 120,
  base: 220,
  slow: 360,
  countUp: 600,
} as const;

/** Easings. */
export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  out: Easing.out(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
} as const;

/** Spring presets for reanimated `withSpring`. */
export const spring = {
  default: { damping: 18, stiffness: 180, mass: 1 },
  gentle: { damping: 22, stiffness: 120, mass: 1 },
  snappy: { damping: 16, stiffness: 260, mass: 0.9 },
} as const;

/** Press feedback. */
export const press = {
  scale: 0.96,
  spring: spring.snappy,
} as const;
