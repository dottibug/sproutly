import { useRouter } from 'expo-router';
import type { CatalogSeedItem } from '../../lib/seedCatalog';
import SeedCard from '../ui/seedCard/SeedCard';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import SeedCardAction from '../ui/seedCard/SeedCardAction';

type CatalogSeedCardProps = {
  readonly seed: CatalogSeedItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  // State
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  const { addSeedFromCatalog } = useUserSeeds();
  const router = useRouter();

  const handlePress = () => router.push(`/catalog/${seed.id}`);

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
      {!showAddConfirmation && <SeedCard cardType="catalog" seed={seed} onPress={handlePress} />}

      {/* Show the add confirmation */}
      {showAddConfirmation && (
        <SeedCardAction seedName={seed.name} seedCategory={seed.category} action="Add" onCancel={handleCancel} onAction={handleAdd} />
      )}
    </Pressable>
  );
}
