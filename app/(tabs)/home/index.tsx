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

export default function SeedCatalogScreen() {
  // Context
  const { loading, error } = useSeedCatalog();

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>(MY_SEEDS);

  function handleTabPress() {
    setActiveTab((prev) => (prev === MY_SEEDS ? BROWSE : MY_SEEDS));
  }

  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  // Renders the seed catalog (either all seeds, filtered seeds, or search results).
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white }}>
      <Tabs activeTab={activeTab} onTabPress={handleTabPress} />

      {activeTab === MY_SEEDS && <UserSeeds />}

      {activeTab === BROWSE && <BrowseSeeds />}
    </SafeAreaView>
  );
}
