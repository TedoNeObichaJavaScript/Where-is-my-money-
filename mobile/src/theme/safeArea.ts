import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';
import { space } from './space';

export { useSafeAreaInsets };

/**
 * Screen padding that respects notch / Dynamic Island / home indicator.
 * Never hardcode status-bar or notch heights — insets already account for them.
 */
export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  return {
    insets,
    /** content padding: gutters on the sides, safe top/bottom. */
    padding: {
      paddingTop: insets.top + space.sm,
      paddingBottom: insets.bottom + space.sm,
      paddingHorizontal: space.base,
    },
    /** scroll content padding (lets content scroll under bars). */
    scroll: (extraBottom = 0): { paddingBottom: number; paddingHorizontal: number } => ({
      paddingBottom: insets.bottom + space.lg + extraBottom,
      paddingHorizontal: space.base,
    }),
  };
}

export type { EdgeInsets };
