import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/theme/ThemeProvider';
import { TabIcon, type TabName } from './TabIcon';
import { AddButton } from './AddButton';

const ICONS: Record<string, TabName> = {
  index: 'home',
  history: 'history',
  analytics: 'stats',
  settings: 'settings',
};
const LABELS: Record<string, string> = {
  index: 'Home',
  history: 'History',
  analytics: 'Stats',
  settings: 'Profile',
};

/** Clean solid tab bar with the accent Add action floating in the middle slot. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const routes = state.routes.filter((r) => ICONS[r.name]);
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const item = (routeName: string, routeKey: string, index: number) => {
    const focused = state.index === index;
    const color = focused ? t.colors.accent : t.colors.textMuted;
    return (
      <Pressable
        key={routeKey}
        style={styles.item}
        onPress={() => navigation.navigate(routeName)}
        accessibilityRole="button"
        accessibilityState={{ selected: focused }}
      >
        <TabIcon name={ICONS[routeName] ?? 'home'} color={color} />
        <Text style={[styles.label, { color }]}>{LABELS[routeName] ?? ''}</Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: insets.bottom,
          backgroundColor: t.colors.surfaceAlt,
          borderTopColor: t.colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        {left.map((r) => item(r.name, r.key, state.routes.indexOf(r)))}
        <AddButton />
        {right.map((r) => item(r.name, r.key, state.routes.indexOf(r)))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  item: { alignItems: 'center', gap: 4, width: 60, paddingTop: 2 },
  label: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
