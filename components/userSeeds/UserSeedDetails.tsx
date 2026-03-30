import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed, UserSeedTab, Exposure } from '../../state/barrels/typesBarrel';
import { AppButton, Accordion, Heading } from '../uiComponentBarrel';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from '../seeds/SeedHeader';
import SeedQuickFacts from '../seeds/SeedQuickFacts';
import { text } from '../../styles/theme';

// UserSeedDetails.tsx: Displays the details of a single seed in the user's collection

type UserSeedDetailsProps = {
  readonly seed: UserSeed;
  readonly activeTab: UserSeedTab;
};

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
      <View style={styles.buttonContainer}>
        <AppButton
          text="Remove From My Collection"
          onPress={handleDeleteFromCollection}
          color="danger"
          size="xsmall"
          variant="solid"
          rounded
        />
      </View>
    </ScrollView>
  );
}

// ---- STYLES ----
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
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 32,
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
