import { View, StyleSheet } from 'react-native';
import Tab from './Tab';

type TabsProps = {
  readonly tabs: string[];
  readonly activeTab: string;
  readonly onTabPress: (tab: string) => void;
};

// Horizontal list of tabs used for the user collection and browse seed lists
export default function Tabs({ tabs, activeTab, onTabPress }: TabsProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <Tab key={tab} label={tab} active={activeTab === tab} onPress={() => onTabPress(tab)} />
      ))}
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
