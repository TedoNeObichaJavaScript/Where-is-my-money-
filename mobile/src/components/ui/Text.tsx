import { Text as RNText, type TextProps } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type Variant = 'hero' | 'title' | 'heading' | 'body' | 'bodyMedium' | 'caption' | 'micro';

/** Themed text. `variant` pulls font/size from the type scale; `color` defaults to text. */
export function Text({
  variant = 'body',
  color,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string }) {
  const t = useTheme();
  return <RNText {...rest} style={[t.type[variant], { color: color ?? t.colors.text }, style]} />;
}
