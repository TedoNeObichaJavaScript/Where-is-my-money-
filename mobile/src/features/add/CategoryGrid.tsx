import { StyleSheet, View } from 'react-native';
import { PressableScale, Text } from '@/components/ui';
import { IconTile } from '@/components/icons/IconTile';
import { categoryIcon } from '@/components/icons/catalog';
import { resolveName } from '@/i18n/labels';
import { useTheme } from '@/theme/ThemeProvider';
import type { Category } from '@/domain/models';

/** Wrapping grid of category chips. Selected one gets an accent ring. */
export function CategoryGrid({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const t = useTheme();
  return (
    <View style={styles.grid}>
      {categories.map((c) => {
        const selected = c.id === selectedId;
        return (
          <PressableScale
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[
              styles.item,
              {
                borderRadius: t.radius.base,
                borderColor: selected ? c.colorHex : 'transparent',
                backgroundColor: selected ? `${c.colorHex}1A` : t.colors.surface,
              },
            ]}
          >
            <IconTile icon={categoryIcon(c.nameKey, c.kind)} color={c.colorHex} size={34} />
            <Text
              variant="micro"
              color={selected ? t.colors.text : t.colors.textMuted}
              numberOfLines={1}
            >
              {resolveName(c.nameKey, c.name)}
            </Text>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  item: {
    width: '23.5%',
    paddingVertical: 12,
    gap: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
});
