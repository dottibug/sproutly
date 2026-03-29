import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from '../seeds/SeedHeader';
import Heading from '../ui/Heading';
import { text } from '../../styles/theme';
import SeedQuickFacts from '../seeds/SeedQuickFacts';
import Accordion from '../ui/Accordion';
import Button from '../ui/buttons/AppButton';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { UserSeedTab } from '../../state/app/appTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import { useRouter } from 'expo-router';

const DELETE = 'Delete from Collection';

type UserSeedDetailsProps = {
  readonly seed: UserSeed;
  readonly activeTab: UserSeedTab;
};

// UserSeedDetails component displays the details of a single seed in the user's collection
export default function UserSeedDetails({ seed, activeTab }: UserSeedDetailsProps) {
  const router = useRouter();
  const { deleteByCatalogId, deleteByCustomId } = useUserSeed();

  const showDescription = seed.description !== null && seed.description !== '';
  const showTiming = seed.timing !== null && seed.timing !== '';
  const showStarting = seed.starting !== null && seed.starting !== '';
  const showGrowing = seed.growing !== null && seed.growing !== '';
  const showHarvest = seed.harvest !== null && seed.harvest !== '';
  const showCompanionPlanting = seed.companionPlanting !== null && seed.companionPlanting !== '';

  const handleDeleteFromCollection = () => {
    if (seed.catalogSeedId) deleteByCatalogId(seed);
    else deleteByCustomId(seed);
    router.replace({
      pathname: '/(tabs)/home',
      params: {
        tab: 'mySeeds',
      },
    });
  };

  return (
    <ScrollView style={[styles.scrollStyle, { display: activeTab === 'Seed' ? 'flex' : 'none' }]}>
      <SeedImage imageUri={seed.image} size="large" resizeMode="cover" />

      <View>
        <SeedHeader
          variety={seed.variety}
          plant={seed.plant}
          beanType={seed.beanType}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={true}
          category={seed.category}
          exposure={seed.exposure as Exposure}
        />

        {showDescription && (
          <View style={styles.description}>
            <Heading size="medium">Description</Heading>
            <Text style={text.medium}>{seed.description}</Text>
            <SeedQuickFacts maturesInDays={seed.maturesInDays} difficulty={seed.difficulty} />
          </View>
        )}

        {showTiming && (
          <Accordion title={'Timing'}>
            <Text style={text.medium}>{seed.timing}</Text>
          </Accordion>
        )}

        {showStarting && (
          <Accordion title={'Starting'}>
            <Text style={text.medium}>{seed.starting}</Text>
          </Accordion>
        )}

        {showGrowing && (
          <Accordion title={'Growing'}>
            <Text style={text.medium}>{seed.growing}</Text>
          </Accordion>
        )}

        {showHarvest && (
          <Accordion title={'Harvest'}>
            <Text style={text.medium}>{seed.harvest}</Text>
          </Accordion>
        )}

        {showCompanionPlanting && (
          <Accordion title={'Companion Planting'}>
            <Text style={text.medium}>{seed.companionPlanting}</Text>
          </Accordion>
        )}
      </View>

      <View style={styles.dangerSection}>
        <Button
          text={DELETE}
          color="danger"
          variant="outline"
          size="medium"
          width="100%"
          icon="delete"
          onPress={handleDeleteFromCollection}
        />
      </View>
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
  dangerSection: {
    marginTop: 8,
    marginBottom: 40,
    paddingHorizontal: 16,
    paddingTop: 28,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(214, 85, 100, 0.25)',
  },
});
