import { useLocalSearchParams } from 'expo-router';
import { AddScreen } from '@/features/add/AddScreen';
import { isTxnType } from '@/domain/enums';

/** Quick-add modal. `type` = expense | income. */
export default function AddRoute() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const upper = (type ?? 'expense').toUpperCase();
  return <AddScreen type={isTxnType(upper) ? upper : 'EXPENSE'} />;
}
