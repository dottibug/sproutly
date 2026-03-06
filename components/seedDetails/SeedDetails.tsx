import { ScrollView, Image, View, StyleSheet } from 'react-native';
import { CatalogSeedItem, UserSeedItem } from '../../lib/seedCatalog';
import type { ExposureType } from '../../lib/seedCatalog';
import Accordion from '../accordion/Accordion';
import SeedQuickFacts from './SeedQuickFacts';
import SeedHeader from './SeedHeader';
import Button from '../ui/buttons/Button';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import { useLocalSearchParams, useRouter } from 'expo-router';

// TODO: the screen should automatically be scrolled to their notes/photos/history section of that seed.

// TODO: snackbar confirmation or a little added animation or something when add seed is successful; also state of the catalog seed details screen needs to be refreshed to make inUserCollection true. Ditto with deleting a seed.

type SeedDetailsProps = {
  readonly seed: CatalogSeedItem | UserSeedItem;
};

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';
const ADD = 'Add to Collection';
const DELETE = 'Delete from Collection';
const MY_SEED = 'My Seed Details';

export default function SeedDetails({ seed }: SeedDetailsProps) {
  const router = useRouter();
  const { tab } = useLocalSearchParams();
  const { addSeedFromCatalog, deleteSeedByCatalogId, deleteSeedByCustomId, seeds: userSeeds } = useUserSeeds();

  const inUserCollection = userSeeds.some((s) => s.catalog_seed_id === seed.id);
  const isCustomSeed = 'custom_seed_id' in seed && seed.custom_seed_id !== null;

  const handleAddToCollection = () => {
    addSeedFromCatalog(seed);
  };

  const handleDeleteFromCollection = () => {
    if (isCustomSeed) deleteSeedByCustomId(seed);
    else deleteSeedByCatalogId(seed as UserSeedItem);
    router.replace(`/home/`);
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
    <ScrollView>
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

        <Accordion title={DESCRIPTION} content={seed.description as string} openByDefault={true}>
          <SeedQuickFacts maturesInDays={seed.matures_in_days} difficulty={seed.difficulty} />
        </Accordion>

        {seed.timing && <Accordion title={TIMING} content={seed.timing} />}
        {seed.starting && <Accordion title={STARTING} content={seed.starting} />}
        {seed.growing && <Accordion title={GROWING} content={seed.growing} />}
        {seed.harvest && <Accordion title={HARVEST} content={seed.harvest} />}
        {seed.companion_planting && <Accordion title={COMPANION_PLANTING} content={seed.companion_planting} />}
      </View>

      {tab === 'catalog' && !inUserCollection && (
        <View style={styles.buttonContainer}>
          <Button text={ADD} onPress={handleAddToCollection} />
        </View>
      )}

      {tab === 'catalog' && inUserCollection && (
        <View style={styles.buttonContainer}>
          <Button text={MY_SEED} onPress={handleGoToMySeed} />
        </View>
      )}

      {tab === 'home' && (
        <View style={styles.buttonContainer}>
          <Button text={DELETE} color="danger" size="medium" onPress={handleDeleteFromCollection} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    // marginBottom: -16,
  },
});
