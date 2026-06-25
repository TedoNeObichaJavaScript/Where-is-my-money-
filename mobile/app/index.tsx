import { Redirect } from 'expo-router';

/** Root route → the tab shell. (Boot gating happens in _layout.) */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
