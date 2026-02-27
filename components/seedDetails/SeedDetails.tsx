import { ScrollView, Image, View, Text, StyleSheet } from 'react-native';
import { SeedCatalogItem } from '../../lib/seedCatalog';
import Heading from '../ui/Heading';
import SeedTypeExposure from './SeedTypeExposure';
import type { exposureType } from './Exposure';
import SeedDetailSection from './SeedDetailSection';

type SeedDetailsProps = {
  readonly seed: SeedCatalogItem;
};

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';

export default function SeedDetails({ seed }: SeedDetailsProps) {
  return (
    <ScrollView>
      <Image source={{ uri: seed.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.seedInfo}>
        {/* Seed name */}
        <Heading size="large">
          {seed.name} {seed.category} {seed.bean_type ? `(${seed.bean_type})` : ''}
        </Heading>

        {/* SKU */}
        <Text style={styles.sku}>SKU: {seed.sku}</Text>

        {/* Seed type and exposure */}
        <SeedTypeExposure type={seed.type} exposure={seed.exposure as exposureType} />

        {/* Description */}
        <SeedDetailSection title={DESCRIPTION} details={seed.description}>
          {/* Matures in days */}
          {seed.matures_in_days && (
            <Heading size="small" color="secondary">
              Matures in {seed.matures_in_days} days
            </Heading>
          )}

          {/* Difficulty */}
          {seed.difficulty && (
            <Heading size="small" color="secondary">
              Difficulty: {seed.difficulty}
            </Heading>
          )}
        </SeedDetailSection>

        {seed.timing && <SeedDetailSection title={TIMING} details={seed.timing} />}

        {seed.starting && <SeedDetailSection title={STARTING} details={seed.starting} />}

        {seed.growing && <SeedDetailSection title={GROWING} details={seed.growing} />}

        {seed.harvest && <SeedDetailSection title={HARVEST} details={seed.harvest} />}

        {seed.companion_planting && <SeedDetailSection title={COMPANION_PLANTING} details={seed.companion_planting} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
    width: '100%',
  },
  seedInfo: {
    padding: 16,
  },
  sku: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
});
