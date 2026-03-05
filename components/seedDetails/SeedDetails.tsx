import { ScrollView, Image, View, StyleSheet } from 'react-native';
import { CatalogSeedItem, UserSeedItem } from '../../lib/seedCatalog';
import type { ExposureType } from '../../lib/seedCatalog';
import Accordion from '../accordion/Accordion';
import SeedQuickFacts from './SeedQuickFacts';
import SeedHeader from './SeedHeader';

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
    <ScrollView style={styles.scrollView}>
      <Image source={{ uri: seed.image }} style={styles.image} resizeMode="cover" />

      <View>
        <SeedHeader
          name={seed.name}
          category={seed.category}
          beanType={seed.bean_type}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={inUserCollection}
          type={seed.type}
          exposure={seed.exposure as ExposureType}
        />

        <Accordion title={DESCRIPTION} content={seed.description as string}>
          <SeedQuickFacts maturesInDays={seed.matures_in_days} difficulty={seed.difficulty} />
        </Accordion>

        {seed.timing && <Accordion title={TIMING} content={seed.timing} />}
        {seed.starting && <Accordion title={STARTING} content={seed.starting} />}
        {seed.growing && <Accordion title={GROWING} content={seed.growing} />}
        {seed.harvest && <Accordion title={HARVEST} content={seed.harvest} />}
        {seed.companion_planting && <Accordion title={COMPANION_PLANTING} content={seed.companion_planting} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
    width: '100%',
  },
  scrollView: {
    // flex: 1,
    // marginBottom: 16,
  },
});
