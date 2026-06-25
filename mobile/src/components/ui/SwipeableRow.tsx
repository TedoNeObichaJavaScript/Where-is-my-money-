import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Svg, { Path } from 'react-native-svg';
import { Text } from './Text';
import { haptics } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

/** Swipe-left to reveal a delete action; fires onDelete on full open. */
export function SwipeableRow({
  children,
  onDelete,
}: {
  children: ReactNode;
  onDelete: () => void;
}) {
  const t = useTheme();
  const renderRight = () => (
    <View style={[styles.action, { backgroundColor: `${t.colors.danger}22` }]}>
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13"
          stroke={t.colors.danger}
          strokeWidth={1.8}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
      <Text variant="micro" color={t.colors.danger}>
        Delete
      </Text>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={renderRight}
      onSwipeableWillOpen={() => void haptics.warn()}
      onSwipeableOpen={onDelete}
      rightThreshold={48}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginVertical: 4,
    borderRadius: 16,
  },
});
