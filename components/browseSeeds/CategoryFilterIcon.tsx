import { View, Image, StyleSheet } from 'react-native';
import { CategoryFilter } from '../../state/filters/filterTypes';

type CategoryFilterIconProps = {
  readonly category: CategoryFilter;
};

// Renders the filter icon for the given category (veggie, flower, fruit, herb). Must pass in the category as a prop.
export default function CategoryFilterIcon({ category }: CategoryFilterIconProps) {
  return (
    <View>
      {category === 'Veggie' && <Image source={require('../../assets/icons/plant-type/beet-128.png')} style={styles.icon} />}
      {category === 'Flower' && <Image source={require('../../assets/icons/plant-type/flower-128.png')} style={styles.icon} />}
      {category === 'Fruit' && <Image source={require('../../assets/icons/plant-type/strawberry-128.png')} style={styles.icon} />}
      {category === 'Herb' && <Image source={require('../../assets/icons/plant-type/basil-128.png')} style={styles.icon} />}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 48,
    width: 48,
  },
});
