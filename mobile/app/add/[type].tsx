import { useLocalSearchParams } from 'expo-router';
import { ScreenPlaceholder } from '@/components/layout/ScreenPlaceholder';
import { isTxnType } from '@/domain/enums';

/** Quick-add modal. `type` = expense | income. Built out in Phase 7 (136–155). */
export default function AddRoute() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const t = (type ?? 'expense').toUpperCase();
  const label = isTxnType(t) ? (t === 'INCOME' ? 'Add Income' : 'Add Expense') : 'Add';
  return <ScreenPlaceholder title={label} />;
}
