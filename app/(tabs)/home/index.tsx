import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import Loading from '../../../components/ui/Loading';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import Tabs from '../../../components/seeds/Tabs';
import UserSeeds from '../../../components/userSeeds/UserSeeds';
import BrowseSeeds from '../../../components/seedCatalog/BrowseSeeds';
import { colors } from '../../../styles/theme';

// Seed Catalog screen
// TODO: top/bottom scroll buttons to quick scroll to the top/bottom of the list

const LOAD_MESSAGE = 'Loading…';
const MY_SEEDS = 'mySeeds';
const BROWSE = 'browse';

type ActiveTab = 'mySeeds' | 'browse';

export default function HomeScreen() {
  // Context
  const { loading, error } = useSeedCatalog();

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>(MY_SEEDS);

  const handleTabPress = () => setActiveTab((prev) => (prev === MY_SEEDS ? BROWSE : MY_SEEDS));

  const handleGoToBrowse = () => setActiveTab(BROWSE);

  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  // Renders the user seeds or browse seeds screen based on the active tab
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white }}>
      <Tabs activeTab={activeTab} onTabPress={handleTabPress} />
      <UserSeeds activeTab={activeTab} onGoToBrowse={handleGoToBrowse} />
      <BrowseSeeds activeTab={activeTab} />
    </SafeAreaView>
  );
}
