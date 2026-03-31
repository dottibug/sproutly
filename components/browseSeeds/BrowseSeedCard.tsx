import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import SeedCard from '../seeds/seedCard/SeedCard';

// BrowseSeedCard.tsx: Displays details of a seed in the "Browse" tab.

type BrowseSeedCardProps = {
  readonly seed: BrowseSeed;
};

export default function BrowseSeedCard({ seed }: BrowseSeedCardProps) {
  const router = useRouter();
  const { seeds: userSeeds, addSeedFromBrowse } = useUserSeed();
  const inUserCollection = userSeeds.some((s: UserSeed) => s.catalogSeedId === seed.id);
  const seedLabel = `${seed.variety} ${seed.plant}`.trim();

  const handleAddFromBrowse = () => {
    void (async () => {
      const result = await addSeedFromBrowse(seed);
      if (result === 'added') {
        Alert.alert('Seed successfully added', `${seedLabel} is now in your seed collection.`);
      } else if (result === 'duplicate') {
        Alert.alert('Already in collection', 'This seed is already in your collection.');
      } else if (result === 'failed') {
        Alert.alert('Could not add seed', 'Something went wrong. Please try again.');
      } else if (result === 'no_user') {
        Alert.alert('Sign in required', 'Please sign in to add seeds to your collection.');
      }
    })();
  };

  const handleViewSeed = () =>
    router.push({
      pathname: `/home/${seed.id}`,
      params: {
        inUserCollection: inUserCollection ? 'true' : 'false',
        tab: 'Browse',
      },
    });

  return (
    <SeedCard
      cardType="browse"
      seed={seed}
      inUserCollection={inUserCollection}
      onViewSeed={handleViewSeed}
      onAddFromBrowse={handleAddFromBrowse}
    />
  );
}
