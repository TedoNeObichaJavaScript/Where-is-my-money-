import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { authenticate } from './biometric';
import { NeonButton, Text } from '@/components/ui';
import { settings } from '@/storage/settings';

/** If biometric lock is enabled, requires authentication before revealing the app. */
export function LockGate({ children }: { children: ReactNode }) {
  const enabled = settings.getBiometricEnabled();
  const [unlocked, setUnlocked] = useState(!enabled);

  const tryUnlock = useCallback(async () => {
    const ok = await authenticate();
    if (ok) setUnlocked(true);
  }, []);

  useEffect(() => {
    if (!unlocked) void tryUnlock();
  }, [unlocked, tryUnlock]);

  if (unlocked) return <>{children}</>;

  return (
    <View style={styles.root}>
      <Text variant="hero" color="#E2F3FF" style={styles.brand}>
        Парите
      </Text>
      <Text variant="body" color="#8A93B2" style={styles.sub}>
        Locked. Authenticate to continue.
      </Text>
      <NeonButton label="Unlock" onPress={() => void tryUnlock()} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  brand: { textShadowColor: 'rgba(94,141,255,0.6)', textShadowRadius: 18 },
  sub: { marginBottom: 24 },
  btn: { alignSelf: 'stretch' },
});
