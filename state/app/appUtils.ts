import { UserSeed } from '../userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../browseSeeds/browseTypes';

// ---- TIMESTAMP ----
export function getTimestamp() {
  return new Date().toISOString();
}

// ---- TEMP ID ----
export function createTempId() {
  const now = getTimestamp();
  return `temp-${now}`;
}

// ---- SEARCH UTILS ----
export function searchSeeds(seeds: UserSeed[] | BrowseSeed[], searchQuery: string): UserSeed[] | BrowseSeed[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return seeds;

  // Nullish coalescing; don't use || because it will return true for falsy empty strings
  return seeds.filter(
    (seed) =>
      seed.variety.toLowerCase().includes(query) ?? seed.category?.toLowerCase().includes(query) ?? seed.sku.toLowerCase().includes(query),
  );
}
