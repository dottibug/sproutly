import { Alert, ScrollView, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed, BrowseSeed, Exposure } from '../../state/barrels/typesBarrel';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AppButton, Accordion, Heading } from '../uiComponentBarrel';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from '../seeds/SeedHeader';
import SeedQuickFacts from '../seeds/SeedQuickFacts';
import { colors } from '../../styles/theme';

// BrowseSeedDetails.tsx: Displays the details of a single seed in the seed catalog.

type BrowseSeedDetailsProps = {
  readonly seed: BrowseSeed;
};

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
        Alert.alert('Seed successfully added', `${seedLabel} is now in your seed collection.`);
      } else if (result === 'duplicate') {
        Alert.alert('Already in collection', 'This seed is already in your collection.');
      } else if (result === 'failed') {
        Alert.alert('Could not add seed', 'Something went wrong. Please try again.');
      } else if (result === 'no_user') {
        Alert.alert('Sign in required', 'Please sign in to add seeds to your collection.');
      }
    })();
  };

  return (
    <ScrollView style={styles.scrollStyle} contentContainerStyle={[styles.scrollContent, { paddingBottom: inUserCollection ? 0 : 24 }]}>
      <View style={styles.heroWrap}>
        <SeedImage imageUri={seed.image} size="large" />
        {!inUserCollection && (
          <Pressable
            onPress={handleAddToCollection}
            style={({ pressed }) => [styles.addOnImage, pressed && styles.addOnImagePressed]}
            accessibilityRole="button"
            accessibilityLabel="Add to my seeds">
            <Ionicons name="add" size={18} color={colors.gray300} />
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
          <Text style={styles.contentText}>{seed.description}</Text>
          <SeedQuickFacts maturesInDays={seed.maturesInDays} difficulty={seed.difficulty} />
        </View>
        {showTiming && (
          <Accordion title={TIMING}>
            <Text style={styles.contentText}>{seed.timing}</Text>
          </Accordion>
        )}
        {showStarting && (
          <Accordion title={STARTING}>
            <Text style={styles.contentText}>{seed.starting}</Text>
          </Accordion>
        )}
        {showGrowing && (
          <Accordion title={GROWING}>
            <Text style={styles.contentText}>{seed.growing}</Text>
          </Accordion>
        )}
        {showHarvest && (
          <Accordion title={HARVEST}>
            <Text style={styles.contentText}>{seed.harvest}</Text>
          </Accordion>
        )}
        {showCompanionPlanting && (
          <Accordion title={COMPANION_PLANTING}>
            <Text style={styles.contentText}>{seed.companionPlanting}</Text>
          </Accordion>
        )}
        {!inUserCollection && (
          <View style={styles.buttonContainer}>
            <AppButton text="Add to My Collection" onPress={handleAddToCollection} color="primary" size="xsmall" variant="solid" rounded />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ---- CONSTANTS ----
const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';

// ---- STYLES ----
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
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: colors.blackSheer75,
    borderWidth: 1,
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
    color: colors.gray300,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  description: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.primary,
  },
});
