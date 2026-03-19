import { View, Text, Alert, Pressable, StyleSheet } from 'react-native';
import { UserSeedItem, UserSeedTask, UserSeedTab } from '../../utils/types';
import { buildTimelineFromCompletedTasks, formatDateOnly, splitTasksForAgenda } from '../../utils/taskUtils';
import { useUserSeeds } from '../../context/UserSeedsContext';
import { useState, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { colors } from '../../styles/theme';
import StartTaskModal from './StartTaskModal';
import Accordion from '../ui/Accordion';
import { FAB as PaperFAB } from 'react-native-paper';

// TODO: Add a clear all tasks button
// TODO: styling

type UserSeedTasksProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeedItem;
};

const NO_TASKS = 'No tasks yet. Add one to stay on schedule.';

type TaskSectionProps = {
  readonly tasks: UserSeedTask[];
  readonly onToggleStatus: (task: UserSeedTask) => void;
  readonly onDelete: (task: UserSeedTask) => void;
};

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
          <Text style={styles.meta}>Date: {formatDateOnly(task.date)}</Text>
          {task.notes ? <Text style={styles.notes}>{task.notes}</Text> : null}
        </View>
      ))}
    </View>
  );
}

export default function UserSeedTasks({ activeTab, seed }: UserSeedTasksProps) {
  const { toggleTaskDone, deleteTaskFromSeed } = useUserSeeds();
  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const { today, upcoming, completed } = useMemo(() => splitTasksForAgenda(seed.tasks ?? []), [seed.tasks]);
  const timeline = useMemo(() => buildTimelineFromCompletedTasks(seed.tasks ?? []), [seed.tasks]);
  const hasAnyTasks = (seed.tasks ?? []).length > 0;

  const handleDeleteTask = (task: UserSeedTask) => {
    Alert.alert('Delete task?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTaskFromSeed(task.id) },
    ]);
  };
  const handleToggleStatus = (task: UserSeedTask) => {
    toggleTaskDone(task.id, task.status === 'completed' ? 'skipped' : 'completed');
  };

  return (
    <View style={[styles.screen, { display: activeTab === 'Tasks' ? 'flex' : 'none' }]}>
      <View style={styles.scrollArea}>
        {!hasAnyTasks && <Text style={{ marginVertical: 16, textAlign: 'center' }}>{NO_TASKS}</Text>}
        <Accordion title={`Tasks (${today.length + upcoming.length + completed.length})`} openByDefault>
          <View style={{ gap: 14 }}>
            <Text style={styles.sectionTitle}>Pending Today ({today.length})</Text>
            <TaskSection tasks={today} onToggleStatus={handleToggleStatus} onDelete={handleDeleteTask} />
            <Text style={styles.sectionTitle}>Upcoming ({upcoming.length})</Text>
            <TaskSection tasks={upcoming} onToggleStatus={handleToggleStatus} onDelete={handleDeleteTask} />
            <Text style={styles.sectionTitle}>Completed ({completed.length})</Text>
            <TaskSection tasks={completed} onToggleStatus={handleToggleStatus} onDelete={handleDeleteTask} />
          </View>
        </Accordion>
        <Accordion title={`Timeline (${timeline.length})`}>
          {timeline.length === 0 ? (
            <Text style={{ marginVertical: 16, textAlign: 'center' }}>No timeline events yet.</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {timeline.map((entry) => (
                <View key={entry.id} style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.meta}>{formatDateOnly(entry.dateIso)}</Text>
                  </View>
                  <Text style={styles.title}>{entry.title}</Text>
                  {entry.subtitle ? <Text style={styles.notes}>{entry.subtitle}</Text> : null}
                </View>
              ))}
            </View>
          )}
        </Accordion>
      </View>
      <PaperFAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.hunterGreen }]}
        color={colors.white}
        onPress={() => setShowStartTaskModal(true)}
      />
      {showStartTaskModal && (
        <StartTaskModal visible={showStartTaskModal} onRequestClose={() => setShowStartTaskModal(false)} collectionId={seed.id} />
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
