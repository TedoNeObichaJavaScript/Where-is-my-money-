import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

/**
 * Month calendar heatmap: one cell per day, colored by spend intensity.
 * `values` is indexed by day-of-month (0-based). `firstWeekday` is the weekday
 * of day 1 (0=Sun..6=Sat) to align the grid.
 */
export function CalendarHeatmap({
  values,
  firstWeekday,
  color,
  width = 320,
}: {
  values: number[];
  firstWeekday: number;
  color: string;
  width?: number;
}) {
  const t = useTheme();
  const cols = 7;
  const gap = 4;
  const cell = (width - gap * (cols - 1)) / cols;
  const max = Math.max(1, ...values);
  const rows = Math.ceil((firstWeekday + values.length) / cols);
  const height = rows * cell + (rows - 1) * gap;

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {values.map((v, day) => {
          const idx = firstWeekday + day;
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          const intensity = v > 0 ? 0.15 + (v / max) * 0.85 : 0;
          return (
            <Rect
              key={day}
              x={col * (cell + gap)}
              y={row * (cell + gap)}
              width={cell}
              height={cell}
              rx={5}
              fill={v > 0 ? color : t.colors.surface}
              opacity={v > 0 ? intensity : 0.5}
            />
          );
        })}
      </Svg>
    </View>
  );
}
