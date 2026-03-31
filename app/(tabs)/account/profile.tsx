import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../../state/auth/AuthContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { formatMemberSince, countDailyPendingTasks } from '../../../state/barrels/utilsBarrel';
import Logo from '../../../components/app/Logo';
import SeedsCollected from '../../../components/profile/SeedsCollected';
import NoSeedsCollected from '../../../components/profile/NoSeedsCollected';
import TasksToday from '../../../components/profile/TasksToday';
import ScreenOptions from '../../../components/ui/ScreenOptions';
import NoTasksToday from '../../../components/profile/NoTasksToday';
import { colors, fonts } from '../../../styles/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Profile.tsx: Displays stats about the user's collection and tasks

export default function Profile() {
  const { profile } = useAuth();
  const { seeds } = useUserSeed();
  const memberSince = formatMemberSince(profile?.createdAt ?? null);
  const seedCount = seeds.length;
  const tasksDueToday = countDailyPendingTasks(seeds);
  const hasSeeds = seedCount > 0;
  const hasTasksDueToday = tasksDueToday > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenOptions backButtonMode="generic" title="Profile" backTitle="Back" />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Your Sproutly Stats</Text>
        <View style={styles.stats}>
          {/* Member Since — profile.createdAt from Supabase */}
          <View style={styles.memberSinceContainer}>
            <Logo size="medium" showText={false} />
            <View style={styles.memberSinceTextContainer}>
              <Text style={styles.memberSinceText}>Joined Sproutly</Text>
              <Text style={styles.memberSinceDate}>{memberSince ?? '—'}</Text>
            </View>
          </View>

          <View style={styles.seedsContainer}>{hasSeeds ? <SeedsCollected seedCount={seedCount} /> : <NoSeedsCollected />}</View>

          <View style={styles.tasksContainer}>{hasTasksDueToday ? <TasksToday tasksDueToday={tasksDueToday} /> : <NoTasksToday />}</View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 64,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    paddingBottom: 2,
    borderBottomWidth: 2,
    borderColor: colors.greenLight,
  },
  stats: {
    alignItems: 'center',
    gap: 14,
  },
  memberSinceContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
  },
  memberSinceTextContainer: {
    flexDirection: 'column',
    gap: 0,
  },
  memberSinceText: {
    color: colors.greenLight,
    fontSize: 26,
    fontWeight: 600,
  },
  memberSinceDate: {
    color: colors.secondary,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 36,
  },
  seedsContainer: {
    alignItems: 'flex-start',
    marginTop: 18,
  },
  tasksContainer: {
    alignItems: 'flex-start',
  },
});
