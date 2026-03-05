import { Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import ScreenContainer from '../../../components/ui/ScreenContainer';
import SeedDetails from '../../../components/seedDetails/SeedDetails';

// TODO: Allow the user to add the seed to their collection

// Catalog seed details screen
export default function CatalogSeedDetailsScreen() {
  const { id, inUserCollection } = useLocalSearchParams();
  const { seeds } = useSeedCatalog();
  const seed = seeds.find((s) => s.id === id);

  if (!seed) {
    return (
      <ScreenContainer>
        <Text>Seed not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer fullScreen>
      <SeedDetails seed={seed} inUserCollection={inUserCollection === 'true'} />
    </ScreenContainer>
  );
}
