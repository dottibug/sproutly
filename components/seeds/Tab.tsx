import { Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

const MY_SEEDS = 'mySeeds';
const BROWSE = 'browse';

type TabProps = {
  readonly label: string;
  readonly onPress: () => void;
  readonly activeTab: string;
};

export default function Tab({ label, onPress, activeTab }: TabProps) {
  const isActive = (label === 'My Seeds' && activeTab === MY_SEEDS) || (label === 'Browse' && activeTab === BROWSE);

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
