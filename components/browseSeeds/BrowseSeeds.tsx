import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CategoryFilters from './CategoryFilters';
import Heading from '../ui/Heading';
import { appStyles } from '../../styles/theme';
import ScreenMessage from '../ui/ScreenMessage';
import Loading from '../ui/Loading';
import { useBrowseSeed } from '../../state/browseSeeds/BrowseSeedContext';
import { filterBrowseSeeds } from '../../state/filters/filterUtils';
import { searchSeeds } from '../../state/app/appUtils';
import SearchBar from '../ui/SearchBar';
import BrowseSeedList from './BrowseSeedList';
import { ListTab } from '../../state/app/appTypes';
import { type CategoryFilter } from '../../state/filters/filterTypes';

// TODO: Styling of browse seeds screen

const NO_SEEDS_MATCH = 'No seeds match your filters or search';
const LOAD_MESSAGE = 'Loading catalog…';

type BrowseSeedsProps = {
  readonly activeTab: ListTab;
};

export default function BrowseSeeds({ activeTab }: BrowseSeedsProps) {
  // Context
  const { seeds, loading, error } = useBrowseSeed();

  // State
  const [selectedFilters, setSelectedFilters] = useState<Set<CategoryFilter>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and search seeds
  const filteredSeeds = filterBrowseSeeds(seeds, selectedFilters);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedResults: boolean = displayedSeeds.length === 0;

  const seedListHeading = () => {
    if (searchQuery !== '') return 'Search Results';
    if (selectedFilters.size > 0) return 'Filtered Seeds';
    return 'All Seeds';
  };

  // Toggle filters on/off
  function toggleFilter(category: CategoryFilter) {
    setSelectedFilters((prev) => {
      const filterSet = new Set(prev);
      // Toggle filter off
      if (filterSet.has(category)) filterSet.delete(category);
      // Toggle filter on
      else filterSet.add(category);
      return filterSet;
    });
  }

  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <View style={[styles.browseContainer, { display: activeTab === 'Browse' ? 'flex' : 'none' }]}>
      <CategoryFilters selectedFilters={selectedFilters} onToggleFilter={toggleFilter} />

      <SearchBar placeholder="Search seeds..." searchQuery={searchQuery} handleSearchQuery={setSearchQuery} />

      <View style={styles.seedListContainer}>
        <Heading size="medium" marginVertical={18} uppercase>
          {seedListHeading()}
        </Heading>

        <ScrollView style={appStyles.resultsList}>
          {emptySeedResults && <ScreenMessage message={NO_SEEDS_MATCH} />}
          <BrowseSeedList seeds={displayedSeeds} />
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
