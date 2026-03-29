import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BrowseSeed } from '../../../state/browseSeeds/browseTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import SeedCardInfo from './SeedCardInfo';
import Ionicons from '@expo/vector-icons/Ionicons';
import SeedImage from '../../seeds/SeedImage';
import { appStyles, colors } from '../../../styles/theme';
import IconButton from '../../ui/buttons/IconButton';

type SeedCardProps = {
  readonly cardType: 'user' | 'browse';
  readonly seed: UserSeed | BrowseSeed;
  readonly onViewSeed: () => void;
  /** My Seeds only: long-press delete flow (not used on browse cards). */
  readonly onLongPress?: () => void;
  readonly delayLongPress?: number;
  readonly inUserCollection?: boolean;
  /** Browse list: add this catalog seed to the user collection (not custom seed flow). */
  readonly onAddFromBrowse?: () => void;
  /** My Seeds only: cancel delete flow (not used on browse cards). */
  readonly onCancel?: () => void;
  /** My Seeds only: delete seed from collection (not used on browse cards). */
  readonly onDelete?: () => void;
  /** My Seeds only: show delete confirmation (not used on browse cards). */
  readonly showDeleteConfirmation?: boolean;
};

const CORNER_BTN = 28;
/** Matches `Badge` type="card" opacity for owned mark. */
const OWNED_OPACITY = 0.8;
const ownedAccent = colors.dusk;

// SeedCard component displays a single seed in the user's collection or the browse list
export default function SeedCard({
  cardType,
  seed,
  onViewSeed,
  onLongPress,
  delayLongPress = 500,
  inUserCollection = false,
  onAddFromBrowse,
  onCancel,
  onDelete,
  showDeleteConfirmation,
}: SeedCardProps) {
  const showBrowseAction = cardType === 'browse' && (inUserCollection || onAddFromBrowse);
  const seedLabel = `${seed.variety} ${seed.plant}`.trim();
  const confirmingDelete = !!showDeleteConfirmation;

  return (
    <Pressable
      onPress={confirmingDelete ? undefined : onViewSeed}
      onLongPress={confirmingDelete ? undefined : onLongPress}
      delayLongPress={onLongPress && !confirmingDelete ? delayLongPress : undefined}
      style={({ pressed }) => [
        appStyles.card,
        pressed && !confirmingDelete && appStyles.cardPressed,
        confirmingDelete && styles.cardConfirming,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${seedLabel}, view details`}>
      <View style={styles.row}>
        <View style={styles.imageContainer}>
          <SeedImage imageUri={seed.image} size="small" resizeMode="cover" />
        </View>

        <View style={styles.mainColumn}>
          <SeedCardInfo
            variety={seed.variety}
            plant={seed.plant}
            beanType={seed.beanType}
            category={seed.category}
            cardType={cardType}
            inUserCollection={inUserCollection}
            onViewSeed={confirmingDelete ? () => {} : onViewSeed}
            onAddToCollection={onAddFromBrowse ?? (() => {})}
            onFavoriteSeed={() => {
              console.log('onFavoriteSeed called');
            }}
            onCancel={onCancel}
            onDelete={onDelete}
            showDeleteConfirmation={showDeleteConfirmation}
          />
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
    position: 'relative',
  },
  imageContainer: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  mainColumn: {
    flex: 1,
    // marginLeft: 12,
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 10,

    // borderWidth: 1,
    borderColor: 'red',
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
  chevronButton: {
    marginTop: 10,
    backgroundColor: colors.blackSheer55,
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardConfirming: {
    borderWidth: 1,
    borderColor: colors.gray300,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 8 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
});
