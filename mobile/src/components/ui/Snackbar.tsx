import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { GlassCard } from './GlassCard';
import { useTheme } from '@/theme/ThemeProvider';

/** Transient bottom toast with one action (used for undo-delete). */
export function Snackbar({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Animated.View
      entering={SlideInDown.springify().damping(18)}
      exiting={SlideOutDown}
      style={[styles.wrap, { bottom: insets.bottom + 96 }]}
      pointerEvents="box-none"
    >
      <GlassCard raised style={styles.card}>
        <View style={styles.row}>
          <Text variant="bodyMedium" color={t.colors.text} style={{ flex: 1 }}>
            {message}
          </Text>
          {actionLabel ? (
            <PressableScale onPress={onAction} hitSlop={10}>
              <Text variant="bodyMedium" color={t.colors.accent}>
                {actionLabel}
              </Text>
            </PressableScale>
          ) : null}
        </View>
      </GlassCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16 },
  card: { borderRadius: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
