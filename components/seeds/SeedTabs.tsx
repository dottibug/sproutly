import { View, StyleSheet } from 'react-native';
import Tab from './ListTab';
import SeedTab from './SeedTab';

const SEED = 'seed';
const NOTES = 'notes';
const PHOTOS = 'photos';
const REMINDERS = 'reminders';
const HISTORY = 'history';

type ActiveTab = 'seed' | 'notes' | 'photos' | 'reminders' | 'history';

type SeedTabsProps = {
  readonly activeTab: string;
  readonly onTabPress: (tab: ActiveTab) => void;
};
// Seed, Notes, Photos, Reminders, History
export default function SeedTabs({ activeTab, onTabPress }: SeedTabsProps) {
  return (
    <View style={styles.tabs}>
      <SeedTab label="Seed" onPress={() => onTabPress(SEED)} activeTab={activeTab} />
      <SeedTab label="Notes" onPress={() => onTabPress(NOTES)} activeTab={activeTab} />
      <SeedTab label="Photos" onPress={() => onTabPress(PHOTOS)} activeTab={activeTab} />
      <SeedTab label="Reminders" onPress={() => onTabPress(REMINDERS)} activeTab={activeTab} />
      <SeedTab label="History" onPress={() => onTabPress(HISTORY)} activeTab={activeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
});
