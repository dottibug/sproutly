import { View, StyleSheet } from 'react-native';
import Tab from './Tab';

type TabsProps = {
  readonly activeTab: string;
  readonly onTabPress: () => void;
};

export default function Tabs({ onTabPress, activeTab }: TabsProps) {
  return (
    <View style={styles.tabs}>
      <Tab label="My Seeds" onPress={onTabPress} activeTab={activeTab} />
      <Tab label="Browse" onPress={onTabPress} activeTab={activeTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    gap: 24,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
});
