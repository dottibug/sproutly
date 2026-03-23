import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/theme';
import { UserSeedTask } from '../../state/userSeeds/tasks/taskTypes';
import { isDueToday } from '../../state/userSeeds/tasks/taskUtils';

type TaskSectionMode = 'editable' | 'todayDone' | 'timeline';

const formatDueDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const formatCompletedAt = (iso: string): string =>
  new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

// const isSameLocalDay = (a: Date, b: Date): boolean =>
//   a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

type TaskSectionProps = {
  readonly title?: string;
  readonly tasks: UserSeedTask[];
  readonly mode: TaskSectionMode;
  readonly emptyMessage?: string;
  readonly onToggleStatus?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
  readonly onEdit?: (task: UserSeedTask) => void;
  readonly showDueDate?: boolean;
};

export default function TaskSection({
  title,
  tasks,
  mode,
  emptyMessage = 'No tasks.',
  onToggleStatus,
  onDelete,
  onEdit,
  showDueDate = true,
}: TaskSectionProps) {
  if (tasks.length === 0) {
    return (
      <View style={styles.section}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  const showToggle = mode !== 'timeline';
  const showEdit = mode === 'editable';

  return (
    <View style={styles.section}>
      {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

      <View style={styles.list}>
        {tasks.map((task) => {
          const completedAt = task.completedAt ? new Date(task.completedAt) : null;
          const dueDate = new Date(task.date);
          const dueDiffersFromCompleted = completedAt ? !isDueToday(dueDate, completedAt) : false;

          return (
            <View key={task.id} style={styles.card}>
              <View style={styles.row}>
                <Text style={[styles.title, task.status === 'completed' && styles.titleDone]}>{task.title?.trim() || 'Untitled task'}</Text>

                <View style={styles.actions}>
                  {showEdit && onEdit ? (
                    <Pressable onPress={() => onEdit(task)} hitSlop={6}>
                      <MaterialCommunityIcons name="pencil" size={20} color={colors.gray} />
                    </Pressable>
                  ) : null}

                  {showToggle && onToggleStatus ? (
                    <Pressable onPress={() => onToggleStatus(task)} hitSlop={6}>
                      <MaterialCommunityIcons
                        name={task.status === 'completed' ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                        size={24}
                        color={task.status === 'completed' ? colors.hunterGreen : colors.gray}
                      />
                    </Pressable>
                  ) : null}

                  {onDelete ? (
                    <Pressable onPress={() => onDelete(task)} hitSlop={6}>
                      <MaterialCommunityIcons name="trash-can" size={21} color={colors.gray} />
                    </Pressable>
                  ) : null}
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.typeChip}>
                  <Text style={styles.typeChipText}>{task.customTaskType?.trim() || task.taskType}</Text>
                </View>
                {mode === 'editable' && showDueDate ? <Text style={styles.metaText}>Due {formatDueDate(task.date)}</Text> : null}
              </View>

              {mode !== 'editable' && task.completedAt ? (
                <Text style={styles.metaText}>Completed {formatCompletedAt(task.completedAt)}</Text>
              ) : null}

              {(mode === 'todayDone' || mode === 'timeline') && dueDiffersFromCompleted && showDueDate ? (
                <Text style={styles.metaSubtle}>Due {formatDueDate(task.date)}</Text>
              ) : null}

              {task.notes?.trim() ? <Text style={styles.notes}>{task.notes}</Text> : null}
            </View>
          );
        })}
      </View>
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
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.secondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    backgroundColor: colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  typeChipText: {
    fontSize: 12,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  metaText: {
    fontSize: 13,
    color: colors.secondary,
  },
  metaSubtle: {
    fontSize: 12,
    color: colors.gray,
  },
  notes: {
    fontSize: 14,
    lineHeight: 19,
  },
});
