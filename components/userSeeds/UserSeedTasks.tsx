import { View, Text, Alert, Pressable, StyleSheet } from 'react-native';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeedTask } from '../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { useState, useMemo } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { colors } from '../../styles/theme';
import StartTaskModal from './StartTaskModal';
import Accordion from '../ui/Accordion';
import { FAB as PaperFAB } from 'react-native-paper';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';

// TODO: Pending should be open by default. If there are no pending tasks, show the "No tasks yet. Add one to stay on schedule." message IN the pending section.
// TODO: Dim the done accordion and make it inactive if there are no done tasks to show? Or maybe done should be the timeline accordion? Still need a place that users can undo completing a task if they accidentally marked it completed (which doens't make sense in a timeline section, but does in a done section)
// TODO: Task editing
// TODO: Add a clear all tasks button
// TODO: Timeline
// TODO: Styling & format

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_TASKS = 'No tasks yet. Add one to stay on schedule.';

type TaskSectionProps = {
  readonly tasks: UserSeedTask[];
  readonly onToggleStatus: (task: UserSeedTask) => void;
  readonly onDelete: (task: UserSeedTask) => void;
};

// TODO: Own component
function TaskSection({ tasks, onToggleStatus, onDelete }: TaskSectionProps) {
  if (tasks.length === 0) return null;

  return (
    <View style={{ gap: 10 }}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={[styles.title, task.status === 'completed' && styles.titleDone]}>{task.title ?? `${task.taskType} task`}</Text>
            <View style={styles.actions}>
              <Pressable onPress={() => onToggleStatus(task)}>
                <MaterialCommunityIcons
                  name={task.status === 'completed' ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={24}
                  color={task.status === 'completed' ? colors.hunterGreen : colors.gray}
                />
              </Pressable>
              <Pressable onPress={() => onDelete(task)}>
                <MaterialCommunityIcons name="trash-can" size={22} color={colors.gray} />
              </Pressable>
            </View>
          </View>
          <Text style={styles.meta}>Type: {task.taskType}</Text>
          <Text style={styles.meta}>Date: {task.date}</Text>
          {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export default function UserSeedTasks({ seed, activeTab }: UserSeedTasksProps) {
  const { toggleTaskStatus, deleteTask } = useUserSeed();
  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const handleDeleteTask = (task: UserSeedTask) => {
    Alert.alert('Delete task?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
    ]);
  };
  const handleToggleStatus = (task: UserSeedTask) => {
    toggleTaskStatus(task, task.status === 'completed' ? 'skipped' : 'completed');
  };

  return (
    <View style={[styles.screen, { display: activeTab === 'Tasks' ? 'flex' : 'none' }]}>
      <View style={styles.scrollArea}>
        {seed.tasks.length === 0 && <Text style={{ marginVertical: 16, textAlign: 'center' }}>{NO_TASKS}</Text>}
        <Accordion title="Pending">
          <TaskSection
            tasks={seed.tasks.filter((task) => task.status === 'pending')}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTask}
          />
        </Accordion>
        <Accordion title="Done">
          <TaskSection
            tasks={seed.tasks.filter((task) => task.status === 'completed' || task.status === 'skipped')}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDeleteTask}
          />
        </Accordion>
      </View>
      <PaperFAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.hunterGreen }]}
        color={colors.white}
        onPress={() => setShowStartTaskModal(true)}
      />
      {showStartTaskModal && (
        <StartTaskModal visible={showStartTaskModal} onRequestClose={() => setShowStartTaskModal(false)} userSeedId={seed.id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.hunterGreen,
  },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  meta: {
    color: colors.secondary,
    fontSize: 14,
  },
  notes: {
    fontSize: 15,
    lineHeight: 20,
  },
  screen: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  scrollArea: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 8,
  },
});
