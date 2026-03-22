import { UserSeedTab, USER_SEED_TABS } from '../../state/app/appTypes';
import { StyleSheet } from 'react-native';

import { useMemo, useState } from 'react';
import UserSeedDetails from './UserSeedDetails';
import UserSeedNotes from './UserSeedNotes';
import UserSeedPhotos from './UserSeedPhotos';
import Tabs from '../ui/Tabs';
import { getPendingTodayCount } from '../../state/userSeeds/utils/taskUtils';
import UserSeedTasks from './UserSeedTasks';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';

// TODO: change badge color of tasks

type UserSeedScreenProps = {
  readonly seed: UserSeed;
};

// UserSeed component displays the details of a single seed in the user's collection, with tabs for notes, photos, reminders, and history of that seed
export default function UserSeedScreen({ seed }: UserSeedScreenProps) {
  const [activeTab, setActiveTab] = useState<UserSeedTab>('Seed');

  const tasksTodayCount = useMemo(() => getPendingTodayCount(seed.tasks ?? []), [seed.tasks]);

  const handleTabPress = (tab: string) => {
    setActiveTab(tab as UserSeedTab);
  };

  return (
    <>
      <Tabs tabs={USER_SEED_TABS} activeTab={activeTab} onTabPress={handleTabPress} badgeCounts={{ Tasks: tasksTodayCount }} />
      <UserSeedDetails seed={seed} activeTab={activeTab} />
      <UserSeedNotes activeTab={activeTab} seed={seed} />
      <UserSeedPhotos activeTab={activeTab} seed={seed} />
      <UserSeedTasks activeTab={activeTab} seed={seed} />
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
