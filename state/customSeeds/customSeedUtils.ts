import { CustomSeed, CustomSeedFormFields, CustomSeedPayload } from './customSeedTypes';
import { UserSeed } from '../userSeeds/types/seedTypes';

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
    name: input.name,
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
  } as CustomSeed;
}

// Create a custom seed payload object
export function createCustomSeedPayload(form: CustomSeedFormFields): CustomSeedPayload {
  return {
    name: form.name,
    type: form.type,
    category: form.category,
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
    image: form.imagePath,
  };
}
