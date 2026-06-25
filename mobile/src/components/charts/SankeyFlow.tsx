import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Text } from '@/components/ui';
import { Money } from '@/domain/Money';
import { useTheme } from '@/theme/ThemeProvider';

export type FlowNode = { label: string; color: string; value: number };

/**
 * Simplified cash-flow (Sankey-style) diagram: income on the left flows as ribbons
 * into expense categories + remaining "saved" on the right. Drawn with svg bezier
 * ribbons — the standout analytics differentiator (Monarch-style).
 */
export function SankeyFlow({
  incomeLabel,
  savedLabel,
  income,
  outflows,
  currency,
  locale = 'en',
  width = 320,
  height = 200,
}: {
  incomeLabel: string;
  savedLabel: string;
  income: number;
  outflows: FlowNode[];
  currency: string;
  locale?: string;
  width?: number;
  height?: number;
}) {
  const t = useTheme();
  const expense = outflows.reduce((s, o) => s + o.value, 0);
  const saved = Math.max(0, income - expense);
  const nodes: FlowNode[] =
    saved > 0
      ? [...outflows, { label: savedLabel, color: t.colors.accent, value: saved }]
      : outflows;
  const total = nodes.reduce((s, n) => s + n.value, 0) || 1;

  const nw = 12;
  const leftX = 0;
  const rightX = width - nw;
  const midX = width / 2;
  const gap = 3;
  const usable = height - gap * (nodes.length - 1);

  let cum = 0;
  const bands = nodes.map((n) => {
    const h = (n.value / total) * usable;
    const y = cum;
    cum += h + gap;
    return { ...n, y, h };
  });

  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* income source node (left, full height) */}
        <Rect
          x={leftX}
          y={0}
          width={nw}
          height={height}
          rx={4}
          fill={t.colors.accentBlue}
          opacity={0.9}
        />
        {bands.map((b, i) => {
          const ly0 = b.y;
          const ly1 = b.y + b.h;
          // map left slice to the same vertical extent (parallel band)
          const ry0 = b.y;
          const ry1 = b.y + b.h;
          const d = `M ${leftX + nw} ${ly0} C ${midX} ${ly0}, ${midX} ${ry0}, ${rightX} ${ry0} L ${rightX} ${ry1} C ${midX} ${ry1}, ${midX} ${ly1}, ${leftX + nw} ${ly1} Z`;
          return <Path key={i} d={d} fill={b.color} opacity={0.35} />;
        })}
        {bands.map((b, i) => (
          <Rect key={`n${i}`} x={rightX} y={b.y} width={nw} height={b.h} rx={3} fill={b.color} />
        ))}
      </Svg>
      <View style={{ marginTop: 10, gap: 4 }}>
        <Text variant="caption" color={t.colors.textMuted}>
          {incomeLabel}: {Money.format(income, currency, locale)}
        </Text>
      </View>
    </View>
  );
}
