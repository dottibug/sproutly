import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useBrowseSeed, useFilters } from '../../state/barrels/contextBarrel';
import { ListTab } from '../../state/app/appTypes';
import { applyFilters, getNumberOfSelectedFilters, searchSeeds } from '../../state/barrels/utilsBarrel';
import { Loading, ScreenMessage, SearchBar } from '../../components/uiComponentBarrel';
import BrowseSeedList from './BrowseSeedList';
import Filters from '../filters/Filters';
import FilterChips from '../filters/FilterChips';
import { appStyles } from '../../styles/theme';

// BrowseSeeds.tsx: Displays the seed catalog and allows users to filter and search for seeds to add to their collection

type BrowseSeedsProps = {
  readonly activeTab: ListTab;
};

export default function BrowseSeeds({ activeTab }: BrowseSeedsProps) {
  const { seeds, loading, error } = useBrowseSeed();
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { selected } = useFilters();

  // Filter and search seeds
  const filteredSeeds = applyFilters(seeds, selected);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedResults: boolean = displayedSeeds.length === 0;
  const numberOfSelectedFilters = getNumberOfSelectedFilters(selected);
  const showFilterChips = !openFilterMenu && numberOfSelectedFilters > 0;

  // Loading or error messages
  if (loading) return <Loading />;
  if (error) return <ScreenMessage message={error} />;

  const handleSearchQuery = (query: string) => setSearchQuery(query);

  return (
    <View style={[styles.browseContainer, { display: activeTab === 'Browse' ? 'flex' : 'none' }]}>
      <SearchBar searchQuery={searchQuery} handleSearchQuery={handleSearchQuery} />
      <Filters open={openFilterMenu} setOpen={setOpenFilterMenu} />
      {showFilterChips && <FilterChips />}
      <View style={styles.seedListContainer}>
        <View style={appStyles.resultsList}>
          {emptySeedResults && <ScreenMessage message={NO_RESULTS_MESSAGE} />}
          <BrowseSeedList seeds={displayedSeeds} />
        </View>
      </View>
    </View>
  );
}

const NO_RESULTS_MESSAGE = 'No seeds match your filters or search';

// ---- STYLES ----
const styles = StyleSheet.create({
  browseContainer: {
    flex: 1,
  },
  seedListContainer: {
    flex: 1,
  },
});
