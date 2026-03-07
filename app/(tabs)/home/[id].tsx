import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';
import ScreenContainer from '../../../components/ui/ScreenContainer';
import SeedDetails from '../../../components/seedDetails/SeedDetails';
import { CatalogSeedItem, UserSeedItem } from '../../../lib/seedCatalog';

// Catalog seed details screen
export default function SeedDetailsScreen() {
  const { id, tab, source } = useLocalSearchParams();

  const getUserSeeds = () => {
    const { seeds } = useUserSeeds();
    return seeds;
  };

  const getCatalogSeeds = () => {
    const { seeds } = useSeedCatalog();
    return seeds;
  };

  const seeds = tab === 'mySeeds' ? getUserSeeds() : getCatalogSeeds();

  const userSeed = seeds.find((s) => {
    if (source === 'catalog') return (s as UserSeedItem).catalog_seed_id === id;
    if (source === 'custom') return (s as UserSeedItem).custom_seed_id === id;
  });

  const catalogSeed = seeds.find((s) => (s as CatalogSeedItem).id === id);

  const seed = tab === 'mySeeds' ? userSeed : catalogSeed;

  if (seed === undefined) {
    return (
      <ScreenContainer>
        <Text>Seed not found</Text>
      </ScreenContainer>
    );
  }

  return <SeedDetails seed={seed} />;
}
