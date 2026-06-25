import { useEffect, useRef, useState } from 'react';
import { type TextStyle } from 'react-native';
import { Text } from './Text';
import { Money } from '@/domain/Money';

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'bodyMedium' | 'caption';

/**
 * Count-up money ticker. Tweens on the JS thread (600ms ease-out) so Intl
 * formatting stays available each frame — smooth enough for a single hero number.
 */
export function AnimatedNumber({
  valueMinor,
  currency,
  locale = 'en',
  variant = 'hero',
  color,
  style,
}: {
  valueMinor: number;
  currency: string;
  locale?: string;
  variant?: Variant;
  color?: string;
  style?: TextStyle;
}) {
  const [display, setDisplay] = useState(valueMinor);
  const fromRef = useRef(valueMinor);

  useEffect(() => {
    const from = fromRef.current;
    const to = valueMinor;
    if (from === to) return;
    const dur = 600;
    const t0 = Date.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [valueMinor]);

  return (
    <Text variant={variant} color={color} style={style}>
      {Money.format(display, currency, locale)}
    </Text>
  );
}
