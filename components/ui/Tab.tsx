import { StyleSheet, Pressable, Text } from 'react-native';
import { colors } from '../../styles/theme';

type TabProps = {
  readonly label: string;
  readonly active: boolean;
  readonly onPress: () => void;
};

// Single tab within a list of tabs. Adds a bottom border to the active tab.
export default function Tab({ label, active, onPress }: TabProps) {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.tab, active ? styles.activeTab : styles.inactiveTab]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  inactiveTab: {
    borderBottomWidth: 0,
    borderColor: 'transparent',
    color: '#999',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderColor: colors.hunterGreen,
    color: colors.hunterGreen,
  },
});
