import { useLocalSearchParams } from 'expo-router';
import { ScreenPlaceholder } from '@/components/layout/ScreenPlaceholder';

/** Edit-transaction modal. Loads by id; built out in Phase 7 (task 149). */
export default function EditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ScreenPlaceholder title={`Edit #${id ?? ''}`} />;
}
