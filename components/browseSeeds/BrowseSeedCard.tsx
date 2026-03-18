import { useRouter } from 'expo-router';
import { useUserSeeds } from '../../context/UserSeedsContext';
import { UserSeedItem, BrowseSeedItem } from '../../utils/types';
import SeedCard from '../seeds/seedCard/SeedCard';

type BrowseSeedCardProps = {
  readonly seed: BrowseSeedItem;
};

// BrowseSeedCard component displays a single seed in the browse list
export default function BrowseSeedCard({ seed }: BrowseSeedCardProps) {
  const router = useRouter();
  const { seeds: userSeeds } = useUserSeeds();

  const inUserCollection = userSeeds.some((s: UserSeedItem) => s.catalog_seed_id === seed.id);

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
