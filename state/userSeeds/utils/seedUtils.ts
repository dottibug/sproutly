import { UserSeed, BuildUserSeedInput } from '../types/seedTypes';
import { UserSeedNote } from '../types/noteTypes';
import { UserSeedTask } from '../types/taskTypes';
import { UserSeedPhoto } from '../types/photoTypes';
import { PlantingActionRow, Planting, BeanVariantForPlanting } from '../types/seedInfoTypes';
import { groupNotesByUserSeedId } from './noteUtils';
import { groupTasksByUserSeedId } from './taskUtils';
import { groupPhotosByUserSeedId } from './photoUtils';

// Check if a seed is already in the user's collection
export function isDuplicateSeed(seeds: UserSeed[], browseSeedId: string): boolean {
  return seeds.some((s) => s.catalogSeedId === browseSeedId || s.customSeedId === browseSeedId);
}

// Filter seeds by catalog ID
export function filterByCatalogId(seeds: UserSeed[], catalogId: string) {
  // Avoid state mutation
  const seedsCopy = [...seeds];
  return seedsCopy.filter((s) => s.catalogSeedId !== catalogId);
}

// Build a userSeed object
export function buildUserSeed(input: BuildUserSeedInput): UserSeed {
  return {
    id: input.id,
    catalogSeedId: input.catalogSeedId,
    customSeedId: input.customSeedId,
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
    planting: input.planting,
    notes: input.notes,
    photos: input.photos,
    tasks: input.tasks,
  } as UserSeed;
}

// Map a database row to a user seed object
export function mapCollectionRowToUserSeed(row: any) {
  const seedSource = row.catalog_seed_id ? row.seed_catalog : row.custom_seeds;

  if (!seedSource) throw new Error(`User row ${row.id} has no seed data`);

  return buildUserSeed({
    id: row.id,
    catalogSeedId: row.catalog_seed_id,
    customSeedId: row.custom_seed_id,
    name: seedSource.name,
    sku: seedSource.sku,
    type: seedSource.type,
    beanType: seedSource.bean_type,
    category: seedSource.category,
    latin: seedSource.latin,
    difficulty: seedSource.difficulty,
    exposure: seedSource.exposure,
    maturesInDays: seedSource.matures_in_days,
    maturesUnderDays: seedSource.matures_under_days,
    description: seedSource.description,
    timing: seedSource.timing,
    starting: seedSource.starting,
    growing: seedSource.growing,
    harvest: seedSource.harvest,
    companionPlanting: seedSource.companion_planting,
    image: seedSource.image,
    planting: [],
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Attach all data to the seeds (planting actions, notes, tasks, photos)
export function attachAllToSeeds(
  seeds: UserSeed[],
  plantingActions: PlantingActionRow[],
  notes: UserSeedNote[],
  tasks: UserSeedTask[],
  photos: UserSeedPhoto[],
): UserSeed[] {
  const plantingActionsByCategory = groupPlantingActionsByCategory(plantingActions);

  const notesBySeedId = groupNotesByUserSeedId(notes);
  const tasksBySeedId = groupTasksByUserSeedId(tasks);
  const photosBySeedId = groupPhotosByUserSeedId(photos);

  return seeds.map((seed) => {
    const category = seed.category.toLowerCase();
    const beanVariant = matchBeanVariant(seed.beanType);
    const plantingActionKey = `${category}-${beanVariant}`;

    return {
      ...seed,
      planting: plantingActionsByCategory.get(plantingActionKey) ?? [],
      notes: notesBySeedId.get(seed.id) ?? [],
      tasks: tasksBySeedId.get(seed.id) ?? [],
      photos: photosBySeedId.get(seed.id) ?? [],
    } as UserSeed;
  });
}

// Group the planting actions by category. Ex. "sweet pea" : [{action: sow, seasons: ['spring], months: [4, 5, 6]}]
export function groupPlantingActionsByCategory(plantingActions: PlantingActionRow[]): Map<string, Planting[]> {
  const map = new Map<string, Planting[]>();

  plantingActions.forEach((action) => {
    const category = action.plant.toLowerCase();
    const variant = action.variant || 'null';
    const key = `${category}-${variant}`;

    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push({ action: action.action, seasons: action.seasons ?? [], months: action.months ?? [] });
  });
  return map;
}

// Match bean type to planting action variant (broad or bush_pole)
export function matchBeanVariant(beanType: string | null): BeanVariantForPlanting {
  if (!beanType) return null;
  if (beanType.toLowerCase() === 'broad') return 'broad';
  else return 'bush_pole';
}

// Helper function to create a user seed object from a database row
export function createUserSeedFromDatabase(row: any, planting: Planting[]): UserSeed {
  const source = row.seed_catalog ?? row.custom_seeds;
  if (!source) throw new Error(`User row ${row.id} has no seed data`);

  return buildUserSeed({
    id: row.id,
    catalogSeedId: row.catalog_seed_id,
    customSeedId: row.custom_seed_id,
    name: source.name,
    sku: source.sku,
    type: source.type,
    beanType: source.bean_type,
    category: source.category,
    latin: source.latin,
    difficulty: source.difficulty,
    exposure: source.exposure,
    maturesInDays: source.matures_in_days,
    maturesUnderDays: source.matures_under_days,
    description: source.description,
    timing: source.timing,
    starting: source.starting,
    growing: source.growing,
    harvest: source.harvest,
    companionPlanting: source.companion_planting,
    image: source.image,
    planting: planting,
    notes: [],
    photos: [],
    tasks: [],
  });
}
