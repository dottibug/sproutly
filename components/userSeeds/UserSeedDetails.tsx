import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from '../seeds/SeedHeader';
import Heading from '../ui/Heading';
import { typography } from '../../styles/theme';
import SeedQuickFacts from '../seeds/SeedQuickFacts';
import Accordion from '../ui/Accordion';
import Button from '../ui/buttons/Button';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';
import { UserSeedTab } from '../../state/app/appTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { Exposure } from '../../state/userSeeds/types/seedInfoTypes';

const DELETE = 'Delete from Collection';

type UserSeedDetailsProps = {
  readonly seed: UserSeed;
  readonly activeTab: UserSeedTab;
};

// UserSeedDetails component displays the details of a single seed in the user's collection
export default function UserSeedDetails({ seed, activeTab }: UserSeedDetailsProps) {
  const { deleteByCustomId } = useUserSeed();

  const showTiming = seed.timing !== null;
  const showStarting = seed.starting !== null;
  const showGrowing = seed.growing !== null;
  const showHarvest = seed.harvest !== null;
  const showCompanionPlanting = seed.companionPlanting !== null;

  const handleDeleteFromCollection = () => {
    deleteByCustomId(seed);
  };

  return (
    <ScrollView style={[styles.scrollStyle, { display: activeTab === 'Seed' ? 'flex' : 'none' }]}>
      <SeedImage imageUri={seed.image} size="large" />

      <View>
        <SeedHeader
          name={seed.name}
          category={seed.category}
          beanType={seed.beanType}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={true}
          type={seed.type}
          exposure={seed.exposure as Exposure}
        />

        <View style={styles.description}>
          <Heading size="medium">Description</Heading>
          <Text style={typography.textMedium}>{seed.description}</Text>
          <SeedQuickFacts maturesInDays={seed.maturesInDays} difficulty={seed.difficulty} />
        </View>

        {showTiming && <Accordion title={'Timing'} content={seed.timing} />}
        {showStarting && <Accordion title={'Starting'} content={seed.starting} />}
        {showGrowing && <Accordion title={'Growing'} content={seed.growing} />}
        {showHarvest && <Accordion title={'Harvest'} content={seed.harvest} />}
        {showCompanionPlanting && <Accordion title={'Companion Planting'} content={seed.companionPlanting} />}
      </View>

      <View style={styles.buttonContainer}>
        <Button text={DELETE} color="danger" size="medium" width={268} onPress={handleDeleteFromCollection} />
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
  buttonContainer: {
    marginBottom: 32,
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
