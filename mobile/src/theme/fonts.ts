import {
  useFonts,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';

/**
 * Loads the app fonts (Space Grotesk + Inter). Call once at app root; gate the splash
 * screen on `loaded` so text never flashes a fallback font.
 */
export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  return loaded;
}
