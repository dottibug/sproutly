import { View, Alert, StyleSheet, ScrollView } from 'react-native';
import { UserSeedTab } from '../../../state/app/appTypes';
import { UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { useState } from 'react';
import StartTaskModal from './StartTaskModal';
import TaskTimeline from './Timeline';
import Accordion from '../../ui/Accordion';
import { FAB as PaperFAB } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import { splitTasks } from '../../../state/userSeeds/tasks/taskUtils';
import TaskSection from './TaskSection';
import { colors } from '../../../styles/theme';
// TODO: Add a clear all tasks button
// TODO: Styling & format

function tasksFabIcon({ size, color }: { size: number; color: string }) {
  return <FontAwesome5 name="calendar-plus" size={size} color={color} solid />;
}

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_TASKS_PENDING = 'No tasks for today.';
const NO_TASKS_DONE = 'No tasks completed today.';
const NO_TASKS_UPCOMING = 'No upcoming tasks.';
const NO_TIMELINE = 'No timeline yet.';

const FAB_BOTTOM_GAP = 16;

export default function UserSeedTasks({ seed, activeTab }: UserSeedTasksProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { toggleTaskStatus, deleteTask } = useUserSeed();

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<UserSeedTask | null>(null);

  const { pending, completedToday, upcoming, timeline } = splitTasks(seed.tasks ?? []);

  const handleToggleStatus = (task: UserSeedTask) => {
    console.log('handleToggleStatus called');
    console.log('do we get here');

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
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: FAB_BOTTOM_GAP + 56 + tabBarHeight + insets.bottom + 16 },
        ]}
      >
        <View style={styles.content}>
          <Accordion title="Today" openByDefault>
            {/* Pending tasks */}
            <TaskSection
              title="Pending"
              tasks={pending}
              mode="editable"
              emptyMessage={NO_TASKS_PENDING}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              // showDueDate={false}
            />

            {/* Completed today */}
            <TaskSection
              title="Done"
              tasks={completedToday}
              mode="todayDone"
              emptyMessage={NO_TASKS_DONE}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              // showDueDate={true}
            />
          </Accordion>

          {/* Upcoming tasks */}
          <Accordion title={`Upcoming (${upcoming.length})`}>
            <TaskSection
              tasks={upcoming}
              mode="editable"
              emptyMessage={NO_TASKS_UPCOMING}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              // showDueDate={true}
            />
          </Accordion>

          {/* Timeline */}
          <Accordion title="Timeline">
            {/* <TaskSection tasks={timeline} mode="timeline" emptyMessage={NO_TIMELINE} onDelete={handleDeleteTask} /> */}
            <TaskTimeline tasks={timeline} emptyMessage={NO_TIMELINE} />
          </Accordion>
        </View>
      </ScrollView>

      <PaperFAB
        accessibilityLabel="Add task"
        icon={tasksFabIcon}
        style={[
          styles.fab,
          {
            backgroundColor: colors.hunterGreen,
            bottom: FAB_BOTTOM_GAP + tabBarHeight + insets.bottom,
            right: FAB_BOTTOM_GAP,
          },
        ]}
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
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  content: {
    flex: 1,
    gap: 14,
  },
  fab: {
    position: 'absolute',
  },
});
