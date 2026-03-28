import { BeanType, Category } from '../../../state/userSeeds/seeds/seedInfoTypes';

import { CustomSeedFormErrors, CustomSeedFormFields } from '../../../state/customSeed/customSeedTypes';

// Only fields that need validation. Note: category does not need validation, but is needed to validate beanType
type ValidateInput = {
  image: string | null;
  variety: string;
  category: Category;
  plant: string;
  beanType: BeanType;
};

// If key array is empty, there are no errors
export function isValid(errors: CustomSeedFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Validates the custom seed form and returns any errors
export function validateCustomSeedForm(values: ValidateInput): CustomSeedFormErrors {
  const errors: CustomSeedFormErrors = {};

  if (!values.image) console.log('Handle no image case (placeholder image)');

  if (!values.variety) errors.variety = 'Variety is required';

  if (!values.plant) errors.plant = 'Plant type is required';

  if (isBean(values.category, values.plant) && !values.beanType) errors.beanType = 'Bean type is required';

  return errors;
}

// Helper function to check if the plant is a bean
function isBean(category: Category, plant: string): boolean {
  return category === 'Vegetable' && plant.toLowerCase() === 'bean';
}

// Helper function to trim extra whitespace from the custom seed form values
export function cleanCustomSeedForm(customSeed: CustomSeedFormFields): CustomSeedFormFields {
  const plantIsBean = customSeed.plant.trim().toLowerCase() === 'bean';
  const beanType = customSeed.category === 'Vegetable' && plantIsBean ? customSeed.beanType : null;

  return {
    variety: customSeed.variety.trim(),
    category: customSeed.category,
    plant: customSeed.plant.trim(),
    beanType,
    latin: customSeed.latin?.trim() || null,
    difficulty: customSeed.difficulty,
    exposure: customSeed.exposure,
    maturesInDays: customSeed.maturesInDays,
    maturesUnderDays: customSeed.maturesUnderDays,
    description: customSeed.description?.trim() || null,
    timing: customSeed.timing?.trim() || null,
    starting: customSeed.starting?.trim() || null,
    growing: customSeed.growing?.trim() || null,
    harvest: customSeed.harvest?.trim() || null,
    companionPlanting: customSeed.companionPlanting?.trim() || null,
    image: customSeed.image,
  };
}
