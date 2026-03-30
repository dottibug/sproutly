import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { UserSeedTab, UserSeed, UserSeedTask } from '../../../state/barrels/typesBarrel';
import { splitTasks } from '../../../state/userSeeds/tasks/taskUtils';
import { Accordion, FABButton } from '../../../components/uiComponentBarrel';
import TaskSection from './TaskSection';
import TaskTimeline from './Timeline';

// UserSeedTasks.tsx: Renders the tasks screen for a user seed. Shows tasks for today, upcoming, and timeline. Users can add, edit, and delete tasks.

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

export default function UserSeedTasks({ seed, activeTab }: UserSeedTasksProps) {
  const router = useRouter();
  const { toggleTaskStatus, deleteTask } = useUserSeed();
  const { pending, completedToday, upcoming, timeline } = splitTasks(seed.tasks ?? []);

  const upcomingTitle = useMemo(() => {
    return `Upcoming (${upcoming.length})`;
  }, [upcoming.length]);

  // Calculate padding bottom for the FAB button
  const insets = useSafeAreaInsets();
  const paddingBottom = FAB_MARGIN * 2 + FAB_HEIGHT;

  // Toggle status between pending and completed
  const handleToggleStatus = (task: UserSeedTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    toggleTaskStatus(task, newStatus);
  };

  // Navigate to the task sheet to add a new task
  const handleNewTask = () => {
    router.push({
      pathname: '/home/taskSheet',
      params: {
        userSeedId: seed.id,
        variety: seed.variety,
        plant: seed.plant,
      },
    });
  };

  // Navigate to the task sheet to edit an existing task
  const handleEditTask = (task: UserSeedTask) => {
    router.push({
      pathname: '/home/taskSheet',
      params: {
        userSeedId: seed.id,
        taskId: task.id,
        variety: seed.variety,
        plant: seed.plant,
      },
    });
  };

  // Delete a task from UI (optimistic update) and database
  const handleDeleteTask = (task: UserSeedTask) => void deleteTask(task);

  // Shows alert to confirm deleting a task
  const showDeleteAlert = (task: UserSeedTask) => {
    Alert.alert('Delete task?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteTask(task) },
    ]);
  };

  return (
    <View style={[styles.screen, { display: activeTab === 'Tasks' ? 'flex' : 'none' }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: paddingBottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Accordion title="Today" openByDefault>
            <TaskSection
              tasks={pending}
              mode="editable"
              title="Pending"
              emptyMessage="No tasks for today."
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={showDeleteAlert}
            />
            <View style={styles.doneSection}>
              <TaskSection
                tasks={completedToday}
                mode="todayDone"
                title="Done"
                emptyMessage="No tasks completed today."
                onToggleStatus={handleToggleStatus}
                onEdit={handleEditTask}
                onDelete={showDeleteAlert}
              />
            </View>
          </Accordion>
          <Accordion title={upcomingTitle}>
            <TaskSection
              tasks={upcoming}
              mode="editable"
              showToggle={false}
              emptyMessage="No upcoming tasks."
              onEdit={handleEditTask}
              onDelete={showDeleteAlert}
            />
          </Accordion>
          <Accordion title="Timeline">
            <TaskTimeline tasks={timeline} emptyMessage="No timeline yet." />
          </Accordion>
        </View>
      </ScrollView>
      <FABButton iconName="calendar-plus" iconSize={24} accessibilityLabel="Add task" bottomInset={insets.bottom} onPress={handleNewTask} />
    </View>
  );
}

// ---- CONSTANTS ----
const FAB_MARGIN = 16;
const FAB_HEIGHT = 56;

// ---- STYLES ----
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  doneSection: {
    marginTop: 10,
  },
});
