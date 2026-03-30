import { View } from 'react-native';
import { useEffect } from 'react';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { BeanType, Category } from '../../state/userSeeds/seeds/seedInfoTypes';
import { appStyles, inputStyles } from '../../styles/theme';
import { ButtonSelector } from '../uiComponentBarrel';
import { isBeanCategoryAndPlant } from './validateCustomSeed';

// CategorySelectors.tsx: Button selectors for category and bean type. Used in CustomSeedSheet.tsx when creating a custom seed.

type CategorySelectorsProps = {
  readonly onDismissPlantError?: () => void;
};

export default function CategorySelectors({ onDismissPlantError }: CategorySelectorsProps) {
  const customSeed = useCustomSeed();

  const showBeanTypeSelector = isBeanCategoryAndPlant(customSeed.seed.category, customSeed.seed.plant);

  // Set the default bean type to 'Broad' if the category is 'Vegetable' and the bean type is not set
  useEffect(() => {
    if (isBeanCategoryAndPlant(customSeed.seed.category, customSeed.seed.plant) && customSeed.seed.beanType === null) {
      customSeed.setBeanType('Broad');
    }
  }, [customSeed.seed.category, customSeed.seed.plant, customSeed.seed.beanType, customSeed.setBeanType]);

  // Handle category change (clear "bean" from plant type field if the category is not 'Vegetable' and clear bean type field if the category is not 'Vegetable')
  const onCategoryChange = (value: string) => {
    const newValue = value as Category;
    if (newValue !== 'Vegetable') {
      if (customSeed.seed.plant.trim().toLowerCase() === 'bean') customSeed.setPlant('');
      customSeed.setBeanType(null);
    }
    customSeed.setCategory(newValue);
    onDismissPlantError?.();
  };

  return (
    <View style={[inputStyles.inputsWrapper, appStyles.screenPadding]}>
      <ButtonSelector title="Category" options={categoryOptions} value={customSeed.seed.category} onValueChange={onCategoryChange} />
      <ButtonSelector
        disabled={!showBeanTypeSelector}
        title="Bean Type"
        options={beanTypeOptions}
        value={customSeed.seed.beanType || ''}
        onValueChange={(v) => customSeed.setBeanType(v as BeanType)}
      />
    </View>
  );
}

// ---- CONSTANTS ----
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
