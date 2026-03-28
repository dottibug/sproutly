import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from '../../../components/ui/Loading';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import UserSeeds from '../../../components/userSeeds/UserSeeds';
import BrowseSeeds from '../../../components/browseSeeds/BrowseSeeds';
import { colors } from '../../../styles/theme';
import Tabs from '../../../components/ui/Tabs';
import { ListTab, LIST_TABS } from '../../../state/app/appTypes';
import { useBrowseSeed } from '../../../state/browseSeeds/BrowseSeedContext';
import { Stack } from 'expo-router';

// Seed Catalog screen
// TODO: top/bottom scroll buttons to quick scroll to the top/bottom of the list

const LOAD_MESSAGE = 'Loading…';

export default function HomeScreen() {
  const { loading, error } = useBrowseSeed();
  const [activeTab, setActiveTab] = useState<ListTab>('My Seeds');
  const handleTabPress = (tab: ListTab) => setActiveTab(tab);
  if (loading) return <Loading message={LOAD_MESSAGE} />;
  if (error) return <ScreenMessage message={error} />;

  // Render the seed list (user collection or browse) based on the active tab

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white }}>
      <Tabs tabs={LIST_TABS} activeTab={activeTab} onTabPress={(tab: string) => handleTabPress(tab as ListTab)} />
      <UserSeeds activeTab={activeTab} onGoToBrowse={() => handleTabPress('Browse')} />
      <BrowseSeeds activeTab={activeTab} />
    </SafeAreaView>
  );
}
