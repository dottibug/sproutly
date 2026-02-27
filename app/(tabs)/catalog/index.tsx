import { Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import { useState, useCallback, useMemo } from 'react';
import type { SeedCatalogItem } from '../../../lib/seedCatalog';
import type { PlantType } from '../../../components/seedCatalog/PlantTypeFilterIcon';
import Loading from '../../../components/ui/Loading';
import ErrorSeedList from '../../../components/ui/ErrorSeedList';
import PlantTypeFilters from '../../../components/seedCatalog/PlantTypeFilters';
import SearchBar from '../../../components/ui/SearchBar';
import Heading from '../../../components/ui/Heading';
import CatalogSeedCard from '../../../components/seedCatalog/CatalogSeedCard';
import { colors, typography } from '../../../styles/theme';

const SEEDS_HEADING = 'All Seeds';
const SEARCH_RESULTS_HEADING = 'Search results';
const FILTERED_SEEDS_HEADING = 'Filtered seeds';

function mapFilterToSeedType(plantType: PlantType): SeedCatalogItem['type'] {
  if (plantType === 'Veggie') return 'Vegetable';
  return plantType;
}

// Seed Catalog screen
// TODO: Streamline the components and logic/functions so the code is more readable
// TODO: Add loading state for filters and search
// TODO: top/bottom scroll buttons to quick scroll to the top/bottom of the list
export default function SeedCatalogScreen() {
  const { seeds, loading, error } = useSeedCatalog();

  // State (selected filters and search query)
  const [selectedFilters, setSelectedFilters] = useState<Set<PlantType>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle the filter for the given type
  const onToggleFilter = useCallback((type: PlantType) => {
    setSelectedFilters((prev) => {
      const filters = new Set(prev); // don't mutate previous state
      if (filters.has(type))
        filters.delete(type); // toggle off
      else filters.add(type); // toggle on
      return filters;
    });
  }, []);

  // Show seed results based on the selected filters (memoized to avoid unnecessary re-renders)
  const seedResults = useMemo(() => {
    let list = seeds;

    // Apply selected filters to seed results (if any)
    if (selectedFilters.size > 0) {
      const filters = new Set(Array.from(selectedFilters).map(mapFilterToSeedType));
      list = list.filter((seed) => filters.has(seed.type));
    }

    // Apply search query to seed results
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (seed) =>
          seed.name.toLowerCase().includes(query) || seed.category?.toLowerCase().includes(query) || seed.sku.toLowerCase().includes(query),
      );
    }

    return list;
  }, [seeds, selectedFilters, searchQuery]);

  const headingText = useMemo(() => {
    if (searchQuery !== '') return SEARCH_RESULTS_HEADING;
    if (selectedFilters.size > 0) return FILTERED_SEEDS_HEADING;
    return SEEDS_HEADING;
  }, [searchQuery, selectedFilters]);

  if (loading) return <Loading message="Loading catalog…" />;
  if (error) return <ErrorSeedList error={error} />;

  // Renders the seed catalog (either all seeds, filtered seeds, or search results).
  return (
    <SafeAreaView style={styles.catalogContainer} edges={['left', 'right']}>
      <PlantTypeFilters selectedFilters={selectedFilters} onToggleFilter={onToggleFilter} />

      <SearchBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <Heading size="medium" marginVertical={18} uppercase>
        {headingText}
      </Heading>

      <ScrollView style={styles.seedResultsList}>
        {/* No results message */}
        {seedResults.length === 0 && <Text style={styles.noResults}>No seeds match your filters or search</Text>}

        {/* Seed results */}
        {seedResults.map((seed: SeedCatalogItem, index: number) => (
          <CatalogSeedCard key={seed.id} seed={seed} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  catalogContainer: {
    flex: 1,
    padding: 16,
  },
  seedResultsList: {
    flex: 1,
    gap: 16,
  },
  noResults: {
    color: colors.gray,
    fontSize: typography.textMedium.fontSize,
    fontStyle: 'italic',
    marginBottom: 8,
    marginTop: 8,
  },
});
