import { useState, Fragment } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import SeedCard from '../seeds/seedCard/SeedCard';
import SeedCardAction from '../seeds/seedCard/SeedCardAction';
import SeedCardOverlay from '../seeds/seedCard/SeedCardOverlay';
import { colors } from '../../styles/theme';

type UserSeedCardProps = {
  readonly seed: UserSeed;
};

// TODO: Show a snackbar message when a seed is successfully deleted?
// TODO enable basic and detailed versions (user preferences setting probably)

// UserSeedCard component displays a single seed in the user's collection
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  // State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteByCatalogId, deleteByCustomId } = useUserSeed();
  const router = useRouter();

  // Check if this seed is an optimistic update (has temp ID) and is being saved to the database
  const isSaving = seed.id.startsWith('temp-') || (seed.customSeedId?.startsWith('temp-') ?? false);

  // Press handler to navigate to the seed details screen
  const handlePress = () => {
    const seedId = seed.customSeedId ? seed.customSeedId : seed.catalogSeedId;
    const source = seed.customSeedId ? 'custom' : 'catalog';

    router.push({
      pathname: `/home/${seedId}`,
      params: {
        source: source,
        tab: 'My Seeds',
      },
    });
  };

  // Show the delete confirmation
  const handleLongPress = () => setShowDeleteConfirmation(true);

  // Hide the delete confirmation
  const handleCancel = () => setShowDeleteConfirmation(false);

  // Delete the seed from the database
  const handleDelete = () => {
    if (seed.catalogSeedId) deleteByCatalogId(seed);
    else deleteByCustomId(seed);
    setShowDeleteConfirmation(false);
  };

  return (
    <Fragment>
      {!showDeleteConfirmation && (
        <>
          <SeedCard
            cardType="user"
            seed={seed}
            onPress={handlePress}
            onLongPress={isSaving ? undefined : handleLongPress}
            delayLongPress={500}
          />
          {isSaving && (
            <SeedCardOverlay>
              <Text style={styles.savingText}>Saving...</Text>
            </SeedCardOverlay>
          )}
        </>
      )}

      {showDeleteConfirmation && (
        <SeedCardAction
          seed={seed}
          variety={seed.variety}
          plant={seed.plant}
          action="Delete"
          onCancel={handleCancel}
          onAction={handleDelete}
        />
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  savingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
