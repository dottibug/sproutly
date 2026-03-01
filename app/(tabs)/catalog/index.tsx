import { ScrollView } from 'react-native';
import { useState } from 'react';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import type { PlantType } from '../../../components/seedCatalog/PlantTypeFilterIcon';
import { filterAndSearchCatalog, getCatalogHeading } from '../../../utils/filterAndSearchCatalog';
import Loading from '../../../components/ui/Loading';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import ScreenContainer from '../../../components/ui/ScreenContainer';
import PlantTypeFilters from '../../../components/seedCatalog/PlantTypeFilters';
import SearchBar from '../../../components/ui/SearchBar';
import Heading from '../../../components/ui/Heading';
import CatalogSeedList from '../../../components/seedCatalog/CatalogSeedList';
import { appStyles } from '../../../styles/theme';

// Seed Catalog screen
// TODO: Add loading state for filters and search
// TODO: top/bottom scroll buttons to quick scroll to the top/bottom of the list

const LOAD_MESSAGE = 'Loading catalog…';
const NO_SEEDS_MATCH = 'No seeds match your filters or search';

export default function SeedCatalogScreen() {
  // Context
  const { seeds, loading, error } = useSeedCatalog();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Set<PlantType>>(new Set());

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

  const seedResults = filterAndSearchCatalog(seeds, selectedFilters, searchQuery);

  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  const emptySeedResults: boolean = seedResults.length === 0;

  // Renders the seed catalog (either all seeds, filtered seeds, or search results).
  return (
    <ScreenContainer>
      <PlantTypeFilters selectedFilters={selectedFilters} onToggleFilter={toggleFilter} />

      <SearchBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <Heading size="medium" marginVertical={18} uppercase>
        {getCatalogHeading(searchQuery, selectedFilters.size)}
      </Heading>

      <ScrollView style={appStyles.resultsList}>
        {emptySeedResults && <ScreenMessage message={NO_SEEDS_MATCH} />}
        <CatalogSeedList seeds={seedResults} />
      </ScrollView>
    </ScreenContainer>
  );
}
