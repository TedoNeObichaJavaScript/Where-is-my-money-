import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { PressableScale } from './PressableScale';
import { Text } from './Text';
import { useTheme } from '@/theme/ThemeProvider';

/** Themed date field. Android opens the native dialog; iOS reveals an inline spinner. */
export function DatePickerField({
  label,
  value,
  onChange,
  locale = 'en',
}: {
  label: string;
  value: number; // epoch millis
  onChange: (millis: number) => void;
  locale?: string;
}) {
  const t = useTheme();
  const [iosOpen, setIosOpen] = useState(false);
  const date = new Date(value);
  const formatted = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        mode: 'date',
        onChange: (_e, d) => d && onChange(d.getTime()),
      });
    } else {
      setIosOpen((v) => !v);
    }
  };

  return (
    <View>
      <PressableScale
        onPress={open}
        style={[styles.field, { borderColor: t.colors.border, borderRadius: t.radius.md }]}
      >
        <Text variant="caption" color={t.colors.textMuted}>
          {label}
        </Text>
        <Text variant="bodyMedium" color={t.colors.text}>
          {formatted}
        </Text>
      </PressableScale>
      {iosOpen && Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          themeVariant="dark"
          onChange={(_e, d) => d && onChange(d.getTime())}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
