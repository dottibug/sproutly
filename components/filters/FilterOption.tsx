import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFilters } from '../../state/filters/FiltersContext';
import { type SearchFilter } from '../../state/filters/filterTypes';
import { colors } from '../../styles/theme';

type FilterOptionProps = {
  readonly option: string;
  readonly filter: SearchFilter;
};

export default function FilterOption({ option, filter }: FilterOptionProps) {
  const { selected, setSelected } = useFilters();
  const isSelected = selected[filter].includes(option);

  const handlePress = () => {
    const currentSelected = selected[filter];

    const newSelected = currentSelected.includes(option) ? currentSelected.filter((o) => o !== option) : [...currentSelected, option];

    setSelected(filter, newSelected);
  };

  return (
    <TouchableOpacity style={[styles.filterOption, isSelected && styles.filterOptionSelected]} onPress={handlePress}>
      <Text style={styles.filterText}>{option}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterOption: {
    borderWidth: 1,
    borderColor: colors.mediumGray,
    padding: 6,
  },
  filterOptionSelected: {
    backgroundColor: colors.lightGray,
  },
  filterText: {},
});
