import { View, StyleSheet } from 'react-native';
import ListTab from './ListTab';

type ListTabsProps = {
  readonly activeTab: string;
  readonly onTabPress: () => void;
};

export default function ListTabs({ onTabPress, activeTab }: ListTabsProps) {
  return (
    <View style={styles.tabs}>
      <ListTab label="My Seeds" onPress={onTabPress} activeTab={activeTab} />
      <ListTab label="Browse" onPress={onTabPress} activeTab={activeTab} />
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
