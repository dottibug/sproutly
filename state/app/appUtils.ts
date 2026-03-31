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

  const terms = query.split(' ').filter(Boolean);

  return seeds.filter((seed) => {
    const searchableFields = [seed.variety, seed.plant, seed.category, seed.sku, seed.latin].filter(Boolean).join(' ').toLowerCase();
    return terms.every((term) => searchableFields.includes(term));
  });
}
