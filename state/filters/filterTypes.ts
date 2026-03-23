import { DIFFICULTY, EXPOSURE, STARTING, SEASON, MONTH, READY_TO_HARVEST, CATEGORIES } from '../userSeeds/seeds/seedInfoTypes';

export type SearchFilter = 'category' | 'starting' | 'exposure' | 'season' | 'month' | 'readyToHarvest' | 'difficulty';
export type CategoryFilter = 'Veggie' | 'Flower' | 'Fruit' | 'Herb';

export type SelectedFilters = Record<SearchFilter, string[]>;
export type OpenFilters = Partial<Record<SearchFilter, boolean>>;

export type UserFilterPreferences = {
  order: SearchFilter[];
  openByDefault: SearchFilter[];
};

// ---- CONSTANTS ----
export const SEARCH_FILTER_NAMES: SearchFilter[] = ['category', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

export const CATEGORY_FILTERS: CategoryFilter[] = ['Veggie', 'Flower', 'Fruit', 'Herb'];

export const DEFAULT_OPEN: SearchFilter[] = ['category', 'starting'];

export const FILTER_NAME_MAP: Record<SearchFilter, string> = {
  category: 'Category',
  starting: 'Starting',
  exposure: 'Exposure',
  season: 'Season',
  month: 'Month',
  readyToHarvest: 'Ready to Harvest',
  difficulty: 'Difficulty',
};

export const SEARCH_FILTERS: Record<SearchFilter, string[]> = {
  category: CATEGORIES,
  starting: STARTING,
  exposure: EXPOSURE,
  season: SEASON,
  month: MONTH,
  readyToHarvest: READY_TO_HARVEST,
  difficulty: DIFFICULTY,
};
