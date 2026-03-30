import { Category, Planting } from '../userSeeds/seeds/seedInfoTypes';

// browseTypes.ts: Contains types for browse seeds

export type BrowseSeedAction =
  | { type: 'LOAD_START'; payload: null }
  | { type: 'LOAD_SUCCESS'; payload: BrowseSeed[] }
  | { type: 'LOAD_ERROR'; payload: string };

// ---- BROWSE SEED ----
export type BrowseSeed = {
  id: string;
  variety: string;
  sku: string;
  category: Category;
  beanType: string | null;
  plant: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string;
  planting: Planting[];
};

// ---- BUILD BROWSE SEED INPUT ----
export type BuildBrowseSeedInput = {
  id: string;
  variety: string;
  sku: string;
  category: Category;
  beanType: string | null;
  plant: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string;
  planting: Planting[];
};
