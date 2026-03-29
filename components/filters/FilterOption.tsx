import { Text, StyleSheet, Pressable } from 'react-native';
import { useFilters } from '../../state/filters/FiltersContext';
import { type SearchFilter } from '../../state/filters/filterTypes';
import { colors } from '../../styles/theme';

type FilterOptionProps = {
  readonly option: string;
  readonly filter: SearchFilter;
};

// FilterOption.tsx: Renders a filter option for the filters sheet modal
export default function FilterOption({ option, filter }: FilterOptionProps) {
  const { selected, setSelected } = useFilters();
  const isSelected = selected[filter].includes(option);

  const handlePress = () => {
    const currentSelected = selected[filter];

    const newSelected = currentSelected.includes(option) ? currentSelected.filter((o) => o !== option) : [...currentSelected, option];

    setSelected(filter, newSelected);
  };

  return (
    <Pressable style={[styles.filterOption, isSelected && styles.filterOptionSelected]} onPress={handlePress}>
      <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>{option}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filterOption: {
    backgroundColor: colors.gray200,
    alignSelf: 'flex-start',
    borderRadius: 1,
    marginVertical: 2,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
  },
  filterOptionSelected: {
    backgroundColor: colors.greenLight,
  },
  filterText: {
    color: colors.blackSheer55,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: colors.white,
  },
});
