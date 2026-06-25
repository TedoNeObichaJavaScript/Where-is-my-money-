/**
 * Type scale. Display = Space Grotesk (geometric, technical), Body = Inter.
 * Money figures use tabular variant so digits don't jitter while animating.
 */
export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  mono: 'SpaceGrotesk_500Medium', // tabular money figures
} as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 48, lineHeight: 52, letterSpacing: 0.5 },
  title: { fontFamily: fonts.displayMedium, fontSize: 28, lineHeight: 34 },
  heading: { fontFamily: fonts.bodySemibold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 22 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 22 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  micro: { fontFamily: fonts.bodyMedium, fontSize: 11, lineHeight: 14, letterSpacing: 0.5 },
} as const;

export type TypeStyle = keyof typeof type;
