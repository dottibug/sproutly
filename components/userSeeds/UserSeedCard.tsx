import { useState, Fragment, useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import SeedCard from '../seeds/seedCard/SeedCard';
import SeedCardOverlay from '../seeds/seedCard/SeedCardOverlay';
import { colors } from '../../styles/theme';

type UserSeedCardProps = {
  readonly seed: UserSeed;
  readonly showDeleteConfirmation: boolean;
  readonly onSetDeleteIsOpenForId: (id: string | null) => void;
};

// UserSeedCard component displays a single seed in the user's collection
export default function UserSeedCard({ seed, showDeleteConfirmation, onSetDeleteIsOpenForId }: UserSeedCardProps) {
  // State
  // const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteByCatalogId, deleteByCustomId } = useUserSeed();
  const router = useRouter();

  // Check if this seed is an optimistic update (has temp ID) and is being saved to the database

  // TODO: COMMENT THIS BACK IN AFTER STYLING
  // const isSaving = seed.id.startsWith('temp-') || (seed.customSeedId?.startsWith('temp-') ?? false);
  const isSaving = false;

  // Press handler to navigate to the seed details screen
  const handleViewSeed = () => {
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
  const handleLongPress = () => {
    console.log('handleLongPress called');
    onSetDeleteIsOpenForId(seed.id);
  };

  // Hide the delete confirmation
  const handleCancel = () => {
    console.log('handleCancel called');
    onSetDeleteIsOpenForId(null);
  };

  // Delete the seed from the database
  const handleDelete = () => {
    console.log('handleDelete called');
    if (seed.catalogSeedId) deleteByCatalogId(seed);
    else deleteByCustomId(seed);
    onSetDeleteIsOpenForId(null);
  };

  return (
    <>
      <SeedCard
        cardType="user"
        seed={seed}
        onViewSeed={handleViewSeed}
        onLongPress={isSaving ? undefined : handleLongPress}
        delayLongPress={500}
        onCancel={handleCancel}
        onDelete={handleDelete}
        showDeleteConfirmation={showDeleteConfirmation}
      />
      {isSaving && (
        <SeedCardOverlay>
          <Text style={styles.savingText}>Saving...</Text>
        </SeedCardOverlay>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  savingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
