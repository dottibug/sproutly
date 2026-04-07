import { View, StyleSheet } from 'react-native';
import { useFilters } from '../../state/filters/FiltersContext';
import { FILTER_NAME_MAP, SEARCH_FILTERS } from '../../state/filters/filterTypes';
import FilterCategory from './FilterCategory';
import SheetModal from '../ui/SheetModal';
import { AppButton } from '../uiComponentBarrel';

// Filters.tsx: Renders the filters sheet modal on the 'My Seeds' or 'Browse' screens.

type FiltersProps = {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
  readonly userCollectionFilters?: React.ReactNode;
};

export default function Filters({ open, setOpen, userCollectionFilters }: FiltersProps) {
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
      onRequestClose={handleCloseSheet}
      userCollectionFilters={userCollectionFilters}>
      <View style={styles.content}>
        <View style={styles.filters}>
          {preferences.order.map((filter) => (
            <FilterCategory key={filter} title={FILTER_NAME_MAP[filter]} options={SEARCH_FILTERS[filter]} filter={filter} />
          ))}
        </View>
        <View style={styles.applyButtonContainer}>
          <AppButton text="Apply Filters" onPress={handleCloseSheet} size="xsmall" rounded />
        </View>
      </View>
    </SheetModal>
  );
}

const FILTERS_TITLE = 'Filter Seeds';

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  filters: {
    flexDirection: 'column',
    gap: 6,
    marginTop: 8,
  },
  applyButtonContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
});
