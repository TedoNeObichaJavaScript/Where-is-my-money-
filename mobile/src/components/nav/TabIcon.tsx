import { ChartColumn, House, Receipt, User } from 'lucide-react-native';

export type TabName = 'home' | 'history' | 'stats' | 'settings';

const ICONS = {
  home: House,
  history: Receipt,
  stats: ChartColumn,
  settings: User,
} as const;

/** Clean Lucide tab glyphs. */
export function TabIcon({
  name,
  color,
  size = 23,
}: {
  name: TabName;
  color: string;
  size?: number;
}) {
  const Icon = ICONS[name];
  return <Icon size={size} color={color} strokeWidth={2} />;
}
