import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import PlantTypeFilters from './PlantTypeFilters';
import type { PlantType } from './PlantTypeFilterIcon';

import Heading from '../ui/Heading';
import { appStyles } from '../../styles/theme';
import ScreenMessage from '../ui/ScreenMessage';
import CatalogSeedList from './CatalogSeedList';
import Loading from '../ui/Loading';
import { useSeedCatalog } from '../../lib/contexts/SeedCatalogContext';
import { filterCatalogSeeds } from '../../lib/utils/filterUtils';
import { searchSeeds } from '../../lib/utils/searchUtils';
import SearchBar from '../ui/SearchBar';

// TODO: Styling of browse seeds screen

const NO_SEEDS_MATCH = 'No seeds match your filters or search';
const LOAD_MESSAGE = 'Loading catalog…';

type BrowseSeedsProps = {
  readonly activeTab: 'mySeeds' | 'browse';
  readonly browseFromAddSeed?: boolean;
};

export default function BrowseSeeds({ activeTab, browseFromAddSeed }: BrowseSeedsProps) {
  // Context
  const { seeds, loading, error } = useSeedCatalog();

  // State
  const [selectedFilters, setSelectedFilters] = useState<Set<PlantType>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search seeds
  const filteredSeeds = filterCatalogSeeds(seeds, selectedFilters);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedResults: boolean = displayedSeeds.length === 0;

  const seedListHeading = () => {
    if (searchQuery !== '') return 'Search Results';
    if (selectedFilters.size > 0) return 'Filtered Seeds';
    return 'All Seeds';
  };

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
    <View style={[styles.browseContainer, { display: activeTab === 'browse' ? 'flex' : 'none' }]}>
      <PlantTypeFilters selectedFilters={selectedFilters} onToggleFilter={toggleFilter} />

      <SearchBar placeholder="Search seeds..." searchQuery={searchQuery} handleSearchQuery={setSearchQuery} />

      <View style={styles.seedListContainer}>
        <Heading size="medium" marginVertical={18} uppercase>
          {seedListHeading()}
        </Heading>

        <ScrollView style={appStyles.resultsList}>
          {emptySeedResults && <ScreenMessage message={NO_SEEDS_MATCH} />}
          <CatalogSeedList seeds={displayedSeeds} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  browseContainer: {
    flex: 1,
  },
  seedListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
