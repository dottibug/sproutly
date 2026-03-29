import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { useFilters } from '../../state/filters/FiltersContext';
import { applyFilters, getNumberOfSelectedFilters } from '../../state/filters/filterUtils';
import { searchSeeds } from '../../state/app/appUtils';
import { ListTab } from '../../state/app/appTypes';
import UserSeedList from './UserSeedList';
import Loading from '../ui/Loading';
import ScreenMessage from '../ui/ScreenMessage';
import Filters from '../filters/Filters';
import FilterChips from '../filters/FilterChips';
import SearchBar from '../ui/SearchBar';
import { colors, appStyles } from '../../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddSeedModal from './AddSeedModal';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import SheetModal from '../ui/SheetModal';
import { AppSnackbar, FABButton, ScreenOptions } from '../uiComponentBarrel';
import FabActions from '../ui/buttons/FabActionButtons';
// import { usePathname, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { usePathname, useRouter, useFocusEffect } from 'expo-router';

const LOAD_MESSAGE = 'Loading your seeds…';
const EMPTY_SEEDS_LIST = 'Your collection is empty. Add seeds to get started.';
const NO_RESULTS_MESSAGE = 'No seeds match your filters or search';

type UserSeedsProps = {
  readonly activeTab: ListTab;
  readonly onGoToBrowse: () => void;
};

// UserSeeds component displays the user's seed collection and a floating action button to add a new seed

export default function UserSeeds({ activeTab, onGoToBrowse }: UserSeedsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const showFabActions = activeTab === 'My Seeds' && pathname === '/home';

  // State
  const [openFilterMenu, setOpenFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fabOpen, setFabOpen] = useState(false);
  const [deleteIsOpenForId, setDeleteIsOpenForId] = useState<string | null>(null);

  // Context
  const { seeds, loading, error } = useUserSeed();
  const { selected } = useFilters();
  const userCollectionSize = seeds.length;

  // Filter and search seeds
  const filteredSeeds = applyFilters(seeds, selected);
  const displayedSeeds = searchQuery.trim() === '' ? filteredSeeds : searchSeeds(filteredSeeds, searchQuery);
  const emptySeedsList: boolean = displayedSeeds.length === 0;
  const numberOfSelectedFilters = getNumberOfSelectedFilters(selected);
  const showFilterChips = !openFilterMenu && numberOfSelectedFilters > 0;

  const handleSearchQuery = (query: string) => setSearchQuery(query);

  const onAddCustomSeed = () => {
    router.push({
      pathname: '/home/customSeedSheet',
    });
  };

  const onBrowse = () => {
    onGoToBrowse();
  };

  useFocusEffect(
    useCallback(() => {
      return () => setDeleteIsOpenForId(null);
    }, []),
  );

  // Tab switch (Browse) does not blur the route, so useFocusEffect does not run — clear delete UI when My Seeds is hidden
  useEffect(() => {
    if (activeTab !== 'My Seeds') setDeleteIsOpenForId(null);
  }, [activeTab]);

  // Loading or error messages
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <View style={[styles.userSeedsContainer, { display: activeTab === 'My Seeds' ? 'flex' : 'none' }]}>
      {/* <ScrollView style={styles.userSeedsContainer}> */}
      <SearchBar placeholder="Search seeds..." searchQuery={searchQuery} handleSearchQuery={handleSearchQuery} />
      <Filters open={openFilterMenu} setOpen={setOpenFilterMenu} />

      {showFilterChips && <FilterChips />}

      <View style={styles.userSeedsContent}>
        {!emptySeedsList && <Text style={styles.deleteHint}>Long press to delete a seed</Text>}
        <View style={appStyles.resultsList}>
          {emptySeedsList && <ScreenMessage message={userCollectionSize > 0 ? NO_RESULTS_MESSAGE : EMPTY_SEEDS_LIST} />}
          <UserSeedList
            seeds={displayedSeeds as UserSeed[]}
            deleteIsOpenForId={deleteIsOpenForId}
            setDeleteIsOpenForId={setDeleteIsOpenForId}
          />
        </View>
      </View>
      {/* </ScrollView> */}

      <FabActions
        open={fabOpen}
        setFabOpen={setFabOpen}
        onAddCustomSeed={onAddCustomSeed}
        onBrowse={onBrowse}
        bottomInset={insets.bottom}
        showFabActions={showFabActions}
      />
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
  },
  snackbarContent: {
    flexDirection: 'row',
    gap: 32,
  },
  fabActions: {},
});
