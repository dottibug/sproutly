import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrowseSeedItem } from './types';
import { fetchSeedCatalog } from './queries';

const CATALOG_STORAGE_KEY = '@sproutly/seed_catalog';

// Get the seed catalog from the database or cache. Only fetches from database if the cache is empty. Caching limits the number of database queries and supports offline use.
export async function getSeedCatalog(): Promise<BrowseSeedItem[]> {
  const cached = await getCachedSeedCatalog();
  if (cached && cached.length > 0) return cached;
  const catalog = await fetchSeedCatalog();
  await setCachedSeedCatalog(catalog);
  return catalog;
}

// For testing purposes. Clear the cached seed catalog.
export async function clearSeedCatalogCache(): Promise<void> {
  await AsyncStorage.removeItem(CATALOG_STORAGE_KEY);
}

// Get the cached seed catalog from AsyncStorage
async function getCachedSeedCatalog(): Promise<BrowseSeedItem[] | null> {
  try {
    const data = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as BrowseSeedItem[];

    // Check that the parsed data is an array
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error getting cached seed catalog:', error);
    return null;
  }
}

// Set the cached seed catalog in AsyncStorage
async function setCachedSeedCatalog(items: BrowseSeedItem[]): Promise<void> {
  await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(items));
}
