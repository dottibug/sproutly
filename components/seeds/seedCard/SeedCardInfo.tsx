import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Category } from '../../../state/userSeeds/seeds/seedInfoTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { IconButton } from '../../uiComponentBarrel';
import Heading from '../../ui/Heading';
import { colors } from '../../../styles/theme';

// SeedCardInfo.tsx: Displays information about a seed on the SeedCard.tsx component

type SeedCardInfoProps = {
  readonly variety: string;
  readonly plant: string;
  readonly beanType: string | null;
  readonly category: Category;
  readonly cardType: 'user' | 'browse';
  readonly inUserCollection?: boolean;
  readonly onViewSeed: () => void;
  readonly onAddToCollection: () => void;
  readonly onFavoriteSeed: () => void;
  readonly isFavorite?: boolean;
  readonly showDeleteConfirmation?: boolean;
};

export default function SeedCardInfo({
  variety,
  plant,
  beanType,
  category,
  cardType,
  inUserCollection = false,
  onViewSeed,
  onAddToCollection,
  onFavoriteSeed,
  isFavorite = false,
  showDeleteConfirmation,
}: SeedCardInfoProps) {
  const heading = `${variety} ${plant} ${beanType || ''}`;
  const backgroundColor = categoryColor[category];

  return (
    <View style={styles.seedInfo}>
      {!showDeleteConfirmation && (
        <>
          <View style={styles.headingRow}>
            <View style={styles.chips}>
              {cardType === 'browse' && inUserCollection && (
                <>
                  <Text style={[styles.chipText, { color: colors.dusk }]}>In My Seeds</Text>
                  <MaterialCommunityIcons name="circle-medium" size={14} color={colors.gray300} />
                </>
              )}
              <Text style={[styles.chipText, { color: backgroundColor }]}>{category}</Text>
            </View>
            <Heading size="xsmall">{heading}</Heading>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={onViewSeed}>
              <Text style={styles.actionButtonText}>View Seed</Text>
            </Pressable>
            {cardType === 'browse' && !inUserCollection && (
              <View style={[styles.cornerButton, { backgroundColor: colors.blackSheer55 }]}>
                <IconButton icon="plus" size={18} color={colors.gray100} onPress={onAddToCollection} />
              </View>
            )}
            {cardType === 'user' && (
              <View style={styles.cornerButton}>
                <IconButton icon="heart" size={28} color={isFavorite ? colors.pink : colors.gray300} onPress={onFavoriteSeed} />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

// ---- CONSTANTS ----
const categoryColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

// ---- STYLES ----
const styles = StyleSheet.create({
  cornerButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  seedInfo: {
    justifyContent: 'space-between',
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipStyle: {
    opacity: 0.8,
    borderRadius: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  chipText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: colors.greenDark90,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  headingRow: {
    gap: 4,
  },
});
