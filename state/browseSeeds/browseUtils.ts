import { BrowseSeed, BuildBrowseSeedInput } from './browseTypes';
import { buildUserSeed, groupPlantingActionsByCategory, matchBeanVariant } from '../userSeeds/utils/seedUtils';
import { PlantingActionRow } from '../userSeeds/types/seedInfoTypes';

// Build a browseSeed object
export function buildBrowseSeed(input: BuildBrowseSeedInput): BrowseSeed {
  return {
    id: input.id,
    name: input.name,
    sku: input.sku,
    type: input.type,
    beanType: input.beanType,
    category: input.category,
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
export function createUserSeedFromBrowse(seed: BrowseSeed) {
  return buildUserSeed({
    id: '',
    catalogSeedId: seed.id,
    customSeedId: null,
    name: seed.name,
    sku: seed.sku,
    type: seed.type,
    beanType: seed.beanType,
    category: seed.category,
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
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Map a database row to a browse seed
export function mapCatalogRowToBrowseSeed(row: any): BrowseSeed {
  return buildBrowseSeed({
    id: row.id,
    name: row.name,
    sku: row.sku,
    type: row.type,
    beanType: row.bean_type,
    category: row.category,
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
  const plantingActionsByCategory = groupPlantingActionsByCategory(plantingActions);

  return seeds.map((seed) => {
    const category = seed.category.toLowerCase();
    const beanVariant = matchBeanVariant(seed.beanType);
    const plantingActionKey = `${category}-${beanVariant}`;

    return {
      ...seed,
      planting: plantingActionsByCategory.get(plantingActionKey) ?? [],
    } as BrowseSeed;
  });
}
