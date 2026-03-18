import { View, Image, StyleSheet } from 'react-native';

export type PlantType = 'Veggie' | 'Flower' | 'Fruit' | 'Herb';

type PlantTypeFilterIconProps = {
  readonly type: PlantType;
};

// Renders the filter icon for the given plant type (veggie, flower, fruit, herb). Must pass in the plant type as a prop.
export default function PlantTypeFilterIcon({ type }: PlantTypeFilterIconProps) {
  return (
    <View>
      {type === 'Veggie' && <Image source={require('../../assets/icons/plant-type/beet-128.png')} style={styles.icon} />}
      {type === 'Flower' && <Image source={require('../../assets/icons/plant-type/flower-128.png')} style={styles.icon} />}
      {type === 'Fruit' && <Image source={require('../../assets/icons/plant-type/strawberry-128.png')} style={styles.icon} />}
      {type === 'Herb' && <Image source={require('../../assets/icons/plant-type/basil-128.png')} style={styles.icon} />}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    height: 48,
    width: 48,
  },
});
