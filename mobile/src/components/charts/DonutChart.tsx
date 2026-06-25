import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Text } from '@/components/ui';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

export type DonutSlice = { id: number; value: number; color: string; label: string };

/**
 * Category donut drawn with stroke-dasharray arcs (no chart lib). Center shows
 * the total. Tap a slice via onPressSlice (segments are full-ring circles layered
 * with offsets, so taps are handled by the legend in the parent).
 */
export function DonutChart({
  slices,
  totalMinor,
  currency,
  locale = 'en',
  size = 200,
  stroke = 26,
}: {
  slices: DonutSlice[];
  totalMinor: number;
  currency: string;
  locale?: string;
  size?: number;
  stroke?: number;
}) {
  const t = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sum = slices.reduce((s, x) => s + x.value, 0) || 1;

  let offset = 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={t.colors.surface}
            strokeWidth={stroke}
            fill="none"
          />
          {slices.map((s) => {
            const frac = s.value / sum;
            const dash = frac * c;
            const el = (
              <Circle
                key={s.id}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={s.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                fill="none"
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </G>
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text variant="caption" color={t.colors.textMuted}>
          Spent
        </Text>
        <Text variant="heading" color={t.colors.text}>
          {Money.format(totalMinor, currency, locale)}
        </Text>
      </View>
    </View>
  );
}
