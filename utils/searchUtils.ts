import { UserSeedItem, BrowseSeedItem } from './types';

export function searchSeeds(seeds: UserSeedItem[] | BrowseSeedItem[], searchQuery: string): UserSeedItem[] | BrowseSeedItem[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return seeds;

  return seeds.filter(
    (seed) =>
      seed.name.toLowerCase().includes(query) || seed.category?.toLowerCase().includes(query) || seed.sku.toLowerCase().includes(query),
  );
}
