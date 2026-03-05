import { ScrollView, Image, View, StyleSheet } from 'react-native';
import { CatalogSeedItem, UserSeedItem } from '../../lib/seedCatalog';
import Heading from '../ui/Heading';
import SeedDetailSection from './SeedDetailSection';
import SeedSKU from './SeedSku';
import SeedBadges from './SeedBadges';
import type { ExposureType } from '../../lib/seedCatalog';

type SeedDetailsProps = {
  readonly seed: CatalogSeedItem | UserSeedItem;
  readonly inUserCollection?: boolean;
};

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';

export default function SeedDetails({ seed, inUserCollection = false }: SeedDetailsProps) {
  const isCustomSeed = 'custom_seed_id' in seed && seed.custom_seed_id !== null;

  // UserSeedItem has 'notes'; CatalogSeedItem does not
  const action = inUserCollection ? 'Delete' : 'Add';

  return (
    <ScrollView>
      <Image source={{ uri: seed.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.seedInfo}>
        {/* Seed name */}
        <Heading size="large">
          {seed.name} {seed.category} {seed.bean_type ? `(${seed.bean_type})` : ''}
        </Heading>

        {/* SKU */}
        <SeedSKU seedSKU={seed.sku} catalogId={seed.id} inUserCollection={inUserCollection} />

        {/* Seed badges */}
        <SeedBadges type={seed.type} exposure={seed.exposure as ExposureType} />

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
  badges: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
