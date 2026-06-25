import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { applySystemBars } from '@/theme/systemBars';
import { CosmicBackground } from '@/components/background/CosmicBackground';
import { BootGate } from '@/boot/BootGate';

/**
 * Provider shell: gesture root → safe area → theme. The cosmic background sits
 * behind every route; BootGate holds render until storage + fonts are ready.
 * Add/Edit are presented as modals over the tab shell.
 */
export default function RootLayout() {
  useEffect(() => {
    void applySystemBars();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A14' }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="light" />
          <CosmicBackground />
          <BootGate>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="add"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </Stack>
          </BootGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
