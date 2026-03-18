import { useRouter } from 'expo-router';
import { useUserSeeds } from '../../lib/contexts/UserSeedsContext';
import { UserSeedItem, Exposure } from '../../lib/types';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import SeedImage from '../seeds/SeedImage';
import SeedHeader from './SeedHeader';
import Heading from '../ui/Heading';
import { typography } from '../../styles/theme';
import SeedQuickFacts from './SeedQuickFacts';
import Accordion from '../accordion/Accordion';
import Button from '../ui/buttons/Button';
import SeedTabs from '../seeds/SeedTabs';
import { useState } from 'react';
import UserSeedDetails from './UserSeedDetails';
import UserSeedNotes from './UserSeedNotes';
import UserSeedPhotos from './UserSeedPhotos';
import UserSeedReminders from './UserSeedReminders';
import UserSeedHistory from './UserSeedHistory';

const DESCRIPTION = 'Description';
const TIMING = 'Timing';
const STARTING = 'Starting';
const GROWING = 'Growing';
const HARVEST = 'Harvest';
const COMPANION_PLANTING = 'Companion Planting';
const DELETE = 'Delete from Collection';

const SEED = 'seed';
const NOTES = 'notes';
const PHOTOS = 'photos';
const REMINDERS = 'reminders';
const HISTORY = 'history';

type ActiveTab = 'seed' | 'notes' | 'photos' | 'reminders' | 'history';

type UserSeedDetailsProps = {
  readonly seed: UserSeedItem;
};

export default function UserSeeds({ seed }: UserSeedDetailsProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>(SEED);

  const { deleteSeedByCustomId, deleteSeedByCatalogId } = useUserSeeds();

  const isCustomSeed = 'custom_seed_id' in seed && seed.custom_seed_id !== null;

  const handleDeleteFromCollection = () => {
    if (isCustomSeed) deleteSeedByCustomId(seed);
    else deleteSeedByCatalogId(seed);
    router.replace(`/home/`);
  };

  const handleTabPress = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  console.log('activeTab', activeTab);
  console.log('seed', seed);

  return (
    <>
      <SeedTabs activeTab={activeTab} onTabPress={handleTabPress} />

      <UserSeedDetails seed={seed} activeTab={activeTab} />
      <UserSeedNotes activeTab={activeTab} />
      <UserSeedPhotos activeTab={activeTab} />
      <UserSeedReminders activeTab={activeTab} />
      <UserSeedHistory activeTab={activeTab} />
    </>
  );
}

const styles = StyleSheet.create({
  scrollStyle: {
    flex: 1,
  },
  image: {
    height: 400,
    width: '100%',
  },
  description: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  buttonContainer: {
    marginBottom: 32,
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
