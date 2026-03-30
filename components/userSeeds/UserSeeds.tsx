import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { usePathname, useRouter, useFocusEffect } from 'expo-router';
import { useUserSeed, useFilters } from '../../state/barrels/contextBarrel';
import { ListTab, UserSeed } from '../../state/barrels/typesBarrel';
import { applyFilters, getNumberOfSelectedFilters, searchSeeds } from '../../state/barrels/utilsBarrel';
import { Loading, ScreenMessage, SearchBar, FabActionButtons } from '../uiComponentBarrel';
import Filters from '../filters/Filters';
import FilterChips from '../filters/FilterChips';
import UserSeedList from './UserSeedList';
import { colors, appStyles } from '../../styles/theme';

// UserSeeds.tsx: Displays the user's seed collection. Users can filter and search their seed collection, as well as add new seeds to their collection.

type UserSeedsProps = {
  readonly activeTab: ListTab;
  readonly onGoToBrowse: () => void;
};

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

  // Remove deleteIsOpenForId state when switching between 'My Seeds' and 'Browse' tabs
  useFocusEffect(
    useCallback(() => {
      return () => setDeleteIsOpenForId(null);
    }, []),
  );

  useEffect(() => {
    if (activeTab !== 'My Seeds') setDeleteIsOpenForId(null);
  }, [activeTab]);

  const handleSearchQuery = (query: string) => setSearchQuery(query);

  const onAddCustomSeed = () => {
    router.push({
      pathname: '/home/customSeedSheet',
    });
  };

  const onBrowse = () => {
    onGoToBrowse();
  };

  if (loading) return <Loading />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <View style={[styles.userSeedsContainer, { display: activeTab === 'My Seeds' ? 'flex' : 'none' }]}>
      <SearchBar searchQuery={searchQuery} handleSearchQuery={handleSearchQuery} />
      <Filters open={openFilterMenu} setOpen={setOpenFilterMenu} />
      {showFilterChips && <FilterChips />}
      <View style={styles.userSeedsContent}>
        <View style={appStyles.resultsList}>
          {emptySeedsList && <ScreenMessage message={userCollectionSize > 0 ? NO_RESULTS_MESSAGE : EMPTY_SEEDS_LIST} />}
          <UserSeedList
            seeds={displayedSeeds as UserSeed[]}
            deleteIsOpenForId={deleteIsOpenForId}
            setDeleteIsOpenForId={setDeleteIsOpenForId}
          />
        </View>
      </View>
      <FabActionButtons
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

// ---- CONSTANTS ----
const EMPTY_SEEDS_LIST = 'Your collection is empty. Add seeds to get started.';
const NO_RESULTS_MESSAGE = 'No seeds match your filters or search';

// ---- STYLES ----
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
