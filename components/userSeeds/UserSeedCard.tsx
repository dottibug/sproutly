import { useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSeeds } from '../../context/UserSeedsContext';
import { UserSeedItem } from '../../utils/types';
import SeedCard from '../seeds/seedCard/SeedCard';
import SeedCardAction from '../seeds/seedCard/SeedCardAction';

type UserSeedCardProps = {
  readonly seed: UserSeedItem;
};

// TODO: Show a snackbar message when a seed is successfully deleted?
// TODO enable basic and detailed versions (user preferences setting probably)

// UserSeedCard component displays a single seed in the user's collection
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  // State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteSeedByCatalogId } = useUserSeeds();
  const router = useRouter();

  // Press handler to navigate to the seed details screen
  const handlePress = () => {
    const seedId = seed.custom_seed_id ? seed.custom_seed_id : seed.catalog_seed_id;
    const source = seed.custom_seed_id ? 'custom' : 'catalog';

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
    deleteSeedByCatalogId(seed);
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
