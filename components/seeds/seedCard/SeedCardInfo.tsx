import { View, StyleSheet, Text, Pressable, Button } from 'react-native';
import { Category } from '../../../state/userSeeds/seeds/seedInfoTypes';
import Heading from '../../ui/Heading';
import Badge from '../../ui/Badge';
import { colors } from '../../../styles/theme';
import { IconButton } from '../../uiComponentBarrel';

const categoryColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

const ownedAccent = colors.dusk;

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
  readonly onCancel?: () => void;
  readonly onDelete?: () => void;
  readonly showDeleteConfirmation?: boolean;
};

// SeedCardInfo component displays the information of a single seed in the user's collection or the browse list
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
  onCancel,
  onDelete,
  showDeleteConfirmation,
}: SeedCardInfoProps) {
  const heading = `${variety} ${plant} ${beanType || ''}`;
  const backgroundColor = categoryColor[category];

  return (
    <View style={styles.seedInfo}>
      {showDeleteConfirmation && (
        <View style={styles.deleteConfirmation}>
          <View style={styles.deleteMsgContainer}>
            <View style={styles.deleteMsgRow}>
              <Text style={styles.deleteMsg}>{`Delete `}</Text>
              <Text style={[styles.seedNameDelete, styles.deleteMsg]}>{`${heading.trim()}`}</Text>
              <Text style={styles.deleteMsg}>{`?`}</Text>
            </View>

            <Text style={styles.warningMsg}>This cannot be undone.</Text>
          </View>

          <View style={styles.buttons}>
            <Pressable onPress={onDelete} style={[styles.button, styles.deleteButton]}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      {!showDeleteConfirmation && (
        <>
          <View style={styles.headingRow}>
            <View style={styles.chips}>
              {cardType === 'browse' && inUserCollection && <Text style={styles.chipTextAlt}>{}</Text>}
              <Text style={styles.chipTextAlt}>{category}</Text>
            </View>
            <Heading size="xsmall">{heading}</Heading>
          </View>
          <View style={styles.actionRow}>
            <Pressable style={styles.actionButton} onPress={onViewSeed}>
              <Text style={styles.actionButtonText}>View Seed</Text>
            </Pressable>
            <View style={styles.cornerButton}>
              {cardType === 'browse' ? (
                <IconButton icon="plus" size={18} color={colors.gray100} onPress={onAddToCollection} />
              ) : (
                <IconButton icon="heartOutline" size={18} color={colors.gray100} onPress={onFavoriteSeed} />
              )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteConfirmation: {
    justifyContent: 'space-between',
    flex: 1,
  },
  deleteMsgContainer: {
    gap: 10,
  },
  deleteMsg: {
    fontSize: 16,
  },
  deleteMsgRow: {
    flexDirection: 'row',
  },
  warningMsg: {
    fontSize: 14,
    // fontWeight: '600',
    color: colors.primary,
    fontStyle: 'italic',
  },
  seedNameDelete: {
    fontWeight: '600',
    color: colors.red,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    // justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: colors.red,
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.gray500,
    color: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  seedInfo: {
    // gap: 10,
    // gap: 8,
    justifyContent: 'space-between',
    flex: 1,

    // borderWidth: 1,
    borderColor: 'blue',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    // backgroundColor: colors.gray200,
    alignSelf: 'flex-start',
    // borderRadius: 100,
    opacity: 0.8,
    // marginVertical: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    // borderWidth: 1,
    // borderColor: 'rgba(0, 0, 0, 0.10)',
  },
  chipText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  chipTextAlt: {},

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    // borderWidth: 1,
    borderColor: 'red',
  },
  actionButton: {
    backgroundColor: colors.greenDark90,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: colors.gray100,
    fontSize: 14,
    fontWeight: '600',
  },

  headingRow: {
    gap: 4,
  },

  cornerButton: {
    // marginTop: 10,
    backgroundColor: colors.blackSheer55,
    // position: 'absolute',
    // right: 12,
    // bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
