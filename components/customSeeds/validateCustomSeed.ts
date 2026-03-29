import { BeanType, Category, Difficulty, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';

import { CustomSeedErrors, CustomSeedDraft, CleanCustomSeed } from '../../state/customSeed/customSeedTypes';

// Only fields that need validation. Note: category does not need validation, but is needed to validate beanType
type CustomSeedInput = {
  variety: string;
  category: Category;
  plant: string;
  beanType: BeanType | null;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string | null;
};

type ValidResult = {
  isValid: boolean;
  errors: CustomSeedErrors | null;
  customSeedDraft: CustomSeedDraft | null;
};

// Validates the custom seed form and returns any errors
export function validateCustomSeed(input: CustomSeedInput, userSeedId: string): ValidResult {
  const errors: CustomSeedErrors = {};

  if (!input.variety) errors.variety = 'Variety is required';
  if (!input.plant) errors.plant = 'Plant is required';

  const plantClean = input.plant.trim().toLowerCase();
  if (plantClean === 'bean' && input.category !== 'Vegetable') {
    errors.plant = 'Plant type "bean" can only be used with the "Veggie" category.';
  }

  if (isBeanCategoryAndPlant(input.category, input.plant) && !input.beanType) errors.beanType = 'Bean type is required';

  if (!isValid(errors)) return { isValid: false, errors: errors, customSeedDraft: null };

  const customSeedDraft = createCustomSeedDraft(input, userSeedId);
  return { isValid: true, errors: null, customSeedDraft };
}

// If key array is empty, there are no errors
export function isValid(errors: CustomSeedErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Helper function to calculate the matures under days
function calcMaturesUnderDays(maturesInDays: number | null): number | null {
  if (!maturesInDays) return null;
  return Math.ceil(maturesInDays / 10) * 10;
}

// Create a draft custom seed object with cleaned fields (ready for database insertion)
function createCustomSeedDraft(input: CustomSeedInput, userSeedId: string): CustomSeedDraft {
  const cleaned = cleanCustomSeed(input);
  const maturesUnderDays = calcMaturesUnderDays(cleaned.maturesInDays);

  return {
    ...cleaned,
    userSeedId,
    maturesUnderDays,
  };
}

// Bean type can only be applied if category is 'Vegetable' and plant is 'bean'
export function isBeanCategoryAndPlant(category: Category, plant: string): boolean {
  return category === 'Vegetable' && plant.trim().toLowerCase() === 'bean';
}

// Helper function to trim extra whitespace from the custom seed form values
export function cleanCustomSeed(customSeed: CustomSeedInput): CleanCustomSeed {
  const beanType = isBeanCategoryAndPlant(customSeed.category, customSeed.plant) ? customSeed.beanType : null;

  const trimmed = customSeed.image?.trim();
  const image = trimmed ? trimmed : null;

  return {
    variety: customSeed.variety.trim(),
    category: customSeed.category,
    plant: customSeed.plant.trim(),
    beanType,
    latin: customSeed.latin?.trim() || null,
    difficulty: customSeed.difficulty,
    exposure: customSeed.exposure,
    maturesInDays: customSeed.maturesInDays,
    description: customSeed.description?.trim() || null,
    timing: customSeed.timing?.trim() || null,
    starting: customSeed.starting?.trim() || null,
    growing: customSeed.growing?.trim() || null,
    harvest: customSeed.harvest?.trim() || null,
    companionPlanting: customSeed.companionPlanting?.trim() || null,
    image,
  };
}
