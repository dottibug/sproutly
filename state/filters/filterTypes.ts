import { DIFFICULTY, EXPOSURE, STARTING, SEASON, MONTH, READY_TO_HARVEST, CATEGORIES } from '../userSeeds/seeds/seedInfoTypes';

export type Filter = 'category' | 'starting' | 'exposure' | 'season' | 'month' | 'readyToHarvest' | 'difficulty';
export type CategoryFilter = 'Veggie' | 'Flower' | 'Fruit' | 'Herb';

export type SelectedFilters = Record<Filter, string[]>;
export type OpenFilters = Partial<Record<Filter, boolean>>;

export type UserFilterPreferences = {
  order: Filter[];
  openByDefault: Filter[];
};

// ---- CONSTANTS ----
export const FILTERS: Filter[] = ['category', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];
export const CATEGORY_FILTERS: CategoryFilter[] = ['Veggie', 'Flower', 'Fruit', 'Herb'];

export const DEFAULT_OPEN: Filter[] = ['category', 'starting'];

export const FILTER_MAP: Record<Filter, string> = {
  category: 'Category',
  starting: 'Starting',
  exposure: 'Exposure',
  season: 'Season',
  month: 'Month',
  readyToHarvest: 'Ready to Harvest',
  difficulty: 'Difficulty',
};

export const FILTER_OPTIONS: Record<Filter, string[]> = {
  category: CATEGORIES,
  starting: STARTING,
  exposure: EXPOSURE,
  season: SEASON,
  month: MONTH,
  readyToHarvest: READY_TO_HARVEST,
  difficulty: DIFFICULTY,
};
