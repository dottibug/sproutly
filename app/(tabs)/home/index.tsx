import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useBrowseSeed } from '../../../state/browseSeeds/BrowseSeedContext';
import { useFilters } from '../../../state/filters/FiltersContext';
import UserSeeds from '../../../components/userSeeds/UserSeeds';
import BrowseSeeds from '../../../components/browseSeeds/BrowseSeeds';
import { Loading, ScreenMessage, Tabs } from '../../../components/uiComponentBarrel';
import { ListTab, LIST_TABS } from '../../../state/app/appTypes';
import { colors } from '../../../styles/theme';

// (tabs)/home/index.tsx: Home screen for the app. Users can switch between their own seed collection and the seed catalog, as well as click the floating action button to add a new seed.

export default function HomeScreen() {
  const { loading, error } = useBrowseSeed();
  const { clearAllSelected } = useFilters();
  const [activeTab, setActiveTab] = useState<ListTab>('My Seeds');

  const handleTabPress = (tab: ListTab) => setActiveTab(tab);

  useEffect(() => {
    clearAllSelected();
  }, [activeTab, clearAllSelected]);

  if (loading) return <Loading />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.white }}>
      <Tabs tabs={LIST_TABS} activeTab={activeTab} onTabPress={(tab: string) => handleTabPress(tab as ListTab)} />
      <ScrollView style={styles.seedsContainer}>
        <UserSeeds activeTab={activeTab} onGoToBrowse={() => handleTabPress('Browse')} />
        <BrowseSeeds activeTab={activeTab} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  seedsContainer: {
    flex: 1,
    position: 'relative',
  },
});
