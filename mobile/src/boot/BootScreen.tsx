import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

/** Shown while fonts load + the encrypted DB opens. Matches the splash. */
export function BootScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Парите</Text>
      <ActivityIndicator color="#04E2B7" style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F1216' },
  brand: {
    color: '#E2F3FF',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(94,141,255,0.6)',
    textShadowRadius: 18,
  },
});
