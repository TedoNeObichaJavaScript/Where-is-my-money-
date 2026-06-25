import Svg, { Circle, Path } from 'react-native-svg';

export type TabName = 'home' | 'history' | 'stats' | 'settings';

/** Thin-line cosmic glyphs. Color is driven by focus state in the tab bar. */
export function TabIcon({ name, color, size = 24 }: { name: TabName; color: string; size?: number }) {
  const stroke = color;
  const common = { stroke, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3 11l9-8 9 8" {...common} />
          <Path d="M5 10v10h14V10" {...common} />
        </>
      )}
      {name === 'history' && (
        <>
          <Path d="M4 6h16M4 12h16M4 18h10" {...common} />
        </>
      )}
      {name === 'stats' && (
        <>
          <Path d="M4 19V9M10 19V5M16 19v-7M20 19v-3" {...common} />
        </>
      )}
      {name === 'settings' && (
        <>
          <Circle cx={12} cy={8} r={3.2} {...common} />
          <Path d="M5 20c0-3.5 3-5 7-5s7 1.5 7 5" {...common} />
        </>
      )}
    </Svg>
  );
}
