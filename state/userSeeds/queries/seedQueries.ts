import { supabase } from '../../app/supabase';
import { UserSeed } from '../types/seedTypes';
import { PlantingActionRow } from '../types/seedInfoTypes';
import { mapCollectionRowToUserSeed, attachAllToSeeds } from '../utils/seedUtils';
import { fetchNotesByUserSeedId } from './noteQueries';
import { fetchTasksByUserSeedId } from './taskQueries';
import { fetchPhotosByUserSeedId, signPhotos } from './photoQueries';

const SEED_COLLECTION_SELECT = `
  id,
  catalog_seed_id,
  custom_seed_id,
  seed_catalog (
    id, name, sku, type, bean_type, category, latin, difficulty, exposure,
    matures_in_days, matures_under_days, description, timing, starting,
    growing, harvest, companion_planting, image
  ),
  custom_seeds (
    id, name, type, bean_type, category, latin, difficulty, exposure,
    matures_in_days, matures_under_days, description, timing, starting,
    growing, harvest, companion_planting, image
  )
`;

// Fetches the seeds from a user collection (includes both catalog and custom seeds)
async function fetchSeeds(userId: string): Promise<UserSeed[]> {
  const { data, error } = await supabase.from('user_seed_collection').select(SEED_COLLECTION_SELECT).eq('user_id', userId);

  if (error) throw error;

  return data?.map((row) => mapCollectionRowToUserSeed(row)) ?? ([] as UserSeed[]);
}

// Fetches the planting actions from the database
export async function fetchPlantingActions(): Promise<PlantingActionRow[]> {
  const { data, error } = await supabase.from('planting_actions').select('plant, variant, action, seasons, months');

  if (error) throw error;
  return (data ?? []) as PlantingActionRow[];
}

// Fetch the seed collection for a user and attach all data to the seeds
export async function fetchSeedCollection(userId: string): Promise<UserSeed[]> {
  if (!userId) return [] as UserSeed[];

  let collection: UserSeed[] = [];

  // Fetch seeds in collection and planting actions
  const [seeds, plantingActions] = await Promise.all([fetchSeeds(userId), fetchPlantingActions()]);

  // Fetch any notes, tasks, and photos for the seeds
  const userSeedIds = seeds.map((seed) => seed.id);

  const [notes, tasks, photos] = await Promise.all([
    fetchNotesByUserSeedId(userSeedIds),
    fetchTasksByUserSeedId(userSeedIds),
    fetchPhotosByUserSeedId(userSeedIds),
  ]);

  // Attach the planting actions, notes, tasks, and photos to the seeds
  collection = attachAllToSeeds(seeds, plantingActions, notes, tasks, photos);

  // Build and return the seed collection with signed URLs for any photos
  return Promise.all(collection.map((seed) => signPhotos(seed)));
}
