import { useLocalSearchParams } from 'expo-router';
import { AddScreen } from '@/features/add/AddScreen';

/** Edit-transaction modal. Loads by id. */
export default function EditRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const editId = Number(id);
  return <AddScreen editId={Number.isFinite(editId) ? editId : undefined} />;
}
