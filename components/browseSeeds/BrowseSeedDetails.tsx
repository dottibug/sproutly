import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import { Alert, ScrollView, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from '../seeds/SeedHeader';
import Heading from '../ui/Heading';
import { text, colors } from '../../styles/theme';
import SeedQuickFacts from '../seeds/SeedQuickFacts';
import Accordion from '../ui/Accordion';
import { Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import Ionicons from '@expo/vector-icons/Ionicons';

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';

type BrowseSeedDetailsProps = {
  readonly seed: BrowseSeed;
};

// BrowseSeed component displays the details of a single seed in the browse list
export default function BrowseSeedDetails({ seed }: BrowseSeedDetailsProps) {
  const { addSeedFromBrowse, seeds: userSeeds } = useUserSeed();

  const inUserCollection = userSeeds.some((s: UserSeed) => s.catalogSeedId === seed.id);

  const showTiming = seed.timing !== null;
  const showStarting = seed.starting !== null;
  const showGrowing = seed.growing !== null;
  const showHarvest = seed.harvest !== null;
  const showCompanionPlanting = seed.companionPlanting !== null;

  const handleAddToCollection = () => {
    const seedLabel = `${seed.variety} ${seed.plant}`.trim();
    void (async () => {
      const result = await addSeedFromBrowse(seed);
      if (result === 'added') {
        Alert.alert('Added to collection', `${seedLabel} is now in My Seeds.`);
      } else if (result === 'duplicate') {
        Alert.alert('Already in collection', 'This seed is already in My Seeds.');
      } else if (result === 'failed') {
        Alert.alert('Could not add seed', 'Something went wrong. Please try again.');
      } else if (result === 'no_user') {
        Alert.alert('Sign in required', 'Please sign in to add seeds to your collection.');
      }
    })();
  };

  return (
    <ScrollView style={styles.scrollStyle} contentContainerStyle={styles.scrollContent}>
      <View style={styles.heroWrap}>
        <SeedImage imageUri={seed.image} size="large" />
        {!inUserCollection && (
          <Pressable
            onPress={handleAddToCollection}
            style={({ pressed }) => [styles.addOnImage, pressed && styles.addOnImagePressed]}
            accessibilityRole="button"
            accessibilityLabel="Add to my seeds">
            <Ionicons name="add" size={22} color={colors.greenDark} />
            <Text style={styles.addOnImageText}>Add to my seeds</Text>
          </Pressable>
        )}
      </View>

      <View>
        <SeedHeader
          variety={seed.variety}
          plant={seed.plant}
          beanType={seed.beanType}
          seedSKU={seed.sku}
          catalogId={seed.id}
          inUserCollection={inUserCollection}
          category={seed.category}
          exposure={seed.exposure as Exposure}
        />

        <View style={styles.description}>
          <Heading size="medium">{DESCRIPTION}</Heading>
          <Text style={text.medium}>{seed.description}</Text>
          <SeedQuickFacts maturesInDays={seed.maturesInDays} difficulty={seed.difficulty} />
        </View>

        {showTiming && (
          <Accordion title={TIMING}>
            <Text style={text.medium}>{seed.timing}</Text>
          </Accordion>
        )}

        {showStarting && (
          <Accordion title={STARTING}>
            <Text style={text.medium}>{seed.starting}</Text>
          </Accordion>
        )}

        {showGrowing && (
          <Accordion title={GROWING}>
            <Text style={text.medium}>{seed.growing}</Text>
          </Accordion>
        )}

        {showHarvest && (
          <Accordion title={HARVEST}>
            <Text style={text.medium}>{seed.harvest}</Text>
          </Accordion>
        )}

        {showCompanionPlanting && (
          <Accordion title={COMPANION_PLANTING}>
            <Text style={text.medium}>{seed.companionPlanting}</Text>
          </Accordion>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  heroWrap: {
    position: 'relative',
    width: '100%',
  },
  addOnImage: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  addOnImagePressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  addOnImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.greenDark,
    letterSpacing: 0.2,
  },
  description: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});
