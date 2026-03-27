import { useLocalSearchParams, Stack } from 'expo-router';
import { useBrowseSeed } from '../../../state/browseSeeds/BrowseSeedContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { BrowseSeed } from '../../../state/browseSeeds/browseTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';

import UserSeedScreen from '../../../components/userSeeds/UserSeedScreen';
import BrowseSeedDetails from '../../../components/browseSeeds/BrowseSeedDetails';
import ScreenMessage from '../../../components/ui/ScreenMessage';

// SeedDetailsScreen display the details of a single see – either one being browsed from the catalog or one in the user's own seed collection
export default function SeedDetailsScreen() {
  const { id, tab, source } = useLocalSearchParams();
  const isMySeedsTab = tab === 'My Seeds';

  let seed: UserSeed | BrowseSeed | undefined;

  if (isMySeedsTab) {
    const { seeds: userSeeds } = useUserSeed();

    seed = userSeeds.find((seed) => {
      if (source === 'catalog') return seed.catalogSeedId === id;
      if (source === 'custom') return seed.customSeedId === id;
      return false;
    }) as UserSeed | undefined;
  }

  if (!isMySeedsTab) {
    const { seeds: catalogSeeds } = useBrowseSeed();

    seed = catalogSeeds.find((seed) => seed.id === id) as BrowseSeed | undefined;
  }

  if (!seed) return <ScreenMessage message="Seed not found" />;

  const headerTitle = seed ? `${seed.variety} ${seed.plant}`.trim() : 'Seed Details';

  return (
    <>
      <Stack.Screen options={{ title: headerTitle, headerBackButtonDisplayMode: 'minimal' }} />

      {isMySeedsTab ? <UserSeedScreen seed={seed as UserSeed} /> : <BrowseSeedDetails seed={seed as BrowseSeed} />}
    </>
  );
}
