import { CustomSeed, CustomSeedFormFields, CustomSeedPayload } from './customSeedTypes';
import { UserSeed } from '../userSeeds/seeds/seedTypes';
import { ImagePreview } from '../userSeeds/photos/photoTypes';
import { buildUserSeed } from '../userSeeds/seeds/seedUtils';

// Filter seeds by custom ID
export function filterByCustomId(seeds: UserSeed[], customId: string) {
  // Avoid state mutation
  const seedsCopy = [...seeds];
  return seedsCopy.filter((s) => s.customSeedId !== customId);
}

// Build a custom seed object
export function buildCustomSeed(input: CustomSeedPayload & { id: string }): CustomSeed {
  return {
    id: input.id,
    variety: input.variety,
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
  } as CustomSeed;
}

// Create a custom seed payload object
export function createCustomSeedPayload(form: CustomSeedFormFields): CustomSeedPayload {
  return {
    variety: form.variety,
    category: form.category,
    plant: form.plant,
    beanType: form.beanType,
    latin: form.latin,
    difficulty: form.difficulty,
    exposure: form.exposure,
    maturesInDays: form.maturesInDays,
    maturesUnderDays: form.maturesUnderDays,
    description: form.description,
    timing: form.timing,
    starting: form.starting,
    growing: form.growing,
    harvest: form.harvest,
    companionPlanting: form.companionPlanting,
    image: form.image?.trim() || null,
  };
}

// Create an optimistic custom seed object with temp ID and preview image
export function createOptimisticCustomSeed(tempId: string, payload: CustomSeedPayload, preview: ImagePreview | null): UserSeed {
  return buildUserSeed({
    id: tempId,
    catalogSeedId: null,
    customSeedId: tempId,
    variety: payload.variety,
    sku: '',
    category: payload.category,
    beanType: payload.beanType,
    plant: payload.plant,
    latin: payload.latin,
    difficulty: payload.difficulty,
    exposure: payload.exposure,
    maturesInDays: payload.maturesInDays,
    maturesUnderDays: payload.maturesUnderDays,
    description: payload.description,
    timing: payload.timing,
    starting: payload.starting,
    growing: payload.growing,
    harvest: payload.harvest,
    companionPlanting: payload.companionPlanting,
    image: preview?.uri || payload.image || '',
    planting: [],
    notes: [],
    photos: [],
    tasks: [],
  });
}
