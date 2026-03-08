import { View, StyleSheet } from 'react-native';
import Dropdown from '../accordion/Dropdown';
import { colors } from '../../styles/theme';
import {
  useFilters,
  PLANT_TYPES,
  STARTING,
  EXPOSURE,
  SEASON,
  MONTH,
  READY_TO_HARVEST,
  DIFFICULTY,
} from '../../lib/contexts/FiltersContext';
import FilterSection from './FilterSection';

// Filter Options: expandable dropdowns or horizontal scrollable...
// I think dropdown; if filters are selected, then when the user closes the filter dropdown, show the selected filters in a chip list.

// Plant type: Vegetable, Flower, Fruit, Herb

// Difficulty: easy, standard, intermediate, advanced, expert

// Exposure: Full sun, Full sun to part shade, Part shade

// Matures in (for veg and fruit only) AKA Ready to harvest:
// under 50 (30, 40),
// 50 to 70 (50, 60, 70),
// 80 to 100 (80, 90, 100),
// 110 to 130 (110, 120, 130),
// over 130

// Planting: Start indoors, Direct sow
// Starting season: Winter, Spring, Summer, Fall
// Starting month: 1 to 12

// The filter customization users can choose is the order of the filters and which are expanded by default. The initial order and default will be:
// Plant type – always expanded
// Starting – always expanded
// Exposure
// Season
// Month
// Ready to harvest
// Difficulty

export default function Filters() {
  const { expandOnOpen } = useFilters();

  return (
    <Dropdown title="Filter Seeds" onExpand={expandOnOpen}>
      <View style={styles.filtersContainer}>
        <FilterSection title="Plant Type" options={PLANT_TYPES} filter="plantType" />
        <FilterSection title="Starting" options={STARTING} filter="starting" />
        <FilterSection title="Exposure" options={EXPOSURE} filter="exposure" />
        <FilterSection title="Season" options={SEASON} filter="season" />
        <FilterSection title="Month" options={MONTH} filter="month" />
        <FilterSection title="Ready to Harvest" options={READY_TO_HARVEST} filter="readyToHarvest" />
        <FilterSection title="Difficulty" options={DIFFICULTY} filter="difficulty" />
      </View>
    </Dropdown>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    flexDirection: 'column',
    gap: 6,
  },
  tempFilter: {
    marginBottom: 12,
  },
  tempFilterTitle: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tempFilterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tempFilterOption: {
    borderWidth: 1,
    borderColor: colors.mediumGray,
    padding: 6,
  },
});
