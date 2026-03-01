import type { UserSeedItem } from '../../lib/seedCatalog';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import SeedCard from '../ui/seedCard/SeedCard';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';

type UserSeedCardProps = {
  readonly seed: UserSeedItem;
};

// TODO: on press, show seed details (same as catalog seed card)

// TODO: Removing a seed: direct button on card, which slides a confirmation message into the card. If user confirms, seed optimistically removed from list, then from supabase. If user cancels, seed remains in list. LATER, if time (or mention in further dev discussion): Swipe action to the right to remove seed (still shows the same confirmation message as pressing the trash button, or alternatively an undo button with a timed delay before actually removing the seed from the list)

// TODO enable basic and detailed versions (user preferences setting probably)
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  // State
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const { deleteSeed } = useUserSeeds();

  const handlePress = () => {
    console.log('User seed card pressed');
  };

  return <SeedCard cardType="user" seed={seed} onPress={handlePress} />;
}
