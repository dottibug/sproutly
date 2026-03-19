import { supabase } from './supabase';
import { Profile } from '../context/AuthContext';
import {
  UserSeedItem,
  BrowseSeedItem,
  PlantingActionRow,
  UserFilterPreferences,
  Filter,
  CustomSeedItem,
  CustomSeedPayload,
  UserSeedNote,
  UserSeedPhoto,
} from './types';
import { getCategoryPlantingActions } from './plantActionUtils';

// TODO: Refactor (break into small query files for each table)

// ---- USER SEED COLLECTION QUERIES ----
export async function fetchUserSeedsWithoutPlantingActions(profile: Profile): Promise<UserSeedItem[]> {
  const { data, error } = await supabase
    .from('user_seed_collection')
    .select(
      `id,catalog_seed_id,custom_seed_id,notes,
          seed_catalog (id, name, sku, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image),
          custom_seeds (id, name, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image)`,
    )
    .eq('user_id', profile?.id);

  if (error) throw error;
  return (data ?? []) as unknown as UserSeedItem[];
}

export async function addCatalogSeedToUserCollection(userId: string, catalogSeedId: string): Promise<UserSeedItem> {
  const { data, error } = await supabase.from('user_seed_collection').insert({
    user_id: userId,
    catalog_seed_id: catalogSeedId,
  });
  if (error) throw error;
  return data as unknown as UserSeedItem;
}

export async function addCustomSeedToUserCollection(userId: string, customSeedId: string): Promise<UserSeedItem> {
  const { data, error } = await supabase.from('user_seed_collection').insert({
    user_id: userId,
    custom_seed_id: customSeedId,
  });
  if (error) throw error;
  return data as unknown as UserSeedItem;
}

export async function deleteByCatalogId(userId: string, catalogSeedId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_collection').delete().eq('user_id', userId).eq('catalog_seed_id', catalogSeedId);
  if (error) throw error;
}

export async function deleteByCustomId(customSeedId: string): Promise<void> {
  const { error } = await supabase.from('custom_seeds').delete().eq('id', customSeedId);
  if (error) throw error;
}

// ---- CATALOG QUERIES ----
// Fetch the seed catalog from the database (alphabetical order by name)
export async function fetchSeedCatalog(): Promise<BrowseSeedItem[]> {
  const [catalogData, plantingData] = await Promise.all([
    supabase
      .from('seed_catalog')
      .select(
        'id, name, sku, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image',
      )
      .order('name', { ascending: true }),
    fetchPlantingActions(),
  ]);

  if (catalogData.error) throw catalogData.error;

  // https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
  const catalog = (catalogData.data ?? []) as Omit<BrowseSeedItem, 'planting'>[];

  return catalog.map((seed) => {
    return {
      ...seed,
      planting: getCategoryPlantingActions(seed.category, plantingData, seed.bean_type),
    };
  });
}

// ---- PLANTING ACTION QUERIES ----
export async function fetchPlantingActions(): Promise<PlantingActionRow[]> {
  const { data, error } = await supabase.from('planting_actions').select('plant, variant, action, seasons, months');
  if (error) throw error;
  return (data ?? []) as PlantingActionRow[];
}

