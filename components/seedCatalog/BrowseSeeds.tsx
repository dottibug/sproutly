import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PlantTypeFilters from './PlantTypeFilters';
import type { PlantType } from './PlantTypeFilterIcon';
import SearchBar from '../ui/SearchBar';
import Heading from '../ui/Heading';
import { getCatalogHeading, filterAndSearchCatalog } from '../../utils/filterAndSearchCatalog';
import { appStyles } from '../../styles/theme';
import ScreenMessage from '../ui/ScreenMessage';
import CatalogSeedList from './CatalogSeedList';
import Loading from '../ui/Loading';
import { useSeedCatalog } from '../../lib/contexts/SeedCatalogContext';

const NO_SEEDS_MATCH = 'No seeds match your filters or search';
const LOAD_MESSAGE = 'Loading catalog…';

export default function BrowseSeeds() {
  // Context
  const { seeds, loading, error } = useSeedCatalog();

  // State
  const [selectedFilters, setSelectedFilters] = useState<Set<PlantType>>(new Set());

  const [searchQuery, setSearchQuery] = useState('');

  const seedResults = filterAndSearchCatalog(seeds, selectedFilters, searchQuery);

  const emptySeedResults: boolean = seedResults.length === 0;

  // Toggle filters on/off
  function toggleFilter(plantType: PlantType) {
    setSelectedFilters((prev) => {
      const filterSet = new Set(prev);
      // Toggle filter off
      if (filterSet.has(plantType)) filterSet.delete(plantType);
      // Toggle filter on
      else filterSet.add(plantType);
      return filterSet;
    });
  }

  if (loading) return <Loading message={LOAD_MESSAGE} />;

  if (error) return <ScreenMessage message={error} />;

  return (
    <View style={styles.browseContainer}>
      <PlantTypeFilters selectedFilters={selectedFilters} onToggleFilter={toggleFilter} />

      <SearchBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <Heading size="medium" marginVertical={18} uppercase>
        {getCatalogHeading(searchQuery, selectedFilters.size)}
      </Heading>

      <ScrollView style={appStyles.resultsList}>
        {emptySeedResults && <ScreenMessage message={NO_SEEDS_MATCH} />}
        <CatalogSeedList seeds={seedResults} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  browseContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
