import type { SeedCatalogItem } from '../lib/seedCatalog';
import type { PlantType } from '../components/seedCatalog/PlantTypeFilterIcon';

// Filter and search catalog seeds. Returns a list of seeds that match the selected filters and search query. Filters are applied first, then search query is applied.
export const filterAndSearchCatalog = (seeds: SeedCatalogItem[], selectedFilters: Set<PlantType>, searchQuery: string) => {
  let list = seeds;
  list = filterCatalogSeeds(list, selectedFilters);
  list = searchCatalogSeeds(list, searchQuery);
  return list;
};

// Helper function to filter seeds
function filterCatalogSeeds(seeds: SeedCatalogItem[], selectedFilters: Set<PlantType>): SeedCatalogItem[] {
  if (selectedFilters.size > 0) {
    const filterArray = Array.from(selectedFilters);

    const filters = filterArray.map((plantType) => {
      if (plantType === 'Veggie') return 'Vegetable';
      return plantType;
    });

    return seeds.filter((seed) => new Set(filters).has(seed.type));
  }
  return seeds; // No filters applied (return all seeds)
}

// Helper function to search seeds
function searchCatalogSeeds(seeds: SeedCatalogItem[], searchQuery: string): SeedCatalogItem[] {
  let list = seeds;
  const query = searchQuery.trim().toLowerCase();

  if (query) {
    // Filter seed name, category, and sku by query
    list = list.filter(
      (seed) =>
        seed.name.toLowerCase().includes(query) || seed.category?.toLowerCase().includes(query) || seed.sku.toLowerCase().includes(query),
    );
  }
  return list;
}

// Helper function to get the catalog heading based on whether there is a search query or filters applied.
export function getCatalogHeading(searchQuery: string, numFilters: number): string {
  if (searchQuery !== '') return 'Search Results';
  if (numFilters > 0) return 'Filtered seeds';
  return 'All Seeds'; // No search query or filters applied
}
