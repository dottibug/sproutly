import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useBrowseSeed } from '../../../state/browseSeeds/BrowseSeedContext';
import UserSeeds from '../../../components/userSeeds/UserSeeds';
import BrowseSeeds from '../../../components/browseSeeds/BrowseSeeds';
import { Loading, ScreenMessage, Tabs } from '../../../components/uiComponentBarrel';
import { ListTab, LIST_TABS } from '../../../state/app/appTypes';
import { colors } from '../../../styles/theme';

// TODO: top/bottom scroll buttons to quick scroll to the top/bottom of the list

// (tabs)/home/index.tsx: Home screen for the app. Users can switch between their own seed collection and the seed catalog, as well as click the floating action button to add a new seed.
export default function HomeScreen() {
  const { loading, error } = useBrowseSeed();
  const [activeTab, setActiveTab] = useState<ListTab>('My Seeds');

  const handleTabPress = (tab: ListTab) => setActiveTab(tab);

  if (loading) return <Loading message="Loading seeds..." />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white }}>
      <Tabs tabs={LIST_TABS} activeTab={activeTab} onTabPress={(tab: string) => handleTabPress(tab as ListTab)} />
      <UserSeeds activeTab={activeTab} onGoToBrowse={() => handleTabPress('Browse')} />
      <BrowseSeeds activeTab={activeTab} />
    </SafeAreaView>
  );
}
