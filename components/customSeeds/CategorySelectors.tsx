import { View } from 'react-native';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { BeanType, Category } from '../../state/userSeeds/seeds/seedInfoTypes';
import { appStyles, inputStyles } from '../../styles/theme';
import { ButtonSelector } from '../uiComponentBarrel';

// CategorySelectors.tsx: Button selectors for category and bean type. Used in CustomSeedSheet.tsx when creating a custom seed.
export default function CategorySelectors() {
  const customSeed = useCustomSeed();

  const showBeanTypeSelector = customSeed.seed.category === 'Vegetable' && customSeed.seed.plant.toLowerCase() === 'bean';

  return (
    <View style={[inputStyles.inputsWrapper, appStyles.screenPadding]}>
      <ButtonSelector
        initialValue={'Vegetable'}
        title="Category"
        options={categoryOptions}
        value={customSeed.seed.category}
        onValueChange={(value) => customSeed.setCategory(value as Category)}
      />

      <ButtonSelector
        initialValue={'Broad'}
        disabled={!showBeanTypeSelector}
        title="Bean Type"
        options={beanTypeOptions}
        value={customSeed.seed.beanType || ''}
        onValueChange={(value) => customSeed.setBeanType(value as BeanType)}
      />
    </View>
  );
}

const categoryOptions = [
  { value: 'Vegetable', label: 'Veggie' },
  { value: 'Flower', label: 'Flower' },
  { value: 'Fruit', label: 'Fruit' },
  { value: 'Herb', label: 'Herb' },
];

const beanTypeOptions = [
  { value: 'Broad', label: 'Broad' },
  { value: 'Bush', label: 'Bush' },
  { value: 'Pole', label: 'Pole' },
];
