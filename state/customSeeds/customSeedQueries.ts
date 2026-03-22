import { supabase } from '../app/supabase';
import { CustomSeedPayload } from './customSeedTypes';
import { UserSeed } from '../userSeeds/types/seedTypes';
import { buildUserSeed } from '../userSeeds/utils/seedUtils';
import { BeanType, Difficulty, Exposure } from '../userSeeds/types/seedInfoTypes';

// Insert a custom seed into the database
export async function insertCustomSeed(userId: string, payload: CustomSeedPayload): Promise<UserSeed> {
  const customSeed = await insertToCustomSeedTable(userId, payload);
  const userSeedId = await insertCustomSeedToUserCollection(userId, customSeed.id);

  return buildUserSeed({
    id: userSeedId,
    catalogSeedId: null,
    customSeedId: customSeed.id,
    name: customSeed.name,
    sku: '',
    type: customSeed.type,
    beanType: customSeed.beanType,
    category: customSeed.category,
    latin: customSeed.latin,
    difficulty: customSeed.difficulty,
    exposure: customSeed.exposure,
    maturesInDays: customSeed.maturesInDays,
    maturesUnderDays: customSeed.maturesUnderDays,
    description: customSeed.description,
    timing: customSeed.timing,
    starting: customSeed.starting,
    growing: customSeed.growing,
    harvest: customSeed.harvest,
    companionPlanting: customSeed.companionPlanting,
    image: customSeed.image,
    planting: [],
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Insert a custom seed into the custom_seeds table
async function insertToCustomSeedTable(userId: string, payload: CustomSeedPayload): Promise<UserSeed> {
  const { data, error } = await supabase
    .from('custom_seeds')
    .insert({
      user_id: userId,
      name: payload.name,
      type: payload.type,
      category: payload.category,
      bean_type: payload.beanType,
      latin: payload.latin,
      difficulty: payload.difficulty,
      exposure: payload.exposure,
      matures_in_days: payload.maturesInDays,
      matures_under_days: payload.maturesUnderDays,
      description: payload.description,
      timing: payload.timing,
      starting: payload.starting,
      growing: payload.growing,
      harvest: payload.harvest,
      companion_planting: payload.companionPlanting,
      image: payload.image,
    })
    .select('*')
    .single();

  if (error) throw error;

  return buildUserSeed({
    id: data.id,
    name: data.name,
    catalogSeedId: null,
    customSeedId: data.id,
    sku: '',
    type: data.type,
    beanType: data.bean_type as BeanType,
    category: data.category,
    latin: data.latin,
    difficulty: data.difficulty as Difficulty,
    exposure: data.exposure as Exposure,
    maturesInDays: data.matures_in_days,
    maturesUnderDays: data.matures_under_days,
    description: data.description,
    timing: data.timing,
    starting: data.starting,
    growing: data.growing,
    harvest: data.harvest,
    companionPlanting: data.companion_planting,
    image: data.image,
    planting: [],
    notes: [],
    photos: [],
    tasks: [],
  });
}

// Insert custom seed into user_seed_collection table
async function insertCustomSeedToUserCollection(userId: string, customSeedId: string): Promise<string> {
  const { data, error } = await supabase
    .from('user_seed_collection')
    .insert({
      user_id: userId,
      catalog_seed_id: null,
      custom_seed_id: customSeedId,
      notes: null,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function deleteByCustomId(customSeedId: string): Promise<void> {
  const { error } = await supabase.from('custom_seeds').delete().eq('id', customSeedId);
  if (error) throw error;
}
