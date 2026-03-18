import { CustomSeedItem, CustomSeedPayload, Difficulty, Exposure } from './types';

export function createCustomSeedPayload(customSeed: CustomSeedItem): CustomSeedPayload {
  const payload: CustomSeedPayload = {
    name: customSeed.name.trim(),
    type: customSeed.type,
    category: customSeed.category.trim(),
    beanType: customSeed.bean_type as 'Broad' | 'Bush' | 'Pole' | null,
    latin: customSeed.latin,
    difficulty: customSeed.difficulty as Difficulty | null,
    exposure: customSeed.exposure as Exposure | null,
    maturesInDays: customSeed.matures_in_days,
    maturesUnderDays: customSeed.matures_under_days,
    description: customSeed.description,
    timing: customSeed.timing,
    starting: customSeed.starting,
    growing: customSeed.growing,
    harvest: customSeed.harvest,
    companionPlanting: customSeed.companion_planting,
    image: null,
  };

  return payload;
}
