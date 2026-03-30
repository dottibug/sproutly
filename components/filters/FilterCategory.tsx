import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useFilters } from '../../state/filters/FiltersContext';
import { type SearchFilter } from '../../state/filters/filterTypes';
import FilterOption from './FilterOption';
import { colors } from '../../styles/theme';

// FilterCategory.tsx: Renders a filter category for the filters sheet modal

type FilterCategoryProps = {
  readonly title: string;
  readonly options: string[];
  readonly filter: SearchFilter;
};

export default function FilterCategory({ title, options, filter }: FilterCategoryProps) {
  const { openFilters, setOpenFilters } = useFilters();
  const isOpen = openFilters[filter];

  const handlePress = () => {
    const newOpen = !isOpen;
    setOpenFilters(filter, newOpen);
  };

  return (
    <List.Accordion
      title={title}
      titleStyle={styles.filterTitle}
      style={styles.filterWrapper}
      containerStyle={styles.filterContainer}
      contentStyle={styles.filterContent}
      rippleColor="transparent"
      expanded={isOpen}
      onPress={handlePress}>
      <View style={styles.filterOptions}>
        {options.map((option) => (
          <FilterOption key={option} option={option} filter={filter} />
        ))}
      </View>
    </List.Accordion>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  filterWrapper: {
    backgroundColor: colors.white,
    paddingTop: 0,
    paddingBottom: 4,
  },
  filterContainer: {
    backgroundColor: colors.white,
    marginVertical: 0,
  },
  filterTitle: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  filterContent: {
    backgroundColor: colors.white,
  },
  filterOptions: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingLeft: 16,
    marginRight: 46,
    paddingBottom: 24,
  },
});
