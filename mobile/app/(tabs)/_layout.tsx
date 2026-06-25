import { Tabs } from 'expo-router';
import { TabBar } from '@/components/nav/TabBar';

/** Tab shell with the custom holographic glass tab bar. */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="analytics" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
