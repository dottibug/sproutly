import { View, Alert, StyleSheet } from 'react-native';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeedTask } from '../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { useState } from 'react';
import { colors } from '../../styles/theme';
import StartTaskModal from './StartTaskModal';
import Accordion from '../ui/Accordion';
import { FAB as PaperFAB } from 'react-native-paper';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { isToday, splitTasks } from '../../state/userSeeds/tasks/taskUtils';
import TaskSection from './TaskSection';

// TODO: Add a clear all tasks button
// TODO: Styling & format

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_TASKS_TODAY = 'No tasks for today.';
const NO_TASKS_UPCOMING = 'No upcoming tasks.';
const NO_TIMELINE = 'No timeline yet.';

export default function UserSeedTasks({ seed, activeTab }: UserSeedTasksProps) {
  const { toggleTaskStatus, deleteTask } = useUserSeed();

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<UserSeedTask | null>(null);

  const { tasksPendingToday, tasksCompletedToday, upcomingTasks, timeline } = splitTasks(seed.tasks ?? []);

  const handleToggleStatus = (task: UserSeedTask) => {
    if (!isToday(task.date)) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    toggleTaskStatus(task, newStatus);
  };

  const handleEditTask = (task: UserSeedTask) => {
    console.log('editing task:', task);
    setEditingTask(task);
    setShowStartTaskModal(true);
  };

  const handleDeleteTask = (task: UserSeedTask) => {
    Alert.alert('Delete task?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => void deleteTask(task.id).catch((error) => console.error('Error deleting task:', error)),
      },
    ]);
  };

  return (
    <View style={[styles.screen, { display: activeTab === 'Tasks' ? 'flex' : 'none' }]}>
      <View style={styles.content}>
        {/* Today's tasks */}
        <TaskSection
          title="Pending"
          tasks={tasksPendingToday}
          mode="editable"
          emptyMessage={NO_TASKS_TODAY}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          showDueDate={false}
        />

        <TaskSection
          title="Done"
          tasks={tasksCompletedToday}
          mode="todayDone"
          emptyMessage=""
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteTask}
          onEdit={handleEditTask}
          showDueDate={true}
        />

        {/* Upcoming tasks */}
        <Accordion title={`Upcoming (${upcomingTasks.length})`}>
          <TaskSection
            tasks={upcomingTasks}
            mode="editable"
            emptyMessage={NO_TASKS_UPCOMING}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            showDueDate={true}
          />
        </Accordion>

        {/* Timeline */}
        <Accordion title="Timeline">
          <TaskSection tasks={timeline} mode="timeline" emptyMessage={NO_TIMELINE} onDelete={handleDeleteTask} showDueDate={true} />
        </Accordion>
      </View>
      <PaperFAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.hunterGreen }]}
        color={colors.white}
        onPress={() => {
          setEditingTask(null);
          setShowStartTaskModal(true);
        }}
      />
      {showStartTaskModal && (
        <StartTaskModal
          visible={showStartTaskModal}
          onRequestClose={() => {
            setShowStartTaskModal(false);
            setEditingTask(null);
          }}
          userSeedId={seed.id}
          editingTask={editingTask}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  content: {
    flex: 1,
    gap: 14,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 8,
  },
});
