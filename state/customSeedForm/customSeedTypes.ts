import { ImagePreview } from '../userSeeds/photos/photoTypes';
import { BeanType, Difficulty, Exposure, Category } from '../userSeeds/seeds/seedInfoTypes';

export type CustomSeed = {
  id: string;
  variety: string;
  category: Category;
  beanType: BeanType | null;
  plant: string;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string;
  // planting: Planting[] | null;
};

export type CustomSeedPayload = {
  variety: string;
  category: Category;
  plant: string;
  beanType: 'Broad' | 'Bush' | 'Pole' | null;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string | null;
};

export type CustomSeedFormFields = {
  variety: string;
  category: Category;
  plant: string;
  beanType: BeanType;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string | null;
  // planting: Planting[] | null; // removed temporarily
};

export const CUSTOM_SEED_FORM_FIELDS = [
  'image',
  'variety',
  'plant',
  'beanType',
  'maturesInDays',
  // 'planting' -- removed temporarily
] as const;

export type CustomSeedFormField = (typeof CUSTOM_SEED_FORM_FIELDS)[number];

// No error message means no error in the field
export type CustomSeedFormErrors = Partial<Record<CustomSeedFormField, string>>;
