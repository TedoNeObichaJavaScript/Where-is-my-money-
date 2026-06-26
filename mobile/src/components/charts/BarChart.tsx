import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '@/theme/ThemeProvider';

/** Daily spending bars with an accent gradient fill. Values in minor units. */
export function BarChart({ values, height = 120 }: { values: number[]; height?: number }) {
  const t = useTheme();
  const max = Math.max(1, ...values);
  const n = values.length || 1;
  const gap = 3;
  const width = 320;
  const barW = Math.max(2, (width - gap * (n - 1)) / n);

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={t.colors.accentBright} />
            <Stop offset="1" stopColor={t.colors.accentBlue} />
          </LinearGradient>
        </Defs>
        {values.map((v, i) => {
          const h = (v / max) * (height - 4);
          return (
            <Rect
              key={i}
              x={i * (barW + gap)}
              y={height - h}
              width={barW}
              height={Math.max(1, h)}
              rx={Math.min(barW / 2, 3)}
              fill={v > 0 ? 'url(#bar)' : t.colors.surface}
              opacity={v > 0 ? 0.95 : 0.5}
            />
          );
        })}
      </Svg>
    </View>
  );
}
