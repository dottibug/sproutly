import { DIFFICULTY, EXPOSURE, STARTING, SEASON, MONTH, READY_TO_HARVEST, PLANT_TYPES } from '../userSeeds/types/seedInfoTypes';

export type Filter = 'plantType' | 'starting' | 'exposure' | 'season' | 'month' | 'readyToHarvest' | 'difficulty';
export type PlantTypeFilter = 'Veggie' | 'Flower' | 'Fruit' | 'Herb';

export type SelectedFilters = Record<Filter, string[]>;
export type OpenFilters = Partial<Record<Filter, boolean>>;

export type UserFilterPreferences = {
  order: Filter[];
  openByDefault: Filter[];
};

// ---- CONSTANTS ----
export const FILTERS: Filter[] = ['plantType', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

export const DEFAULT_OPEN: Filter[] = ['plantType', 'starting'];

export const FILTER_MAP: Record<Filter, string> = {
  plantType: 'Plant Type',
  starting: 'Starting',
  exposure: 'Exposure',
  season: 'Season',
  month: 'Month',
  readyToHarvest: 'Ready to Harvest',
  difficulty: 'Difficulty',
};

export const FILTER_OPTIONS: Record<Filter, string[]> = {
  plantType: PLANT_TYPES,
  starting: STARTING,
  exposure: EXPOSURE,
  season: SEASON,
  month: MONTH,
  readyToHarvest: READY_TO_HARVEST,
  difficulty: DIFFICULTY,
};
