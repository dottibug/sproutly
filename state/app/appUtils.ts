import { UserSeed } from '../userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../browseSeeds/browseTypes';
import { getTimestamp } from './dateUtils';

//appUtils.ts: Contains utility functions for the app

// ---- TEMP ID ----
export function createTempId() {
  const now = getTimestamp();
  return `temp-${now}`;
}

// ---- SEARCH UTILS ----
export function searchSeeds(seeds: UserSeed[] | BrowseSeed[], searchQuery: string): UserSeed[] | BrowseSeed[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return seeds;

  return seeds.filter((seed) => {
    const variety = seed.variety?.toLowerCase() ?? '';
    const plant = seed.plant?.toLowerCase() ?? '';
    const category = seed.category?.toLowerCase() ?? '';
    const sku = seed.sku?.toLowerCase() ?? '';

    return variety.includes(query) || plant.includes(query) || category.includes(query) || sku.includes(query);
  });
}
