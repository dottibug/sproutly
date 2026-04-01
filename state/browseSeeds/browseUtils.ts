import { BrowseSeed, BuildBrowseSeedInput } from './browseTypes';
import { buildUserSeed, groupPlantingActionsByPlant, matchBeanVariant } from '../userSeeds/seeds/seedUtils';
import { PlantingActionRow } from '../userSeeds/seeds/seedInfoTypes';

// browseUtils.ts: Contains utility functions for browse seeds

// Build a browseSeed object
export function buildBrowseSeed(input: BuildBrowseSeedInput): BrowseSeed {
  return {
    id: input.id,
    variety: input.variety,
    sku: input.sku,
    category: input.category,
    beanType: input.beanType,
    plant: input.plant,
    latin: input.latin,
    difficulty: input.difficulty,
    exposure: input.exposure,
    maturesInDays: input.maturesInDays,
    maturesUnderDays: input.maturesUnderDays,
    description: input.description,
    timing: input.timing,
    starting: input.starting,
    growing: input.growing,
    harvest: input.harvest,
    companionPlanting: input.companionPlanting,
    image: input.image,
    planting: input.planting ?? [],
  };
}

// Create a user seed from a browse seed
export function createUserSeedFromBrowse(seed: BrowseSeed, tempId: string) {
  return buildUserSeed({
    id: tempId,
    catalogSeedId: seed.id,
    customSeedId: null,
    variety: seed.variety,
    sku: seed.sku,
    category: seed.category,
    beanType: seed.beanType,
    plant: seed.plant,
    latin: seed.latin,
    difficulty: seed.difficulty,
    exposure: seed.exposure,
    maturesInDays: seed.maturesInDays,
    maturesUnderDays: seed.maturesUnderDays,
    description: seed.description,
    timing: seed.timing,
    starting: seed.starting,
    growing: seed.growing,
    harvest: seed.harvest,
    companionPlanting: seed.companionPlanting,
    image: seed.image,
    planting: seed.planting ?? [],
    isFavorite: false,
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Map a database row to a browse seed
export function mapCatalogRowToBrowseSeed(row: any): BrowseSeed {
  return buildBrowseSeed({
    id: row.id,
    variety: row.variety,
    sku: row.sku,
    category: row.category,
    beanType: row.bean_type,
    plant: row.plant,
    latin: row.latin,
    difficulty: row.difficulty,
    exposure: row.exposure,
    maturesInDays: row.matures_in_days,
    maturesUnderDays: row.matures_under_days,
    description: row.description,
    timing: row.timing,
    starting: row.starting,
    growing: row.growing,
    harvest: row.harvest,
    companionPlanting: row.companion_planting,
    image: row.image ?? '',
    planting: [],
  });
}

// Attach the planting actions to the seeds
export function attachPlantingToSeeds(seeds: BrowseSeed[], plantingActions: PlantingActionRow[]): BrowseSeed[] {
  const plantingActionsByPlant = groupPlantingActionsByPlant(plantingActions);
  return seeds.map((seed) => {
    const plant = seed.plant.toLowerCase();
    const beanVariant = matchBeanVariant(seed.beanType);
    const plantingActionKey = `${plant}-${beanVariant}`;
    return {
      ...seed,
      planting: plantingActionsByPlant.get(plantingActionKey) ?? [],
    } as BrowseSeed;
  });
}
