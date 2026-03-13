import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { Filter } from '../../lib/types';
import { FILTER_MAP } from '../../lib/utils/filterUtils';
import DragList, { DragListRenderItemInfo } from 'react-native-draglist';
import { colors } from '../../styles/theme';

// https://www.npmjs.com/package/react-native-draglist

type FilterItem = {
  key: string;
  label: string;
};

type DraggableFilterOrderProps = {
  readonly order: Filter[];
  readonly onOrderChange: (order: Filter[]) => void;
};

export default function DraggableFilterOrder({ order, onOrderChange }: DraggableFilterOrderProps) {
  const initialOrder = order.map((filter) => ({ key: filter, label: FILTER_MAP[filter] }));

  // Local state to track the order/reordering of filters
  const [data, setData] = useState<FilterItem[]>(initialOrder);

  // Update the UI when filter order changes
  useEffect(() => {
    setData(order.map((filter) => ({ key: filter, label: FILTER_MAP[filter] })));
  }, [order]);

  const renderItem = (info: DragListRenderItemInfo<FilterItem>) => {
    const { item, onDragStart, onDragEnd, isActive } = info;
    const { label } = item;

    return (
      <TouchableOpacity
        onPressIn={onDragStart}
        onPressOut={onDragEnd}
        style={[styles.item, { backgroundColor: isActive ? colors.dusk : colors.white }]}>
        <Text style={styles.itemText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  async function onReordered(fromIndex: number, toIndex: number) {
    const dataCopy = [...data];
    const [removed] = dataCopy.splice(fromIndex, 1);
    dataCopy.splice(toIndex, 0, removed);
    setData(dataCopy);
    onOrderChange(dataCopy.map((item) => item.key as Filter));
  }

  return (
    <View style={styles.dragListContainer}>
      <DragList data={data} keyExtractor={(item) => item.key} onReordered={onReordered} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  dragListContainer: {
    // flex: 1,
    borderWidth: 1,
    height: 300,
  },
  item: {
    borderWidth: 1,
    marginVertical: 4,
    padding: 6,
  },
  itemText: {
    fontSize: 16,
    color: colors.primary,
  },
});
