import { Text, View, StyleSheet } from 'react-native';
import AppModal from '../ui/AppModal';
import InfoModalListItem from './InfoModalListItem';
import { colors, text } from '../../styles/theme';

// InfoModal.tsx: Used to display a modal in CustomSeedSheet.tsx. The modals explain the different options for choosing the difficuly and exposure of a custom seed.

type InfoModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly infoModalType: infoModal | null;
  readonly title: string;
};

export default function InfoModal({ visible, onRequestClose, infoModalType, title }: InfoModalProps) {
  if (infoModalType === null) return null;

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      {infoModalType === 'difficulty' && <DifficultyInfo />}
      {infoModalType === 'exposure' && <ExposureInfo />}
    </AppModal>
  );
}

function DifficultyInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Text style={styles.subheading}>How easy is it to grow?</Text>
      <View style={styles.list}>
        {difficultyList.map((item) => (
          <InfoModalListItem key={item.subheading} subheading={item.subheading} text={item.text} />
        ))}
      </View>
    </View>
  );
}

function ExposureInfo() {
  return (
    <View style={styles.infoModalContent}>
      <Text style={styles.subheading}>How much sun does it need?</Text>
      <View style={styles.list}>
        {exposureList.map((item) => (
          <InfoModalListItem key={item.subheading} subheading={item.subheading} text={item.text} />
        ))}
      </View>
    </View>
  );
}

// ---- TYPES & CONSTANTS ----
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

const exposureList = [
  {
    subheading: 'Full sun',
    text: 'Plants need 6-8 hours of direct sunlight per day.',
  },
  {
    subheading: 'Full sun to part shade',
    text: 'Plants need 4-6 hours of direct sunlight per day.',
  },
  {
    subheading: 'Part shade',
    text: 'Plants need 2-4 hours of direct sunlight per day.',
  },
];

const difficultyList = [
  {
    subheading: 'Easy',
    text: "Plants grow easily even if conditions aren't perfect.",
  },
  {
    subheading: 'Standard',
    text: 'Plants grow well with average care.',
  },
  {
    subheading: 'Intermediate',
    text: 'Plants need a bit more care to thrive, such as starting indoors or warm soil temperatures.',
  },
  {
    subheading: 'Advanced',
    text: 'Plants are picky about timing, temperature, or other conditions.',
  },
  {
    subheading: 'Expert',
    text: 'Plants require cold stratification, overwintering, or other specialized care.',
  },
];

// ---- STYLES ----
const styles = StyleSheet.create({
  infoModalContent: {
    gap: 16,
  },
  subheading: {
    marginTop: -10,
    fontSize: 18,
    fontWeight: text.bold.fontWeight,
    color: colors.greenMedium,
    textAlign: 'center',
    marginBottom: 8,
  },
  list: {
    gap: 16,
  },
});
