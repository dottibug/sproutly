import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../../state/auth/AuthContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { formatMemberSince } from '../../../state/app/appUtils';
import { countDailyPendingTasks } from '../../../state/userSeeds/tasks/taskUtils';
import Logo from '../../../components/app/Logo';
import SeedsCollected from '../../../components/profile/SeedsCollected';
import NoSeedsCollected from '../../../components/profile/NoSeedsCollected';
import TasksToday from '../../../components/profile/TasksToday';
import NoTasksToday from '../../../components/profile/NoTasksToday';
import { colors, fonts } from '../../../styles/theme';

// Profile.tsx: Displays stats about the user's collection and tasks
export default function Profile() {
  const { profile } = useAuth();
  const { seeds } = useUserSeed();

  const memberSince = formatMemberSince(profile?.createdAt ?? null);
  const seedCount = seeds.length;
  const tasksDueToday = countDailyPendingTasks(seeds);

  return (
    <View style={styles.container}>
      {/* Member Since */}
      <View style={styles.memberSinceContainer}>
        <Logo size="medium" showText={false} />
        <View style={styles.memberSinceTextContainer}>
          <Text style={styles.memberSinceText}>Joined Sproutly</Text>
          <Text style={styles.memberSinceDate}>{memberSince}</Text>
        </View>
      </View>

      {/* Seeds Collected */}
      <SeedsCollected seedCount={seedCount} />
      <NoSeedsCollected />

      {/* Tasks Due Today */}
      <NoTasksToday />
      <TasksToday tasksDueToday={tasksDueToday} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  memberSinceContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 18,
  },
  memberSinceTextContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  memberSinceText: {
    color: colors.greenLight,
    fontSize: 26,
    fontWeight: 600,
    marginBottom: 4,
  },
  memberSinceDate: {
    color: colors.secondary,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 36,
  },
});
