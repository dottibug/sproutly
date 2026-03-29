import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CategoryFilters from './CategoryFilters';
import Heading from '../ui/Heading';
import { appStyles } from '../../styles/theme';
import ScreenMessage from '../ui/ScreenMessage';
import Loading from '../ui/Loading';
import { useBrowseSeed } from '../../state/browseSeeds/BrowseSeedContext';
import { applyFilters, filterBrowseSeeds, getNumberOfSelectedFilters } from '../../state/filters/filterUtils';
import { searchSeeds } from '../../state/app/appUtils';
import SearchBar from '../ui/SearchBar';
import BrowseSeedList from './BrowseSeedList';
import { ListTab } from '../../state/app/appTypes';
import { type CategoryFilter } from '../../state/filters/filterTypes';
import Filters from '../filters/Filters';
import { useFilters } from '../../state/filters/FiltersContext';
import FilterChips from '../filters/FilterChips';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';

const NO_RESULTS_MESSAGE = 'No seeds match your filters or search';
const LOAD_MESSAGE = 'Loading catalog…';

type BrowseSeedsProps = {
  readonly activeTab: ListTab;
  readonly onGoToMySeeds: () => void;
};

export default function BrowseSeeds({ activeTab, onGoToMySeeds }: BrowseSeedsProps) {
  // Context
  const { seeds, loading, error } = useBrowseSeed();

  // State
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Context
  const { selected } = useFilters();

  // Filter and search seeds
  const filteredSeeds = applyFilters(seeds, selected);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedResults: boolean = displayedSeeds.length === 0;
  const numberOfSelectedFilters = getNumberOfSelectedFilters(selected);
  const showFilterChips = !openFilterMenu && numberOfSelectedFilters > 0;

  // Loading or error messages
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  const handleSearchQuery = (query: string) => setSearchQuery(query);

  // const onGoToMySeeds = () => {
  //   onGoToMySeeds();
  // };

  return (
    <View style={[styles.browseContainer, { display: activeTab === 'Browse' ? 'flex' : 'none' }]}>
      <Filters open={openFilterMenu} setOpen={setOpenFilterMenu} />
      {showFilterChips && <FilterChips />}
      <SearchBar placeholder="Search seeds..." searchQuery={searchQuery} handleSearchQuery={handleSearchQuery} />
      <View style={styles.seedListContainer}>
        <View style={appStyles.resultsList}>
          {emptySeedResults && <ScreenMessage message={NO_RESULTS_MESSAGE} />}
          <BrowseSeedList seeds={displayedSeeds as BrowseSeed[]} />
        </View>
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
