import { UserSeedItem, UserSeedTab, USER_SEED_TABS } from '../../utils/types';
import { StyleSheet } from 'react-native';

import { useState } from 'react';
import UserSeedDetails from './UserSeedDetails';
import UserSeedNotes from './UserSeedNotes';
import UserSeedPhotos from './UserSeedPhotos';
import UserSeedReminders from './UserSeedReminders';
import UserSeedHistory from './UserSeedHistory';
import Tabs from '../ui/Tabs';

type UserSeedProps = {
  readonly seed: UserSeedItem;
};

// UserSeed component displays the details of a single seed in the user's collection, with tabs for notes, photos, reminders, and history of that seed
export default function UserSeed({ seed }: UserSeedProps) {
  const [activeTab, setActiveTab] = useState<UserSeedTab>('Seed');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as UserSeedTab);
  };

  return (
    <>
      <Tabs tabs={USER_SEED_TABS} activeTab={activeTab} onTabPress={handleTabPress} />
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
