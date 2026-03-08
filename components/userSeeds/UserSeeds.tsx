import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import Loading from '../ui/Loading';
import ScreenMessage from '../ui/ScreenMessage';
import Heading from '../ui/Heading';
import UserSeedList from './UserSeedList';
import Filters from '../filters/Filters';
import { colors, appStyles } from '../../styles/theme';

const LOAD_MESSAGE = 'Loading your seeds…';
const LIST_TITLE = 'My Seeds';
const EMPTY_SEEDS_LIST = 'Your collection is empty. Add seeds to get started.';

export default function UserSeeds() {
  // Context
  const { seeds, loading, error } = useUserSeeds();
  const emptySeedsList: boolean = seeds.length === 0;

  // Loading or error messages
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <ScrollView style={styles.userSeedsContainer}>
      {/* TODO: Filters */}

      <Filters />

      {/* TODO: Search bar */}
      {/* TODO: FAB: Add seed */}

      <View style={styles.userSeedsContent}>
        {!emptySeedsList && <Text style={styles.deleteHint}>Long press to delete a seed</Text>}

        <View style={appStyles.resultsList}>
          {emptySeedsList && <ScreenMessage message={EMPTY_SEEDS_LIST} />}
          <UserSeedList seeds={seeds} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userSeedsContainer: {
    flex: 1,
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
});
