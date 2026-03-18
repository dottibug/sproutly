import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';
import { CatalogSeedItem, UserSeedItem } from '../../../lib/types';
import BrowseSeedDetails from '../../../components/seedDetails/BrowseSeedDetails';
import UserSeeds from '../../../components/seedDetails/UserSeeds';

// Catalog seed details screen
export default function SeedDetailsScreen() {
  const { id, tab, source } = useLocalSearchParams();

  const { seeds: userSeeds } = useUserSeeds();
  const { seeds: catalogSeeds } = useSeedCatalog();

  const seeds = tab === 'mySeeds' ? userSeeds : catalogSeeds;

  const userSeed = seeds.find((s) => {
    if (source === 'catalog') return (s as UserSeedItem).catalog_seed_id === id;
    if (source === 'custom') return (s as UserSeedItem).custom_seed_id === id;
  });

  const catalogSeed = seeds.find((s) => (s as CatalogSeedItem).id === id);

  const seed = tab === 'mySeeds' ? userSeed : catalogSeed;

  return (
    <>
      {seed && tab === 'browse' && <BrowseSeedDetails seed={seed} />}

      {seed && tab === 'mySeeds' && <UserSeeds seed={seed as UserSeedItem} />}
    </>
  );
}
