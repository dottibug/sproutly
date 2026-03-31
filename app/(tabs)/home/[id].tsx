import { useLocalSearchParams, Stack } from 'expo-router';
import { useBrowseSeed, useUserSeed } from '../../../state/barrels/contextBarrel';
import { BrowseSeed, UserSeed } from '../../../state/barrels/typesBarrel';
import UserSeedScreen from '../../../components/userSeeds/UserSeedScreen';
import BrowseSeedDetails from '../../../components/browseSeeds/BrowseSeedDetails';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import { colors } from '../../../styles/theme';

// (home)/[id].tsx: aka Seed Details Screen. Displays the details of a single seed – either one being browsed from the catalog or one in the user's own seed collection.

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
      <Stack.Screen
        options={{
          title: headerTitle,
          headerBackButtonDisplayMode: 'minimal',
          headerTintColor: colors.greenMedium,
          headerTitleAlign: 'center',
        }}
      />
      {isMySeedsTab ? <UserSeedScreen seed={seed as UserSeed} /> : <BrowseSeedDetails seed={seed as BrowseSeed} />}
    </>
  );
}
