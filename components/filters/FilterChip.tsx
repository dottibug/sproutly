import { Pressable, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFilters } from '../../state/filters/FiltersContext';
import { SearchFilter } from '../../state/filters/filterTypes';

// FilterChip.tsx: Renders a single filter chip for a selected filter. Used on the 'My Seeds' and 'Browse' screens to show which filters are currently applied.

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

// ---- STYLES ----
const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    marginVertical: 1,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingLeft: 8,
    paddingRight: 12,
  },
});