// ---- FILTER QUERIES ----
const FILTERS: Filter[] = ['plantType', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

const DEFAULT_OPEN: Filter[] = ['plantType', 'starting'];

export async function fetchUserFilterPrefs(profileId: string): Promise<UserFilterPreferences> {
  const { data, error } = await supabase.from('profiles').select('filter_order, filter_expanded_by_default').eq('id', profileId).single();

  if (error) throw error;

  return {
    order: (data.filter_order as Filter[]) ?? FILTERS,
    openByDefault: (data.filter_expanded_by_default as Filter[]) ?? DEFAULT_OPEN,
  };
}

export async function updateUserFilterPrefs(profileId: string, userFilterPrefs: UserFilterPreferences): Promise<UserFilterPreferences> {
  const { order, openByDefault } = userFilterPrefs;

  const { data, error } = await supabase
    .from('profiles')
    .update({
      filter_order: order,
      filter_expanded_by_default: openByDefault,
    })
    .eq('id', profileId);

  if (error) throw error;
  return userFilterPrefs;
}

// ---- CUSTOM SEED QUERIES ----
export async function insertCustomSeed(userId: string, payload: CustomSeedPayload): Promise<UserSeedItem> {
  const customSeed = await insertToCustomSeedTable(userId, payload);
  const userSeedId = await insertCustomSeedToUserCollection(userId, customSeed.id);

  return {
    id: userSeedId,
    catalog_seed_id: null,
    custom_seed_id: customSeed.id,
    name: customSeed.name,
    sku: '',
    type: customSeed.type,
    bean_type: customSeed.bean_type,
    category: customSeed.category,
    latin: customSeed.latin,
    difficulty: customSeed.difficulty,
    exposure: customSeed.exposure,
    matures_in_days: customSeed.matures_in_days,
    matures_under_days: customSeed.matures_under_days,
    description: customSeed.description,
    timing: customSeed.timing,
    starting: customSeed.starting,
    growing: customSeed.growing,
    harvest: customSeed.harvest,
    companion_planting: customSeed.companion_planting,
    image: customSeed.image,
    planting: [],
    notes: [],
    photos: [],
  };
}

// Insert custom seed into custom_seeds tableReturns custom seed id on success.
export async function insertToCustomSeedTable(userId: string, payload: CustomSeedPayload): Promise<CustomSeedItem> {
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
    .select(
      'id, name, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image',
    )
    .single();

  if (error) throw error;
  return data as unknown as CustomSeedItem;
}

// Insert custom seed into user_seed_collection table
export async function insertCustomSeedToUserCollection(userId: string, customSeedId: string): Promise<string> {
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

// Fetch notes associated with the seeds in a user's collection
export async function fetchUserSeedNotesByCollectionId(collectionIds: string[]): Promise<UserSeedNote[]> {
  if (collectionIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_seed_notes')
    .select('id, user_seed_collection_id, user_id, title, note, created_at, updated_at')
    .in('user_seed_collection_id', collectionIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const notes = data?.map((note) => ({
    id: note.id,
    userCollectionId: note.user_seed_collection_id,
    userId: note.user_id,
    title: note.title,
    note: note.note,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  }));

  return notes ?? [];
}

// Insert a new note into the user_seed_notes table
export async function insertUserSeedNote(userId: string, collectionId: string, title: string | null, note: string): Promise<UserSeedNote> {
  const titleTrim = title?.trim();
  const noteTrim = note.trim();

  if (!noteTrim) throw new Error('Note cannot be empty');

  const { data, error } = await supabase
    .from('user_seed_notes')
    .insert({
      user_id: userId,
      user_seed_collection_id: collectionId,
      title: titleTrim,
      note: noteTrim,
    })
    .select('id, user_seed_collection_id, user_id, title, note, created_at, updated_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userCollectionId: data.user_seed_collection_id,
    userId: data.user_id,
    title: data.title,
    note: data.note,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update a note in the user_seed_notes table
export async function updateUserSeedNote(userId: string, noteId: string, title: string | null, note: string): Promise<void> {
  const titleTrim = title?.trim();
  const noteTrim = note.trim();

  if (!noteTrim) throw new Error('Note cannot be empty');

  const { error } = await supabase
    .from('user_seed_notes')
    .update({
      title: titleTrim,
      note: noteTrim,
      updated_at: new Date().toISOString(),
    })
    .eq('id', noteId)
    .eq('user_id', userId);

  if (error) throw error;
}

// Delete a note from the user_seed_notes table
export async function deleteUserSeedNote(userId: string, noteId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_notes').delete().eq('id', noteId).eq('user_id', userId);
  if (error) throw error;
}

// Fetch photos associated with the seeds in a user's collection
export async function fetchUserSeedPhotosByCollectionId(collectionIds: string[]): Promise<UserSeedPhoto[]> {
  if (collectionIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_seed_photos')
    .select('id, user_seed_collection_id, user_id, image_url, created_at')
    .in('user_seed_collection_id', collectionIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const photos = data?.map((photo) => ({
    id: photo.id,
    userCollectionId: photo.user_seed_collection_id,
    userId: photo.user_id,
    imageUrl: photo.image_url, // still storage path here
    createdAt: photo.created_at,
  }));

  return photos ?? [];
}

// Insert a new photo into the user_seed_photos table
export async function insertUserSeedPhoto(userId: string, collectionId: string, imagePath: string): Promise<UserSeedPhoto> {
  const { data, error } = await supabase
    .from('user_seed_photos')
    .insert({
      user_id: userId,
      user_seed_collection_id: collectionId,
      image_url: imagePath,
    })
    .select('id, user_seed_collection_id, user_id, image_url, created_at')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userCollectionId: data.user_seed_collection_id,
    userId: data.user_id,
    imageUrl: data.image_url, // still path here
    createdAt: data.created_at,
  };
}

// Delete a photo row from user_seed_photos table
export async function deleteUserSeedPhoto(userId: string, photoId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_photos').delete().eq('id', photoId).eq('user_id', userId);
  if (error) throw error;
}
