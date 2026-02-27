import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import SeedDetails from '../../../components/seedDetails/SeedDetails';

// TODO: Add the accordions for each section of the seed details
// TODO: Allow the user to add the seed to their collection

// Catalog seed details screen
export default function CatalogSeedDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { seeds } = useSeedCatalog();
  const seed = seeds.find((s) => s.id === id);

  if (!seed) {
    return (
      <SafeAreaView>
        <Text>Seed not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']}>
      <SeedDetails seed={seed} />
    </SafeAreaView>
  );
}
