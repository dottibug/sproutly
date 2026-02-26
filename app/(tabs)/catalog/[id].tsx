import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import SeedTypeIcon from '../../../components/SeedTypeIcon';
import Exposure from '../../../components/exposureIcons/Exposure';
import type { exposureType } from '../../../components/exposureIcons/Exposure';

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
      <ScrollView>
        <Image source={{ uri: seed.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.seedInfo}>
          <Text style={styles.name}>
            {seed.name} {seed.category} {seed.bean_type ? `(${seed.bean_type})` : ''}
          </Text>
          <Text style={styles.sku}>SKU: {seed.sku}</Text>
          <View style={styles.seedTypeAndExposure}>
            <SeedTypeIcon type={seed.type} size="medium" />
            <Exposure exposure={seed.exposure as exposureType} />
          </View>

          {/* Description */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Description</Text>
            <Text style={styles.infoContent}>{seed.description}</Text>
            {seed.matures_in_days && <Text style={styles.maturesInDays}>Matures in {seed.matures_in_days} days</Text>}
            {seed.difficulty && <Text style={styles.difficulty}>Difficulty: {seed.difficulty}</Text>}
          </View>

          {/* Timing */}
          {seed.timing && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Timing</Text>
              <Text style={styles.infoContent}>{seed.timing}</Text>
            </View>
          )}

          {/* Starting */}
          {seed.starting && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Starting</Text>
              <Text style={styles.infoContent}>{seed.starting}</Text>
            </View>
          )}
          {/* Growing */}
          {seed.growing && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Growing</Text>
              <Text style={styles.infoContent}>{seed.growing}</Text>
            </View>
          )}

          {/* Harvest */}
          {seed.harvest && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Harvest</Text>
              <Text style={styles.infoContent}>{seed.harvest}</Text>
            </View>
          )}

          {/* Companion planting */}
          {seed.companion_planting && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>Companion planting</Text>
              <Text style={styles.infoContent}>{seed.companion_planting}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 400,
  },
  seedInfo: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sku: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  seedTypeAndExposure: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    gap: 18,
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 18,
    marginTop: 18,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoContent: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 6,
  },
  maturesInDays: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
});
