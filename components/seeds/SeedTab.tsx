import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

type SeedTabProps = {
  readonly label: string;
  readonly activeTab: string;
  readonly onPress: () => void;
};

export default function SeedTab({ label, activeTab, onPress }: SeedTabProps) {
  const isActive =
    (label === 'Seed' && activeTab === 'seed') ||
    (label === 'Notes' && activeTab === 'notes') ||
    (label === 'Photos' && activeTab === 'photos') ||
    (label === 'Reminders' && activeTab === 'reminders') ||
    (label === 'History' && activeTab === 'history');

  const borderBottomWidth = isActive ? 3 : 0;

  const borderColor = isActive ? colors.hunterGreen : 'transparent';

  const textColor = isActive ? colors.hunterGreen : '#999';

  const tabTextStyle = {
    color: textColor,
    borderBottomWidth,
    borderColor,
  };

  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.tabText, tabTextStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
});
