import { UserSeed, BuildUserSeedInput } from './seedTypes';
import { UserSeedNote } from '../notes/noteTypes';
import { UserSeedTask } from '../tasks/taskTypes';
import { UserSeedPhoto } from '../photos/photoTypes';
import { PlantingActionRow, Planting, BeanVariantForPlanting } from './seedInfoTypes';
import { groupNotesByUserSeedId } from '../notes/noteUtils';
import { groupTasksByUserSeedId } from '../tasks/taskUtils';
import { groupPhotosByUserSeedId } from '../photos/photoUtils';

// seedUtils.ts: Contains utility functions for seeds

// Check if a seed is already in the user's collection
export function isDuplicateSeed(seeds: UserSeed[], browseSeedId: string): boolean {
  return seeds.some((s) => s.catalogSeedId === browseSeedId || s.customSeedId === browseSeedId);
}

// Apply a favorite status to a seed
export function applySeedFavorite(seeds: UserSeed[], payload: { collectionId: string; isFavorite: boolean }): UserSeed[] {
  return seeds.map((s) => (s.id === payload.collectionId ? { ...s, isFavorite: payload.isFavorite } : s));
}

// Filter seeds by catalog ID
export function filterByCatalogId(seeds: UserSeed[], catalogId: string) {
  const seedsCopy = [...seeds];
  return seedsCopy.filter((s) => s.catalogSeedId !== catalogId);
}

// Build a userSeed object
export function buildUserSeed(input: BuildUserSeedInput): UserSeed {
  return {
    id: input.id,
    catalogSeedId: input.catalogSeedId,
    customSeedId: input.customSeedId,
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
    planting: input.planting,
    isFavorite: input.isFavorite,
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
    variety: seedSource.variety,
    sku: seedSource.sku,
    category: seedSource.category,
    beanType: seedSource.bean_type,
    plant: seedSource.plant,
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
    image: seedSource.image ?? '',
    planting: [],
    isFavorite: Boolean(row.is_favorite),
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
  const plantingActionsByPlant = groupPlantingActionsByPlant(plantingActions);
  const notesBySeedId = groupNotesByUserSeedId(notes);
  const tasksBySeedId = groupTasksByUserSeedId(tasks);
  const photosBySeedId = groupPhotosByUserSeedId(photos);

  return seeds.map((seed) => {
    const plant = seed.plant.toLowerCase();
    const beanVariant = matchBeanVariant(seed.beanType);
    const plantingActionKey = `${plant}-${beanVariant}`;

    return {
      ...seed,
      planting: plantingActionsByPlant.get(plantingActionKey) ?? [],
      notes: notesBySeedId.get(seed.id) ?? [],
      tasks: tasksBySeedId.get(seed.id) ?? [],
      photos: photosBySeedId.get(seed.id) ?? [],
    } as UserSeed;
  });
}

// Group the planting actions by category. Ex. "sweet pea" : [{action: sow, seasons: ['spring], months: [4, 5, 6]}]
export function groupPlantingActionsByPlant(plantingActions: PlantingActionRow[]): Map<string, Planting[]> {
  const map = new Map<string, Planting[]>();

  plantingActions.forEach((action) => {
    const plant = action.plant.toLowerCase();
    const variant = action.variant || 'null';
    const key = `${plant}-${variant}`;
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
    variety: source.variety,
    sku: source.sku,
    category: source.category,
    beanType: source.bean_type,
    plant: source.plant,
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
    image: source.image ?? '',
    planting: planting,
    isFavorite: Boolean(row.is_favorite),
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Replace the optimistic custom seed in state with the successful DB insert (ensures the custom seed id is updated in state)
export function replaceUISeed(seeds: UserSeed[], payload: UserSeed & { tempId: string }) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== payload.tempId) return s;
    return { ...payload } as UserSeed;
  });
  return updated;
}
