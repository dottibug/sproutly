import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import SeedCard from '../seeds/seedCard/SeedCard';

type BrowseSeedCardProps = {
  readonly seed: BrowseSeed;
};

// BrowseSeedCard component displays a single seed in the browse list
export default function BrowseSeedCard({ seed }: BrowseSeedCardProps) {
  const router = useRouter();
  const { seeds: userSeeds } = useUserSeed();

  const inUserCollection = userSeeds.some((s: UserSeed) => s.catalogSeedId === seed.id);

  const handlePress = () =>
    router.push({
      pathname: `/home/${seed.id}`,
      params: {
        inUserCollection: inUserCollection ? 'true' : 'false',
        tab: 'Browse',
      },
    });

  return <SeedCard cardType="browse" seed={seed} inUserCollection={inUserCollection} onPress={handlePress} />;
}
