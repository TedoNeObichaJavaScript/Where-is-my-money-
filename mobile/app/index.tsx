import { StyleSheet, Text, View } from 'react-native';

/**
 * Boot screen placeholder. Replaced by the (tabs) shell in Phase 4 (task 86),
 * gated behind DB-ready + biometric unlock.
 */
export default function Boot() {
  return (
    <View style={styles.root}>
      <Text style={styles.brand}>Парите</Text>
      <Text style={styles.sub}>Where Is My Money?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0A14',
    gap: 8,
  },
  brand: {
    color: '#E2F3FF',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 1,
    textShadowColor: 'rgba(94,141,255,0.6)',
    textShadowRadius: 18,
  },
  sub: {
    color: '#8A93B2',
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
