import { Stack } from 'expo-router';

/** Modal stack for transaction entry/editing. */
export default function AddLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: 'transparent' } }}
    />
  );
}
