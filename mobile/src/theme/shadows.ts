/**
 * Refined-dark shadows: soft, subtle depth only. The neon-glow helpers are kept as
 * no-ops (returning a gentle depth shadow) so existing call sites degrade cleanly.
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
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.22,
  shadowRadius: 12,
  elevation: 4,
};

export const depthSm: Shadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.16,
  shadowRadius: 6,
  elevation: 2,
};
