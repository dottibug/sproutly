import { View, Text, StyleSheet, Pressable } from 'react-native';
import PlantTypeFilterIcon, { PlantType } from './PlantTypeFilterIcon';
import Heading from '../ui/Heading';
import { colors } from '../../styles/theme';

const PLANT_TYPES: PlantType[] = ['Veggie', 'Flower', 'Fruit', 'Herb'];

const HEADING = 'Filter by Plant Type';

type PlantTypeFiltersProps = {
  readonly selectedFilters: Set<PlantType>;
  readonly onToggleFilter: (type: PlantType) => void;
};

// TODO: Finalize colors for selected/unselected (add those colors to the theme)

// Renders a list of filters with icons to filter catalog seeds by plant type (veggie, flower, fruit, herb). Must pass in the selected filters as a set, and a function to toggle the filters.
export default function PlantTypeFilters({ selectedFilters, onToggleFilter }: PlantTypeFiltersProps) {
  return (
    <View style={styles.plantTypeFiltersContainer}>
      <Heading size="small" uppercase>
        {HEADING}
      </Heading>
      <View style={styles.filtersContainer}>
        {PLANT_TYPES.map((plantType) => {
          const selected = selectedFilters.has(plantType);
          return (
            <Pressable
              key={plantType}
              onPress={() => onToggleFilter(plantType)}
              style={[styles.filterContainer, selected && styles.selectedFilterContainer]}>
              <PlantTypeFilterIcon type={plantType} />
              <Text style={styles.filterText}>{plantType}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plantTypeFiltersContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 4,
  },
  filtersContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterContainer: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    padding: 8,
    width: 84,
  },
  selectedFilterContainer: {
    backgroundColor: 'rgba(128, 0, 128, 0.1)',
    borderColor: 'purple',
  },
  filterText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
