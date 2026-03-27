import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { UserSeedTab } from '../../../state/app/appTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import { UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { splitTasks } from '../../../state/userSeeds/tasks/taskUtils';
import Accordion from '../../ui/Accordion';
import FABButton from '../../ui/buttons/FABButton';
import AlertDialog from '../../ui/AlertDialog';
import TaskSection from './TaskSection';
import TaskTimeline from './Timeline';
import StartTaskModal from './StartTaskModal';

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

// UserSeedTasks.tsx: Renders the tasks screen for a user seed. Shows tasks for today, upcoming, and timeline. Users can add, edit, and delete tasks.
export default function UserSeedTasks({ seed, activeTab }: UserSeedTasksProps) {
  const { toggleTaskStatus, deleteTask } = useUserSeed();

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<UserSeedTask | null>(null);

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

  // Shows form in a modal to add a new task
  const handleNewTask = () => {
    setEditingTask(null);
    setShowStartTaskModal(true);
  };

  // Shows form in a modal to edit an existing task
  const handleEditTask = (task: UserSeedTask) => {
    setEditingTask(task);
    setShowStartTaskModal(true);
  };

  // Delete a task from UI (optimistic update) and database
  const handleDeleteTask = (task: UserSeedTask) => void deleteTask(task.id);

  // Close the modal for adding or editing a task
  const handleClose = () => {
    setShowStartTaskModal(false);
    setEditingTask(null);
  };

  // Shows alert to confirm deleting a task
  const showDeleteAlert = (task: UserSeedTask) => {
    AlertDialog({
      title: ALERT_TITLE,
      message: ALERT_MESSAGE,
      onPress: () => handleDeleteTask(task),
    });
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
              emptyMessage={NO_TASKS_PENDING}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={showDeleteAlert}
            />

            <View style={styles.doneSection}>
              <TaskSection
                tasks={completedToday}
                mode="todayDone"
                title="Done"
                emptyMessage={NO_TASKS_DONE}
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
              emptyMessage={NO_TASKS_UPCOMING}
              onEdit={handleEditTask}
              onDelete={showDeleteAlert}
            />
          </Accordion>

          <Accordion title="Timeline">
            <TaskTimeline tasks={timeline} emptyMessage={NO_TIMELINE} />
          </Accordion>
        </View>
      </ScrollView>

      <FABButton iconName="calendar-plus" iconSize={24} accessibilityLabel="Add task" bottomInset={insets.bottom} onPress={handleNewTask} />

      {showStartTaskModal && (
        <StartTaskModal
          visible={showStartTaskModal}
          userSeedId={seed.id}
          editingTask={editingTask}
          onRequestClose={handleClose}
          variety={seed.variety}
          plant={seed.plant}
        />
      )}
    </View>
  );
}

// ---- CONSTANTS ----
const NO_TASKS_PENDING = 'No tasks for today.';
const NO_TASKS_DONE = 'No tasks completed today.';
const NO_TASKS_UPCOMING = 'No upcoming tasks.';
const NO_TIMELINE = 'No timeline yet.';
const ALERT_TITLE = 'Delete task?';
const ALERT_MESSAGE = 'This cannot be undone.';
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
