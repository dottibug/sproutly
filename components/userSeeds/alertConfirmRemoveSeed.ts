import { Alert } from 'react-native';
import type { UserSeed } from '../../state/userSeeds/seeds/seedTypes';

/** Second-step confirmation (system alert) after the user chooses to remove a seed. */
export function alertConfirmRemoveSeed(seed: UserSeed, onRemove: () => Promise<void>): void {
  const label = `${seed.variety} ${seed.plant}`.trim() || 'this seed';
  Alert.alert(
    'Remove from collection?',
    `Remove "${label}" from your collection? This cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          onRemove().catch(() => Alert.alert('Could not remove seed', 'Please try again.'));
        },
      },
    ],
  );
}
