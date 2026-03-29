import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BrowseSeed } from '../../../state/browseSeeds/browseTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import SeedCardInfo from './SeedCardInfo';
import Ionicons from '@expo/vector-icons/Ionicons';
import SeedImage from '../../seeds/SeedImage';
import { appStyles, colors } from '../../../styles/theme';

type SeedCardProps = {
  readonly cardType: 'user' | 'browse';
  readonly seed: UserSeed | BrowseSeed;
  readonly onPress: () => void;
  /** My Seeds only: long-press delete flow (not used on browse cards). */
  readonly onLongPress?: () => void;
  readonly delayLongPress?: number;
  readonly inUserCollection?: boolean;
  /** Browse list: add this catalog seed to the user collection (not custom seed flow). */
  readonly onAddFromBrowse?: () => void;
};

// TODO: decide how to include an "add seed" button on the catalog cards (and a remove seed on the user cards)
// TODO: should the catalog cards include a way to show that this seed is in the user's collection?
// TODO: should the user cards include a way to show sun exposure and other seed details? Maybe the user can choose between basic and detailed seed cards in their collection (in the user settings page, or on the seed list page itself?)
// TODO: might be able to delete cardType prop (wait until after you've figured out the basic/detailed user seed cards)

const CORNER_BTN = 28;
/** Matches `Badge` type="card" opacity for owned mark. */
const OWNED_OPACITY = 0.8;
const ownedAccent = colors.dusk;

// SeedCard component displays a single seed in the user's collection or the browse list
export default function SeedCard({
  cardType,
  seed,
  onPress,
  onLongPress,
  delayLongPress = 500,
  inUserCollection = false,
  onAddFromBrowse,
}: SeedCardProps) {
  const showBrowseAction = cardType === 'browse' && (inUserCollection || onAddFromBrowse);
  const seedLabel = `${seed.variety} ${seed.plant}`.trim();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={onLongPress ? delayLongPress : undefined}
      style={({ pressed }) => [appStyles.card, pressed && appStyles.cardPressed]}
      accessibilityRole="button"
      accessibilityLabel={`${seedLabel}, view details`}>
      <View style={styles.row}>
        <SeedImage imageUri={seed.image} size="small" />

        <View style={styles.mainColumn}>
          <SeedCardInfo
            variety={seed.variety}
            plant={seed.plant}
            beanType={seed.beanType}
            category={seed.category}
            cardType={cardType}
            inUserCollection={inUserCollection}
          />

          {showBrowseAction ? (
            <View style={styles.browseActionRow}>
              {inUserCollection ? (
                <View
                  style={[styles.cornerRound, styles.ownedMark]}
                  accessibilityRole="image"
                  accessibilityLabel="Already in your collection">
                  <Ionicons name="checkmark" size={16} color={ownedAccent} />
                </View>
              ) : (
                onAddFromBrowse && (
                  <Pressable
                    style={({ pressed }) => [styles.cornerRound, styles.addButton, pressed && styles.addButtonPressed]}
                    onPress={onAddFromBrowse}
                    accessibilityRole="button"
                    accessibilityLabel="Add seed to collection">
                    <Ionicons name="add-outline" size={18} color={colors.greenDark} />
                  </Pressable>
                )
              )}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 96,
  },
  mainColumn: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  browseActionRow: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  cornerRound: {
    width: CORNER_BTN,
    height: CORNER_BTN,
    borderRadius: CORNER_BTN / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
    }),
  },
  addButtonPressed: {
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  ownedMark: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: ownedAccent,
    opacity: OWNED_OPACITY,
  },
});
