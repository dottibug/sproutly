import { useRouter } from 'expo-router';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import { CatalogSeedItem, Exposure } from '../../lib/types';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from './SeedHeader';
import Heading from '../ui/Heading';
import { typography } from '../../styles/theme';
import SeedQuickFacts from './SeedQuickFacts';
import Accordion from '../accordion/Accordion';
import Button from '../ui/buttons/Button';

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';
const ADD = 'Add to Collection';
const MY_SEED = 'My Seed Details';

type BrowseSeedDetailsProps = {
  readonly seed: CatalogSeedItem;
};

export default function BrowseSeedDetails({ seed }: BrowseSeedDetailsProps) {
  const router = useRouter();

  const { addSeedFromCatalog, deleteSeedByCatalogId, seeds: userSeeds } = useUserSeeds();

  const inUserCollection = userSeeds.some((s) => s.catalog_seed_id === seed.id);

  const handleAddToCollection = () => {
    addSeedFromCatalog(seed);
  };

  // Redirects user to this seed in their collection (home tab)
  const handleGoToMySeed = () => {
    router.replace({
      pathname: `/home/${seed.id}`,
      params: {
        source: 'catalog',
        tab: 'home',
      },
    });
  };

  return (
    <ScrollView style={styles.scrollStyle}>
      <SeedImage imageUri={seed.image} size="large" />

      <View>
        <SeedHeader
          name={seed.name}
          category={seed.category}
          beanType={seed.bean_type}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={inUserCollection}
          type={seed.type}
          exposure={seed.exposure as Exposure}
        />

        <View style={styles.description}>
          <Heading size="medium">{DESCRIPTION}</Heading>
          <Text style={typography.textMedium}>{seed.description}</Text>
          <SeedQuickFacts maturesInDays={seed.matures_in_days} difficulty={seed.difficulty} />
        </View>

        {seed.timing && <Accordion title={TIMING} content={seed.timing} />}
        {seed.starting && <Accordion title={STARTING} content={seed.starting} />}
        {seed.growing && <Accordion title={GROWING} content={seed.growing} />}
        {seed.harvest && <Accordion title={HARVEST} content={seed.harvest} />}
        {seed.companion_planting && <Accordion title={COMPANION_PLANTING} content={seed.companion_planting} />}
      </View>

      {!inUserCollection && (
        <View style={styles.buttonContainer}>
          <Button text={ADD} width={218} size="medium" onPress={handleAddToCollection} />
        </View>
      )}

      {inUserCollection && (
        <View style={styles.buttonContainer}>
          <Button text={MY_SEED} size="medium" onPress={handleGoToMySeed} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
  },
  image: {
    height: 400,
    width: '100%',
  },
  description: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 32,
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
