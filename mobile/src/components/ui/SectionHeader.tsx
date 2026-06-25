import { StyleSheet, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Row title with an optional trailing action ("See all"). */
export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <Text variant="heading" color={t.colors.text}>
        {title}
      </Text>
      {actionLabel ? (
        <PressableScale onPress={onAction} hitSlop={8}>
          <Text variant="caption" color={t.colors.accentBlue}>
            {actionLabel}
          </Text>
        </PressableScale>
      ) : null}
    </View>
  );
}

/** Hairline divider. */
export function Divider() {
  const t = useTheme();
  return <View style={[styles.divider, { backgroundColor: t.colors.border }]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  divider: { height: StyleSheet.hairlineWidth, width: '100%' },
});
