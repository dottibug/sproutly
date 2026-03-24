import { UserSeedTab, USER_SEED_TABS } from '../../state/app/appTypes';
import { useMemo, useState } from 'react';
import UserSeedDetails from './UserSeedDetails';
import UserSeedNotes from './notes/UserSeedNotes';
import UserSeedPhotos from './UserSeedPhotos';
import Tabs from '../ui/Tabs';
import { getPendingTodayCount } from '../../state/userSeeds/tasks/taskUtils';
import UserSeedTasks from './tasks/UserSeedTasks';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { colors } from '../../styles/theme';

// TODO: change badge color of tasks

type UserSeedScreenProps = {
  readonly seed: UserSeed;
};

// UserSeed component displays the details of a single seed in the user's collection, with tabs for notes, photos, reminders, and history of that seed
export default function UserSeedScreen({ seed }: UserSeedScreenProps) {
  const [activeTab, setActiveTab] = useState<UserSeedTab>('Seed');

  const tasksTodayCount = useMemo(() => getPendingTodayCount(seed.tasks ?? []), [seed.tasks]);

  const handleTabPress = (tab: string) => setActiveTab(tab as UserSeedTab);

  return (
    <>
      <Tabs tabs={USER_SEED_TABS} activeTab={activeTab} onTabPress={handleTabPress} badgeCounts={{ Tasks: tasksTodayCount }} />
      <UserSeedDetails seed={seed} activeTab={activeTab} />
      <UserSeedNotes seed={seed} activeTab={activeTab} />
      <UserSeedPhotos seed={seed} activeTab={activeTab} />
      <UserSeedTasks seed={seed} activeTab={activeTab} />
    </>
  );
}
