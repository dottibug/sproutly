import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const CATALOG_STORAGE_KEY = '@sproutly/seed_catalog';

export type SeedType = 'Vegetable' | 'Flower' | 'Fruit' | 'Herb';

export type SeedCatalogItem = {
  id: string;
  name: string;
  sku: string;
  type: SeedType;
  bean_type: string | null;
  category: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  matures_in_days: number | null;
  matures_under_days: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companion_planting: string | null;
  image: string;
};

export type UserSeedItem = {
  id: string;
  catalog_seed_id: string | null;
  custom_seed_id: string | null;
  name: string;
  sku: string;
  type: SeedType;
  bean_type: string | null;
  category: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  matures_in_days: number | null;
  matures_under_days: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companion_planting: string | null;
  image: string;
  notes: string | null;
};

// Get the cached seed catalog from AsyncStorage
async function getCachedSeedCatalog(): Promise<SeedCatalogItem[] | null> {
  try {
    const data = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as SeedCatalogItem[];

    // Check that the parsed data is an array
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error getting cached seed catalog:', error);
    return null;
  }
}

// Set the cached seed catalog in AsyncStorage
async function setCachedSeedCatalog(items: SeedCatalogItem[]): Promise<void> {
  await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(items));
}

// Fetch the seed catalog from the database (alphabetical order by name)
async function fetchSeedCatalogFromDatabase(): Promise<SeedCatalogItem[]> {
  const { data, error } = await supabase
    .from('seed_catalog')
    .select(
      'id, name, sku, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image',
    )
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as SeedCatalogItem[];
}

// Get the seed catalog from the database or cache. Only fetches from database if the cache is empty. Caching limits the number of database queries and demonstrates offline capability.
export async function getSeedCatalog(): Promise<SeedCatalogItem[]> {
  const cached = await getCachedSeedCatalog();

  if (cached && cached.length > 0) return cached;

  const catalog = await fetchSeedCatalogFromDatabase();
  await setCachedSeedCatalog(catalog);
  return catalog;
}

// For testing purposes. Clear the cached seed catalog.
export async function clearSeedCatalogCache(): Promise<void> {
  await AsyncStorage.removeItem(CATALOG_STORAGE_KEY);
}
