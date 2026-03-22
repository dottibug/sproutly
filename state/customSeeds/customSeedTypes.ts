import { SeedType, BeanType, Difficulty, Exposure } from '../userSeeds/types/seedInfoTypes';

export type CustomSeed = {
  id: string;
  name: string;
  type: SeedType;
  beanType: BeanType | null;
  category: string;
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
};

export type CustomSeedPayload = {
  name: string;
  type: SeedType;
  category: string;
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
  name: string;
  type: SeedType;
  category: string;
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
  imagePath: string | null;
  // planting: Planting[] | null; // removed temporarily
};
