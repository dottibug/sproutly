import { SeedType, Planting } from '../userSeeds/types/seedInfoTypes';

export type BrowseSeedAction =
  | { type: 'LOAD_START'; payload: null }
  | { type: 'LOAD_SUCCESS'; payload: BrowseSeed[] }
  | { type: 'LOAD_ERROR'; payload: string };

// ---- BROWSE SEED ----
export type BrowseSeed = {
  id: string;
  name: string;
  sku: string;
  type: SeedType;
  beanType: string | null;
  category: string;
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
  name: string;
  sku: string;
  type: SeedType;
  beanType: string | null;
  category: string;
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
