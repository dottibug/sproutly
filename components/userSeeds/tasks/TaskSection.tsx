import { View, Text, StyleSheet } from 'react-native';
import { TaskSectionMode, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import TaskCard from './TaskCard';
import { colors } from '../../../styles/theme';

type TaskSectionProps = {
  readonly tasks: UserSeedTask[];
  readonly mode: TaskSectionMode;
  readonly title?: string;
  readonly showToggle?: boolean;
  readonly emptyMessage?: string;
  readonly onToggleStatus?: (task: UserSeedTask) => void;
  readonly onEdit?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
};

// TaskSection.tsx: Renders a list of tasks in a section.
export default function TaskSection({
  tasks,
  mode,
  title,
  emptyMessage = 'No tasks.',
  showToggle = true,
  onToggleStatus,
  onEdit,
  onDelete,
}: TaskSectionProps) {
  const showEdit = mode === 'editable';
  const hasTasks = tasks.length > 0;
  const hasTitle = title && title.trim() !== '';
  const paddingTop = hasTitle ? 0 : 8;

  return (
    <View style={[styles.section, { paddingTop }]}>
      {hasTitle && <Text style={styles.sectionTitle}>{title}</Text>}
      {!hasTasks && <Text style={styles.emptyText}>{emptyMessage}</Text>}

      {hasTasks && (
        <View style={styles.tasks}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showEdit={showEdit}
              showToggle={showToggle}
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

// ---- STYLES ----
const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  tasks: {
    gap: 18,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.secondary,
    fontStyle: 'italic',
    marginVertical: 8,
  },
});
