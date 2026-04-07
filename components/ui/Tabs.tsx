import { View, StyleSheet } from 'react-native';
import Tab from './Tab';
import { colors } from '../../styles/theme';
import IconButton from './buttons/IconButton';

// Tabs.tsx: Horizontal list of tabs used for the user collection and browse seed lists. Used in the Home screen to render the 'My Seeds' and 'Browse' tabs. Also used in the 'Seed Details' screen to render the 'Notes', 'Photos', 'Reminders', and 'History' tabs.

type TabsProps = {
  readonly tabs: string[];
  readonly activeTab: string;
  readonly onTabPress: (tab: string) => void;
  readonly badgeCounts?: Record<string, number>;
};

export default function Tabs({ tabs, activeTab, onTabPress, badgeCounts }: TabsProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <Tab key={tab} label={tab} active={activeTab === tab} onPress={() => onTabPress(tab)} badgeCount={badgeCounts?.[tab]} />
      ))}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  tabs: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
});
