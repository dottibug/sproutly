import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useState } from 'react';
import { useFilters, FILTER_MAP, FILTER_OPTIONS } from '../../lib/contexts/FiltersContext';
import FilterCategory from './FilterCategory';
import { colors } from '../../styles/theme';

// TODO (if time at end): when filters are collapsed, any active filters should show in a chip list (that can be cleared individually or all at once with a clear all command)

// TODO: Adjust the empty seed message. If user has no seeds in collection, can stay as is. If user has seeds but filters (or search) result in no matches, need a new message.

const FILTERS_TITLE = 'Filter Seeds';

export default function Filters() {
  const [open, setOpen] = useState(false);
  const { applyOpenFilters, preferences } = useFilters();

  const handlePress = () => {
    const newOpen = !open;
    setOpen(newOpen);
    if (newOpen) applyOpenFilters();
  };

  return (
    <List.Accordion
      title={FILTERS_TITLE}
      titleStyle={styles.filtersTitle}
      style={styles.filtersAccordion}
      expanded={open}
      onPress={handlePress}
      right={() => null}>
      <View style={styles.accordionContent}>
        <View style={styles.filters}>
          {preferences.order.map((filter) => (
            <FilterCategory key={filter} title={FILTER_MAP[filter]} options={FILTER_OPTIONS[filter]} filter={filter} />
          ))}
        </View>
      </View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  filtersAccordion: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 9,
    paddingTop: 18,
  },
  filtersTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  accordionContent: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderWidth: 1,
    paddingBottom: 24,
  },
  filters: {
    flexDirection: 'column',
    gap: 6,
  },
});
