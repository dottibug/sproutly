import { useRouter } from 'expo-router';
import type { SeedCatalogItem } from '../../lib/seedCatalog';
import SeedCard from '../ui/seedCard/SeedCard';
import { Pressable } from 'react-native';
import { useState } from 'react';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import SeedCardAction from '../ui/seedCard/SeedCardAction';

type CatalogSeedCardProps = {
  readonly seed: SeedCatalogItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  // State
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  const { addSeed } = useUserSeeds();
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
    // addSeed(seed);
    setShowAddConfirmation(false);
    console.log('Add confirmation confirmed');
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
