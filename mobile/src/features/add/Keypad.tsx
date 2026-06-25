import { StyleSheet, View } from 'react-native';
import { PressableScale, Text } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type Key = { label: string; value: string; op?: boolean };

const KEYS: Key[] = [
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '÷', value: '÷', op: true },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '×', value: '×', op: true },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '−', value: '-', op: true },
  { label: '.', value: '.' },
  { label: '0', value: '0' },
  { label: '⌫', value: '⌫' },
  { label: '+', value: '+', op: true },
];

/** 4×4 calculator keypad. Operators tinted accent; every key springs on press. */
export function Keypad({ onKey }: { onKey: (value: string) => void }) {
  const t = useTheme();
  return (
    <View style={styles.grid}>
      {KEYS.map((k) => (
        <PressableScale
          key={k.value}
          style={[styles.key, { backgroundColor: t.colors.surface, borderRadius: t.radius.lg }]}
          onPress={() => {
            void haptics.tap();
            onKey(k.value);
          }}
        >
          <Text variant="title" color={k.op ? t.colors.accent : t.colors.text}>
            {k.label}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  key: {
    width: '23.5%',
    aspectRatio: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
