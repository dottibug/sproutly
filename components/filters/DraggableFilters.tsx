import { Text, StyleSheet, Pressable, View, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SearchFilter, FILTER_NAME_MAP } from '../../state/filters/filterTypes';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import { colors } from '../../styles/theme';

/** DraggableFilters.tsx: This component displays the list of seed filters in a draggable list that can be reordered by the user. Used to customize the order of filters that appears in the filter sheet of the 'My Seeds' tab on the Home screen.
 * Uses the react-native-draglist package
 * Reference: https://www.npmjs.com/package/react-native-draglist
 */

type FilterItem = {
  key: string;
  label: string;
};

type DraggableFiltersProps = {
  readonly order: SearchFilter[];
  readonly onOrderChange: (order: SearchFilter[]) => void;
  readonly onDragActiveChange?: (active: boolean) => void;
};

export default function DraggableFilters({ order, onOrderChange, onDragActiveChange }: DraggableFiltersProps) {
  const [data, setData] = useState<FilterItem[]>(() => order.map((filter) => ({ key: filter, label: FILTER_NAME_MAP[filter] })));

  // Keep in sync with the order prop
  useEffect(() => {
    setData(order.map((filter) => ({ key: filter, label: FILTER_NAME_MAP[filter] })));
  }, [order]);

  // Re-enable parent scroll when the component unmounts
  useEffect(() => {
    return () => onDragActiveChange?.(false);
  }, [onDragActiveChange]);

  // Render each filter item in the draggable FlatList
  const renderItem = (info: DragListRenderItemInfo<FilterItem>) => {
    const { item, onDragStart, onDragEnd, isActive } = info;
    const { label } = item;

    return (
      <Pressable
        onPressIn={() => {
          onDragActiveChange?.(true);
          onDragStart();
        }}
        onPressOut={() => {
          onDragEnd();
          onDragActiveChange?.(false);
        }}
        style={[styles.item, { backgroundColor: isActive ? colors.greenLight : colors.white }]}>
        <Text style={[styles.itemText, { color: isActive ? colors.white : colors.primary }]}>{label}</Text>
      </Pressable>
    );
  };

  // Handles reordering filters when dragged and dropped
  async function onReordered(fromIndex: number, toIndex: number) {
    const dataCopy = [...data];
    const [removed] = dataCopy.splice(fromIndex, 1);
    dataCopy.splice(toIndex, 0, removed);
    setData(dataCopy);
    onOrderChange(dataCopy.map((item) => item.key as SearchFilter));
  }

  return (
    <View style={styles.dragListContainer}>
      <DragList
        data={data}
        keyExtractor={(item) => item.key}
        onReordered={onReordered}
        renderItem={renderItem}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  dragListContainer: {
    height: 380,
    justifyContent: 'center',
  },
  item: {
    borderRadius: 22,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 1,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemText: {
    fontSize: 16,
  },
});
