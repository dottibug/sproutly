import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import { TaskSectionMode, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import TaskCard from './TaskCard';

type TaskSectionProps = {
  readonly title?: string;
  readonly tasks: UserSeedTask[];
  readonly mode: TaskSectionMode;
  readonly emptyMessage?: string;
  readonly onToggleStatus?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
  readonly onEdit?: (task: UserSeedTask) => void;
};

export default function TaskSection({
  title,
  tasks,
  mode,
  emptyMessage = 'No tasks.',
  onToggleStatus,
  onDelete,
  onEdit,
}: TaskSectionProps) {
  const hasTasks = tasks.length > 0;
  const showToggle = mode !== 'timeline';
  const showEdit = mode === 'editable';

  // TODO: do we need this still?
  const showDelete = true;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!hasTasks && <Text style={styles.emptyText}>{emptyMessage}</Text>}

      {hasTasks && (
        <View style={styles.list}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showEdit={showEdit}
              showToggle={showToggle}
              showDelete={showDelete}
              onEdit={onEdit}
              onToggle={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.hunterGreen,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.secondary,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  list: {
    gap: 10,
  },
});
