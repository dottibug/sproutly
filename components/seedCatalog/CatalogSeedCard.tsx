import { useRouter } from 'expo-router';
import type { CatalogSeedItem } from '../../lib/seedCatalog';
import SeedCard from '../ui/seedCard/SeedCard';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import SeedCardAction from '../ui/seedCard/SeedCardAction';
import { UserSeedItem } from '../../lib/seedCatalog';

type CatalogSeedCardProps = {
  readonly seed: CatalogSeedItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  // State
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  const router = useRouter();

  const { seeds: userSeeds, addSeedFromCatalog } = useUserSeeds();

  const inUserCollection = userSeeds.some((s: UserSeedItem) => s.catalog_seed_id === seed.id);

  const handlePress = () =>
    router.push({
      pathname: `/catalog/${seed.id}`,
      params: {
        inUserCollection: inUserCollection ? 'true' : 'false',
        tab: 'catalog',
      },
    });

  const handleLongPress = () => {
    setShowAddConfirmation(true);
    console.log('Long press detected');
  };

  const handleCancel = () => {
    setShowAddConfirmation(false);
    console.log('Add confirmation cancelled');
  };

  const handleAdd = () => {
    addSeedFromCatalog(seed);
    setShowAddConfirmation(false);
    console.log('✅ Seed added to collection');
  };

  return (
    <Pressable onLongPress={handleLongPress} delayLongPress={500}>
      {/* Show the seed card */}
      {!showAddConfirmation && <SeedCard cardType="catalog" seed={seed} inUserCollection={inUserCollection} onPress={handlePress} />}

      {/* Show the add confirmation */}
      {showAddConfirmation && (
        <SeedCardAction seedName={seed.name} seedCategory={seed.category} action="Add" onCancel={handleCancel} onAction={handleAdd} />
      )}
    </Pressable>
  );
}
