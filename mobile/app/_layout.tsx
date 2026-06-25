import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * Root layout. Provider shell only — feature providers (theme, db, i18n)
 * are layered in as their phases land (see docs/RN_MIGRATION.md tasks 81–95).
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#0A0A14' }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0A0A14' },
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
