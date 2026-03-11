import { UserSeedItem, CatalogSeedItem } from '../types';

export function searchSeeds(seeds: UserSeedItem[] | CatalogSeedItem[], searchQuery: string): UserSeedItem[] | CatalogSeedItem[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return seeds;

  return seeds.filter(
    (seed) =>
      seed.name.toLowerCase().includes(query) || seed.category?.toLowerCase().includes(query) || seed.sku.toLowerCase().includes(query),
  );
}
