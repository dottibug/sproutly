import { Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFilters } from '../../state/filters/FiltersContext';
import { SearchFilter } from '../../state/filters/filterTypes';
import { colors } from '../../styles/theme';

type FilterChipProps = {
  readonly filter: SearchFilter;
  readonly option: string;
};

export default function FilterChip({ filter, option }: FilterChipProps) {
  const { selected, setSelected } = useFilters();

  const handleRemoveFilter = () => {
    const currentSelected = selected[filter];
    const newSelected = currentSelected.filter((o) => o !== option);
    setSelected(filter, newSelected);
  };

  return (
    <Pressable style={styles.chip} onPress={handleRemoveFilter}>
      <Ionicons name="close" size={18} color="black" />
      <Text>{option}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.white,
    borderColor: colors.mediumGray,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 6,
  },
});
