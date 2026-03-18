import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from './SeedHeader';
import Heading from '../ui/Heading';
import { typography } from '../../styles/theme';
import SeedQuickFacts from './SeedQuickFacts';
import Accordion from '../accordion/Accordion';
import Button from '../ui/buttons/Button';
import { Exposure, UserSeedItem } from '../../lib/types';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';
const DELETE = 'Delete from Collection';

type ActiveTab = 'seed' | 'notes' | 'photos' | 'reminders' | 'history';

type UserSeedDetailsProps = {
  readonly seed: UserSeedItem;
  readonly activeTab: ActiveTab;
};

export default function UserSeedDetails({ seed, activeTab }: UserSeedDetailsProps) {
  const { deleteSeedByCustomId } = useUserSeeds();

  const handleDeleteFromCollection = () => {
    deleteSeedByCustomId(seed);
  };

  console.log('activeTab in UserSeedDetails', activeTab);
  console.log('seed in UserSeedDetails', seed);

  return (
    <ScrollView style={[styles.scrollStyle, { display: activeTab === 'seed' ? 'flex' : 'none' }]}>
      <SeedImage imageUri={seed.image} size="large" />

      <View>
        <SeedHeader
          name={seed.name}
          category={seed.category}
          beanType={seed.bean_type}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={true}
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
