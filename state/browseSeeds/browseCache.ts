// browseCache.tsx: Contains functions to get and set the cached browse seeds

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrowseSeed } from './browseTypes';

const BROWSE_STORAGE_KEY = '@sproutly/browse_seeds';

// Get the seed catalog from the database or cache. Only fetches from database if the cache is empty. Caching limits the number of database queries and supports offline use.
export async function getBrowseCache(): Promise<BrowseSeed[] | null> {
  try {
    const data = await AsyncStorage.getItem(BROWSE_STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as BrowseSeed[];
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error getting cached browse seeds:', error);
    return null;
  }
}

// Set the cached browse seeds in AsyncStorage
export async function setBrowseCache(seeds: BrowseSeed[]): Promise<void> {
  try {
    await AsyncStorage.setItem(BROWSE_STORAGE_KEY, JSON.stringify(seeds));
  } catch (error) {
    console.error('Error setting cached browse seeds:', error);
  }
}

// For testing purposes. Clear the cached seed catalog.
export async function clearBrowseCache(): Promise<void> {
  await AsyncStorage.removeItem(BROWSE_STORAGE_KEY);
}
