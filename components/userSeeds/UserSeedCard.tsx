import { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';
import SeedCard from '../seeds/seedCard/SeedCard';
import SeedCardAction from '../seeds/seedCard/SeedCardAction';

type UserSeedCardProps = {
  readonly seed: UserSeed;
};

// TODO: Show a snackbar message when a seed is successfully deleted?
// TODO enable basic and detailed versions (user preferences setting probably)

// UserSeedCard component displays a single seed in the user's collection
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  // State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteByCatalogId } = useUserSeed();
  const router = useRouter();

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
    deleteByCatalogId(seed);
    setShowDeleteConfirmation(false);
  };

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={500}>
      {/* Show the seed card */}
      {!showDeleteConfirmation && <SeedCard cardType="user" seed={seed} onPress={handlePress} />}

      {/* Show the delete confirmation */}
      {showDeleteConfirmation && (
        <SeedCardAction seedName={seed.name} seedCategory={seed.category} action="Delete" onCancel={handleCancel} onAction={handleDelete} />
      )}
    </Pressable>
  );
}
