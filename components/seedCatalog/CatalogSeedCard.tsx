import { useRouter } from 'expo-router';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import { UserSeedItem, CatalogSeedItem } from '../../lib/types';
import SeedCard from '../ui/seedCard/SeedCard';

type CatalogSeedCardProps = {
  readonly seed: CatalogSeedItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  const router = useRouter();
  const { seeds: userSeeds } = useUserSeeds();

  const inUserCollection = userSeeds.some((s: UserSeedItem) => s.catalog_seed_id === seed.id);

  const handlePress = () =>
    router.push({
      pathname: `/home/${seed.id}`,
      params: {
        inUserCollection: inUserCollection ? 'true' : 'false',
        tab: 'browse',
      },
    });

  return <SeedCard cardType="catalog" seed={seed} inUserCollection={inUserCollection} onPress={handlePress} />;
}
