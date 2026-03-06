import { ScrollView, Text, StyleSheet } from 'react-native';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';
import Loading from '../../../components/ui/Loading';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import ScreenContainer from '../../../components/ui/ScreenContainer';
import Heading from '../../../components/ui/Heading';
import UserSeedList from '../../../components/userSeeds/UserSeedList';
import { appStyles, colors } from '../../../styles/theme';

// TODO: change scrollview to flatlist?? (ditto in catalog screen)

const LOAD_MESSAGE = 'Loading your seeds…';
const LIST_TITLE = 'My Seeds';
const EMPTY_SEEDS_LIST = 'Your collection is empty. Add seeds to get started.';

// Main screen 'Home' tab
export default function Home() {
  const { seeds, loading, error } = useUserSeeds();
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;
  const emptySeedsList: boolean = seeds.length === 0;

  return (
    <ScreenContainer>
      <Heading size="medium" marginVertical={18} uppercase>
        {LIST_TITLE}
      </Heading>
      {!emptySeedsList && <Text style={styles.deleteHint}>Long press to delete a seed</Text>}
      <ScrollView style={appStyles.resultsList}>
        {emptySeedsList && <ScreenMessage message={EMPTY_SEEDS_LIST} />}
        <UserSeedList seeds={seeds} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  deleteHint: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: -10,
    marginBottom: 24,
    fontStyle: 'italic',
  },
});
