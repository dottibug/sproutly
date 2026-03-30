import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Category, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import { colors, seedTypeColorMap } from '../../styles/theme';

// SeedBadges.tsx: Colored badges for seed type, exposure, and if a see is in the user's collection.

type SeedBadgesProps = {
  readonly category: Category;
  readonly exposure: Exposure;
  readonly inUserCollection: boolean;
};

export default function SeedBadges({ category, exposure, inUserCollection }: SeedBadgesProps) {
  return (
    <View style={styles.chips}>
      {inUserCollection && (
        <Pressable style={[styles.chipStyle, { backgroundColor: colors.dusk }]}>
          <Text style={styles.chipText}>In My Seeds</Text>
        </Pressable>
      )}
      <Pressable style={[styles.chipStyle, { backgroundColor: seedTypeColorMap[category] }]}>
        <Text style={styles.chipText}>{category}</Text>
      </Pressable>
      <Pressable style={[styles.chipStyle, { backgroundColor: colors.chocolate }]}>
        <Text style={styles.chipText}>{exposure}</Text>
      </Pressable>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  chips: {
    alignItems: 'center',
    borderColor: '#ccc',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipStyle: {
    backgroundColor: colors.dusk,
    opacity: 0.8,
    borderRadius: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
});
