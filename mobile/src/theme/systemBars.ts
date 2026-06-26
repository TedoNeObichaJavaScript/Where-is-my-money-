import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { canvas } from './palette';

/**
 * Paints the OS bars to match the app background so there are no light seams at
 * the screen edges. Call once at boot.
 */
export async function applySystemBars(): Promise<void> {
  await SystemUI.setBackgroundColorAsync(canvas.bg);
  if (Platform.OS === 'android') {
    try {
      await NavigationBar.setBackgroundColorAsync(canvas.bg);
      await NavigationBar.setButtonStyleAsync('light');
    } catch {
      // edge-to-edge devices may reject explicit nav-bar color — safe to ignore.
    }
  }
}
