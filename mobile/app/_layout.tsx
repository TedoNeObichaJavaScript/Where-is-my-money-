import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { applySystemBars } from '@/theme/systemBars';
import { AppBackground } from '@/components/background/AppBackground';
import { BootGate } from '@/boot/BootGate';
import { LockGate } from '@/security/LockGate';
import '@/i18n';

/**
 * Provider shell: gesture root → safe area → theme. The flat background sits
 * sits behind every route; BootGate holds render until storage + fonts are ready.
 * Add/Edit are presented as modals over the tab shell.
 */
export default function RootLayout() {
  useEffect(() => {
    void applySystemBars();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0F1216' }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="light" />
          <AppBackground />
          <BootGate>
            <LockGate>
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
                <Stack.Screen
                  name="manage"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                  name="recurring"
                  options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
                />
              </Stack>
            </LockGate>
          </BootGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
