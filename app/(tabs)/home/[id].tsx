import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../context/SeedCatalogContext';
import { useUserSeeds } from '../../../context/UserSeedsContext';
import { BrowseSeedItem, UserSeedItem } from '../../../utils/types';
import BrowseSeed from '../../../components/browseSeeds/BrowseSeed';
import UserSeed from '../../../components/userSeeds/UserSeed';

// Catalog seed details screen
export default function SeedDetailsScreen() {
  const { id, tab, source } = useLocalSearchParams();

  const { seeds: userSeeds } = useUserSeeds();
  const { seeds: catalogSeeds } = useSeedCatalog();

  const seeds = tab === 'My Seeds' ? userSeeds : catalogSeeds;

  const userSeed = seeds.find((s) => {
    if (source === 'catalog') return (s as UserSeedItem).catalog_seed_id === id;
    if (source === 'custom') return (s as UserSeedItem).custom_seed_id === id;
  });

  const catalogSeed = seeds.find((s) => (s as BrowseSeedItem).id === id);
  const seed = tab === 'My Seeds' ? userSeed : catalogSeed;

  return (
    <>
      {seed && tab === 'Browse' && <BrowseSeed seed={seed} />}
      {seed && tab === 'My Seeds' && <UserSeed seed={seed as UserSeedItem} />}
    </>
  );
}
