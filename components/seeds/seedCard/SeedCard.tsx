import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { BrowseSeed } from '../../../state/browseSeeds/browseTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import SeedCardDeleteOverlay from './SeedCardDeleteOverlay';
import SeedCardInfo from './SeedCardInfo';
import SeedImage from '../../seeds/SeedImage';
import { appStyles, colors } from '../../../styles/theme';

// SeedCard.tsx: Displays seed information for a user's seed or a browse seed.

type SeedCardProps = {
  readonly cardType: 'user' | 'browse';
  readonly seed: UserSeed | BrowseSeed;
  readonly onViewSeed: () => void;
  readonly onLongPress?: () => void; // user cards only
  readonly delayLongPress?: number; // user cards only
  readonly inUserCollection?: boolean;
  readonly onAddFromBrowse?: () => void; // browse cards only
  readonly onCancel?: () => void; // user cards only
  readonly onDelete?: () => void; // user cards only
  readonly showDeleteConfirmation?: boolean; // user cards only
  readonly onFavoriteSeed?: () => void; // user cards only
};

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
  onFavoriteSeed,
}: SeedCardProps) {
  const seedLabel = `${seed.variety} ${seed.plant}`.trim();
  const confirmingDelete = !!showDeleteConfirmation;
  const favoriteActive = cardType === 'user' && 'isFavorite' in seed ? seed.isFavorite : false;

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
      {showDeleteConfirmation && <SeedCardDeleteOverlay seedName={seedLabel} onDelete={onDelete!} onCancel={onCancel!} />}

      {!showDeleteConfirmation && (
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
              onFavoriteSeed={onFavoriteSeed ?? (() => {})}
              isFavorite={favoriteActive}
              showDeleteConfirmation={showDeleteConfirmation}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ---- CONSTANTS ----
const CORNER_BTN = 28;
const OWNED_OPACITY = 0.8;
const ownedAccent = colors.dusk;

// ---- STYLES ----
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
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 10,
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
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
});
