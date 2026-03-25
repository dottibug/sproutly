import { View, StyleSheet, Pressable, Text, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFilters } from '../../state/filters/FiltersContext';
import { FILTER_NAME_MAP, SEARCH_FILTERS } from '../../state/filters/filterTypes';
import FilterCategory from './FilterCategory';
import { colors } from '../../styles/theme';

// TODO (if time at end): when filters are collapsed, any active filters should show in a chip list (that can be cleared individually or all at once with a clear all command)

// TODO: Adjust the empty seed message. If user has no seeds in collection, can stay as is. If user has seeds but filters (or search) result in no matches, need a new message.

const FILTERS_TITLE = 'Filter Seeds';

type FiltersProps = {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
};

const SHEET_MAX_RATIO = 0.88;
const SHEET_HEADER_AREA = 56;

export default function Filters({ open, setOpen }: FiltersProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const { applyOpenFilters, preferences } = useFilters();

  const sheetMaxHeight = windowHeight * SHEET_MAX_RATIO;
  const scrollMaxHeight = Math.max(160, sheetMaxHeight - SHEET_HEADER_AREA - Math.max(16, insets.bottom));

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
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={FILTERS_TITLE}
        accessibilityState={{ expanded: open }}
        onPress={handlePressTrigger}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
        <Text style={styles.triggerTitle}>{FILTERS_TITLE}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="slide" onRequestClose={handleCloseSheet}>
        <View style={styles.modalRoot}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleCloseSheet}
            accessibilityLabel="Dismiss filters"
          />
          <View
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(16, insets.bottom),
                maxHeight: sheetMaxHeight,
              },
            ]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{FILTERS_TITLE}</Text>
              <Pressable onPress={handleCloseSheet} hitSlop={12} accessibilityRole="button" accessibilityLabel="Done">
                <Text style={styles.doneButton}>Done</Text>
              </Pressable>
            </View>
            <ScrollView
              style={[styles.sheetScroll, { maxHeight: scrollMaxHeight }]}
              contentContainerStyle={styles.sheetScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator>
              <View style={styles.filters}>
                {preferences.order.map((filter) => (
                  <FilterCategory key={filter} title={FILTER_NAME_MAP[filter]} options={SEARCH_FILTERS[filter]} filter={filter} />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 9,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#ccc',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 8,
    paddingHorizontal: 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  doneButton: {
    color: colors.hunterGreen,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetScroll: {},
  sheetScrollContent: {
    paddingBottom: 8,
  },
  filters: {
    flexDirection: 'column',
    gap: 6,
  },
});
