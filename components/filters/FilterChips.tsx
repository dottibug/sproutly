import { View, StyleSheet } from 'react-native';
import { useFilters } from '../../state/filters/FiltersContext';
import { SEARCH_FILTER_NAMES } from '../../state/filters/filterTypes';
import FilterChip from './FilterChip';
import { colors } from '../../styles/theme';

// FilterChips.tsx: Renders a list of filter chips for the selected filters. Used on the 'My Seeds' and 'Browse' screens to show which filters are currently applied.

export default function FilterChips() {
  const { selected } = useFilters();
  const chips = SEARCH_FILTER_NAMES.flatMap((filter) => selected[filter].map((option) => ({ filter, option })));

  return (
    <View style={styles.filterChipsContainer}>
      <View style={styles.chipsContainer}>
        {chips.map((chip) => (
          <FilterChip key={chip.option} filter={chip.filter} option={chip.option} />
        ))}
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  filterChipsContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
});
