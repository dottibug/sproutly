import { View, StyleSheet } from 'react-native';
import { useFilters } from '../../state/filters/FiltersContext';
import { FILTER_NAME_MAP, SEARCH_FILTERS } from '../../state/filters/filterTypes';
import FilterCategory from './FilterCategory';
import SheetModal from '../ui/SheetModal';

// TODO: Adjust the empty seed message. If user has no seeds in collection, can stay as is. If user has seeds but filters (or search) result in no matches, need a new message.

const FILTERS_TITLE = 'Filter Seeds';

type FiltersProps = {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
};

export default function Filters({ open, setOpen }: FiltersProps) {
  const { applyOpenFilters, preferences } = useFilters();

  const handlePressTrigger = () => {
    if (open) {
      setOpen(false);
      return;
    }
    applyOpenFilters();
    setOpen(true);
  };

  const handleCloseSheet = () => setOpen(false);

  return (
    <SheetModal
      accessibilityLabel={FILTERS_TITLE}
      title={FILTERS_TITLE}
      open={open}
      onPressTrigger={handlePressTrigger}
      onRequestClose={handleCloseSheet}>
      <View style={styles.filters}>
        {preferences.order.map((filter) => (
          <FilterCategory key={filter} title={FILTER_NAME_MAP[filter]} options={SEARCH_FILTERS[filter]} filter={filter} />
        ))}
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
  },
});
