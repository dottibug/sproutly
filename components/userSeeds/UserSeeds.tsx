import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useState } from 'react';
import { useUserSeeds } from '../../context/UserSeedsContext';
import { useFilters } from '../../context/FiltersContext';
import { applyFilters, getNumberOfSelectedFilters } from '../../utils/filterUtils';
import { searchSeeds } from '../../utils/searchUtils';
import { ListTab, UserSeedItem } from '../../utils/types';
import UserSeedList from './UserSeedList';
import Loading from '../ui/Loading';
import ScreenMessage from '../ui/ScreenMessage';
import Filters from '../filters/Filters';
import FilterChips from '../filters/FilterChips';
import SearchBar from '../ui/SearchBar';
import { colors, appStyles } from '../../styles/theme';
import { FAB as PaperFAB } from 'react-native-paper';
import AddSeedModal from './AddSeedModal';

const LOAD_MESSAGE = 'Loading your seeds…';
const EMPTY_SEEDS_LIST = 'Your collection is empty. Add seeds to get started.';
const NO_RESULTS_MESSAGE = 'No seeds match your filters or search';

type UserSeedsProps = {
  readonly activeTab: ListTab;
  readonly onGoToBrowse: () => void;
};

// UserSeeds component displays the user's seed collection and a floating action button to add a new seed
export default function UserSeeds({ activeTab, onGoToBrowse }: UserSeedsProps) {
  // State
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addSeedModalVisible, setAddSeedModalVisible] = useState(false);

  // Context
  const { seeds, loading, error } = useUserSeeds();
  const { selected } = useFilters();
  const userCollectionSize = seeds.length;

  // Filter and search seeds
  const filteredSeeds = applyFilters(seeds, selected);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedsList: boolean = displayedSeeds.length === 0;
  const numberOfSelectedFilters = getNumberOfSelectedFilters(selected);
  const showFilterChips = !openFilterMenu && numberOfSelectedFilters > 0;

  // Loading or error messages
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  const handleSearchQuery = (query: string) => setSearchQuery(query);

  const handleAddSeed = () => setAddSeedModalVisible(true);

  const handleGoToBrowse = () => {
    setAddSeedModalVisible(false);
    onGoToBrowse();
  };

  return (
    <View style={[styles.userSeedsContainer, { display: activeTab === 'My Seeds' ? 'flex' : 'none' }]}>
      <ScrollView style={styles.userSeedsContainer}>
        <Filters open={openFilterMenu} setOpen={setOpenFilterMenu} />

        {showFilterChips && <FilterChips />}

        <SearchBar placeholder="Search seeds..." searchQuery={searchQuery} handleSearchQuery={handleSearchQuery} />

        <View style={styles.userSeedsContent}>
          {!emptySeedsList && <Text style={styles.deleteHint}>Long press to delete a seed</Text>}
          <View style={appStyles.resultsList}>
            {emptySeedsList && <ScreenMessage message={userCollectionSize > 0 ? NO_RESULTS_MESSAGE : EMPTY_SEEDS_LIST} />}
            <UserSeedList seeds={displayedSeeds as UserSeedItem[]} />
          </View>
        </View>
      </ScrollView>
      <PaperFAB
        icon="plus"
        style={[styles.addSeedFab, { backgroundColor: colors.hunterGreen }]}
        color={colors.white}
        onPress={handleAddSeed}
      />
      {addSeedModalVisible && (
        <AddSeedModal visible={addSeedModalVisible} onRequestClose={() => setAddSeedModalVisible(false)} onGoToBrowse={handleGoToBrowse} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  userSeedsContainer: {
    flex: 1,
    position: 'relative',
  },
  userSeedsContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  deleteHint: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 16,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  addSeedFab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
