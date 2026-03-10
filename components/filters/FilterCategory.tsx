import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { colors } from '../../styles/theme';
import FilterOption from './FilterOption';
import { useFilters } from '../../lib/contexts/FiltersContext';
import { Filter } from '../../lib/types';

type FilterCategoryProps = {
  readonly title: string;
  readonly options: string[];
  readonly filter: Filter;
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

const styles = StyleSheet.create({
  filterWrapper: {
    backgroundColor: '#f5f5f5',
    paddingTop: 0,
    paddingBottom: 4,
  },
  filterContainer: {
    backgroundColor: '#f5f5f5',
    marginVertical: 0,
  },
  filterTitle: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  filterContent: {},
  filterOptions: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
