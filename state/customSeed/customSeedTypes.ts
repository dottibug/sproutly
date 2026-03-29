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

// ---- CUSTOM SEED SHEET  ----
// User-defined input values
export type CustomSeedDraft = CleanCustomSeed & {
  userSeedId: string;
  maturesUnderDays: number | null;
  // planting: Planting[] | null; // removed temporarily
};

export type CleanCustomSeed = {
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
  image: string;
  // planting: Planting[] | null; // removed temporarily
};

export const CUSTOM_SEED_FIELDS = [
  'image',
  'variety',
  'plant',
  'beanType',
  'maturesInDays',
  // 'planting' -- removed temporarily
] as const;

export type CustomSeedFields = (typeof CUSTOM_SEED_FIELDS)[number];
export type CustomSeedErrors = Partial<Record<CustomSeedFields, string>>;

export type CustomSeedSheetParams = {
  userSeedId: string;
};

export type InfoModalType =
  | 'difficulty'
  | 'exposure'
  | 'maturesInDays'
  | 'description'
  | 'timing'
  | 'starting'
  | 'growing'
  | 'harvest'
  | 'companionPlanting';
