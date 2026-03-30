import { View, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';
import { UserSeed, UserSeedTab, USER_SEED_TABS } from '../../state/barrels/typesBarrel';
import { getPendingTodayCount } from '../../state/userSeeds/tasks/taskUtils';
import Tabs from '../ui/Tabs';
import UserSeedDetails from './UserSeedDetails';
import UserSeedNotes from './notes/UserSeedNotes';
import UserSeedPhotos from './UserSeedPhotos';
import UserSeedTasks from './tasks/UserSeedTasks';

// UserSeedScreen.tsx: Renders the user seed screen. Shows the details of a single seed in the user's collection, with tabs for notes, photos, reminders, and history of that seed.
type UserSeedScreenProps = {
  readonly seed: UserSeed;
};

export default function UserSeedScreen({ seed }: UserSeedScreenProps) {
  const [activeTab, setActiveTab] = useState<UserSeedTab>('Seed');

  const tasksTodayCount = useMemo(() => getPendingTodayCount(seed.tasks ?? []), [seed.tasks]);

  const handleTabPress = (tab: string) => setActiveTab(tab as UserSeedTab);

  return (
    <View style={styles.container}>
      <Tabs tabs={USER_SEED_TABS} activeTab={activeTab} onTabPress={handleTabPress} badgeCounts={{ Tasks: tasksTodayCount }} />
      <UserSeedDetails seed={seed} activeTab={activeTab} />
      <UserSeedNotes seed={seed} activeTab={activeTab} />
      <UserSeedPhotos seed={seed} activeTab={activeTab} />
      <UserSeedTasks seed={seed} activeTab={activeTab} />
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 0,
  },
});
