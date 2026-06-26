import { useWindowDimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Paint,
  Blur,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia';
import { orbs } from '@/theme/gradients';

/** Append two hex bytes of alpha to a #RRGGBB color. */
function withAlpha(hex: string, a: number): string {
  const byte = Math.round(a * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${byte}`;
}

/**
 * Blurred radial "light leaks" painted behind glass. GPU-rendered via Skia so the
 * heavy blur stays at 60fps. Static for now; the slow drift animation lands in task 99.
 */
export function NebulaOrbs() {
  const { width, height } = useWindowDimensions();
  const max = Math.max(width, height);

  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width, height }}>
      <Group
        layer={
          <Paint>
            <Blur blur={70} />
          </Paint>
        }
      >
        {orbs.map((o, i) => {
          const cx = o.cx * width;
          const cy = o.cy * height;
          const r = o.size * max * 0.6;
          return (
            <Circle key={i} cx={cx} cy={cy} r={r} opacity={o.opacity}>
              <RadialGradient c={vec(cx, cy)} r={r} colors={[o.color, withAlpha(o.color, 0)]} />
            </Circle>
          );
        })}
      </Group>
    </Canvas>
  );
}
