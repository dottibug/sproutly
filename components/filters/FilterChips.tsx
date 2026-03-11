import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useFilters } from '../../lib/contexts/FiltersContext';
import { FILTERS } from '../../lib/utils/filterUtils';
import FilterChip from './FilterChip';
import { colors } from '../../styles/theme';

// TODO: Styling of chips and clear all filters button
export default function FilterChips() {
  const { selected, clearAllSelected } = useFilters();

  const chips = FILTERS.flatMap((filter) => selected[filter].map((option) => ({ filter, option })));

  const handleClearAllFilters = () => clearAllSelected();

  return (
    <View style={styles.filterChipsContainer}>
      <Pressable style={styles.clearAllFiltersButton} onPress={handleClearAllFilters}>
        <Text style={styles.clearAllFiltersText}>Clear All Filters</Text>
      </Pressable>
      <View style={styles.chipsContainer}>
        {chips.map((chip) => (
          <FilterChip key={chip.option} filter={chip.filter} option={chip.option} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  filterChipsContainer: {
    backgroundColor: '#f5f5f5',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAllFiltersButton: {
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  clearAllFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'blue',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
