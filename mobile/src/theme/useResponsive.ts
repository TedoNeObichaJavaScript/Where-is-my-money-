import { useWindowDimensions } from 'react-native';

export type Breakpoint = 'sm' | 'md' | 'lg';

/**
 * Reactive layout info. Breakpoints: sm < 360, md < 600, lg >= 600 (tablet).
 * Recomputes on rotation / split-view via useWindowDimensions.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const bp: Breakpoint = width >= 600 ? 'lg' : width >= 360 ? 'md' : 'sm';
  return {
    width,
    height,
    isLandscape,
    isTablet: width >= 600,
    bp,
    /** pick a value per breakpoint, falling back to the nearest smaller. */
    select<T>(opts: { sm: T; md?: T; lg?: T }): T {
      if (bp === 'lg') return opts.lg ?? opts.md ?? opts.sm;
      if (bp === 'md') return opts.md ?? opts.sm;
      return opts.sm;
    },
  };
}
