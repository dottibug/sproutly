import { supabase } from './supabase';
import { Profile } from './contexts/AuthContext';
import { UserSeedItem, CatalogSeedItem, PlantingActionRow, UserFilterPreferences, Filter } from './types';
import { getCategoryPlantingActions } from './utils/plantActionUtils';
import { DEFAULT_OPEN, FILTERS } from './utils/filterUtils';

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

export async function deleteByCustomId(userId: string, customSeedId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_collection').delete().eq('user_id', userId).eq('custom_seed_id', customSeedId);
  if (error) throw error;
}

// ---- CATALOG QUERIES ----
// Fetch the seed catalog from the database (alphabetical order by name)
export async function fetchSeedCatalog(): Promise<CatalogSeedItem[]> {
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
  const catalog = (catalogData.data ?? []) as Omit<CatalogSeedItem, 'planting'>[];

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
