import { useLocalSearchParams } from 'expo-router';
import { useBrowseSeed } from '../../../state/browseSeeds/BrowseSeedContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { BrowseSeed } from '../../../state/browseSeeds/browseTypes';
import { UserSeed } from '../../../state/userSeeds/types/seedTypes';

import BrowseSeedScreen from '../../../components/browseSeeds/BrowseSeedScreen';
import UserSeedScreen from '../../../components/userSeeds/UserSeedScreen';

// SeedDetailsScreen display the details of a single see – either one being browsed from the catalog or one in the user's own seed collection
export default function SeedDetailsScreen() {
  const { id, tab, source } = useLocalSearchParams();

  const { seeds: userSeeds } = useUserSeed();
  const { seeds: catalogSeeds } = useBrowseSeed();

  const seeds = tab === 'My Seeds' ? userSeeds : catalogSeeds;

  const userSeed = seeds.find((s) => {
    if (source === 'catalog') return (s as UserSeed).catalogSeedId === id;
    if (source === 'custom') return (s as UserSeed).customSeedId === id;
  });

  const catalogSeed = seeds.find((s) => (s as BrowseSeed).id === id);
  const seed = tab === 'My Seeds' ? userSeed : catalogSeed;

  return (
    <>
      {seed && tab === 'Browse' && <BrowseSeedScreen seed={seed} />}
      {seed && tab === 'My Seeds' && <UserSeedScreen seed={seed as UserSeed} />}
    </>
  );
}
