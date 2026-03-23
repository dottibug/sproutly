import AppModal from '../ui/AppModal';
import { Text, View, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';

type infoModal =
  | 'difficulty'
  | 'exposure'
  | 'maturesInDays'
  | 'description'
  | 'timing'
  | 'starting'
  | 'growing'
  | 'harvest'
  | 'companionPlanting';

type InfoModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly infoModalType: infoModal | null;
};

export default function InfoModal({ visible, onRequestClose, infoModalType }: InfoModalProps) {
  if (infoModalType === null) return null;

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      {infoModalType === 'difficulty' && <DifficultyInfo />}
      {infoModalType === 'exposure' && <ExposureInfo />}
      {infoModalType === 'maturesInDays' && <MaturesInDaysInfo />}
      {infoModalType === 'description' && <DescriptionInfo />}
      {infoModalType === 'timing' && <TimingInfo />}
      {infoModalType === 'starting' && <StartingInfo />}
      {infoModalType === 'growing' && <GrowingInfo />}
      {infoModalType === 'harvest' && <HarvestInfo />}
      {infoModalType === 'companionPlanting' && <CompanionPlantingInfo />}
    </AppModal>
  );
}

function DifficultyInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Difficulty</Heading>
      <Text>How forgiving or fussy the plant is.</Text>
      <Text>Easy: Plants grow easily even if conditions aren't perfect.</Text>
      <Text>Standard: Plants grow well with average care.</Text>
      <Text>Intermediate: Plants need a bit more care to thrive, such as starting indoors or warm soil temperatures.</Text>
      <Text>Advanced: Plants are picky about timing, temperature, or other conditions.</Text>
      <Text>Expert: Plants require cold stratification, overwintering, or other specialized care.</Text>
    </View>
  );
}

function ExposureInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Exposure</Heading>
      <Text>How much direct sunlight the plant needs to thrive.</Text>
      <Text>Full sun: Plants need 6-8 hours of direct sunlight per day.</Text>
      <Text>Full sun to part shade: Plants need 4-6 hours of direct sunlight per day.</Text>
      <Text>Part shade: Plants need 2-4 hours of direct sunlight per day.</Text>
    </View>
  );
}

function MaturesInDaysInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Matures In Days</Heading>
      <Text>Number of days from sowing to harvest or bloom.</Text>
    </View>
  );
}

function DescriptionInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Description</Heading>
      <Text>Short overview of this variety, such as flavour, size, growth habit, heirloom status, etc.</Text>
    </View>
  );
}

function TimingInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Timing</Heading>
      <Text>
        When to plant this variety, and what conditions the seed needs to thrive: direct sow vs start indoors, soil temperature, sow after
        last frost, etc.
      </Text>
    </View>
  );
}

function StartingInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Starting</Heading>
      <Text>How to put the seeds in the soil: depth, spacing, thinning, etc.</Text>
    </View>
  );
}

function GrowingInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Growing</Heading>
      <Text>How to grow the plants: watering, fertilizing, staking, pruning, etc.</Text>
    </View>
  );
}

function HarvestInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Harvest</Heading>
      <Text>When to harvest the plants: fruit colour, size, maturity, etc.</Text>
    </View>
  );
}

function CompanionPlantingInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Heading size="small">Companion Planting</Heading>
      <Text>Good neighbours, plants to avoid, or companions that help with pollination and pest control.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoModalContent: {
    gap: 8,
  },
});
