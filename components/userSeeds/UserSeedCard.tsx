import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import SeedCard from '../seeds/seedCard/SeedCard';
import SeedCardOverlay from '../seeds/seedCard/SeedCardOverlay';

// UserSeedCard.tsx: Renders a single seed in the user's collection on a card
type UserSeedCardProps = {
  readonly seed: UserSeed;
  readonly showDeleteConfirmation: boolean;
  readonly onSetDeleteIsOpenForId: (id: string | null) => void;
};

export default function UserSeedCard({ seed, showDeleteConfirmation, onSetDeleteIsOpenForId }: UserSeedCardProps) {
  const { deleteByCatalogId, deleteByCustomId, setSeedFavorite } = useUserSeed();
  const router = useRouter();

  // Check if this seed is an optimistic update (has temp ID) and is being saved to the database
  const isSaving = seed.id.startsWith('temp-') || (seed.customSeedId?.startsWith('temp-') ?? false);

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

  // Toggle the favorite status of the seed
  const handleFavorite = () => {
    void setSeedFavorite(seed, !seed.isFavorite);
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
        onFavoriteSeed={handleFavorite}
      />
      {isSaving && !showDeleteConfirmation && <SeedCardOverlay />}
    </>
  );
}
