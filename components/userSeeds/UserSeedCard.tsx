import type { UserSeedItem } from '../../lib/seedCatalog';
import { useState } from 'react';
import { Pressable } from 'react-native';
import SeedCard from '../ui/seedCard/SeedCard';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import SeedCardAction from '../ui/seedCard/SeedCardAction';
import { useRouter } from 'expo-router';

type UserSeedCardProps = {
  readonly seed: UserSeedItem;
};

// TODO: Show a snackbar message when a seed is successfully deleted?

// TODO enable basic and detailed versions (user preferences setting probably)
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  // State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteSeedByCatalogId } = useUserSeeds();
  const router = useRouter();

  // Press handler to navigate to the seed details screen
  const handlePress = () => {
    const seedId = seed.custom_seed_id ? seed.custom_seed_id : seed.catalog_seed_id;

    const source = seed.custom_seed_id ? 'custom' : 'catalog';

    router.push(`/home/${seedId}?source=${source}`);
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
