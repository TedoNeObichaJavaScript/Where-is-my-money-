import { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useBootstrap } from './useBootstrap';
import { BootScreen } from './BootScreen';
import { useAppFonts } from '@/theme/fonts';

/** Blocks render until fonts + the encrypted DB are ready; shows errors clearly. */
export function BootGate({ children }: { children: ReactNode }) {
  const fontsLoaded = useAppFonts();
  const { ready, error } = useBootstrap();

  if (error) {
    return (
      <View style={styles.err}>
        <Text style={styles.title}>Can’t open secure storage</Text>
        <Text style={styles.msg}>{error.message}</Text>
      </View>
    );
  }
  if (!ready || !fontsLoaded) return <BootScreen />;
  return <>{children}</>;
}

const styles = StyleSheet.create({
  err: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#0F1216',
  },
  title: { color: '#FF5C7A', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  msg: { color: '#8A93B2', fontSize: 14, textAlign: 'center' },
});
