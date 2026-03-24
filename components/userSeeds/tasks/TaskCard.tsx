import { View, Text, StyleSheet, Pressable } from 'react-native';
import { UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/theme';
import { formatTaskDate } from '../../../state/userSeeds/tasks/taskUtils';

// TODO: make title required for tasks (use a default value if not provided)
// TODO: make show date logic clearer

type TaskCardProps = {
  readonly task: UserSeedTask;
  readonly showEdit?: boolean;
  readonly showToggle?: boolean;
  readonly showDelete?: boolean;
  readonly onEdit?: (task: UserSeedTask) => void;
  readonly onToggle?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
};

export default function TaskCard({ task, showEdit, showToggle, showDelete, onEdit, onToggle, onDelete }: TaskCardProps) {
  const titleStyle = task.status === 'completed' ? [styles.title, styles.titleDone] : styles.title;

  const taskStatusIcon = task.status === 'completed' ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline';

  const taskStatusColor = task.status === 'completed' ? colors.hunterGreen : colors.gray;

  const taskType = task.customTaskType?.trim() || task.taskType;

  const dateText = task.status === 'pending' ? `Due ${formatTaskDate(task.date)}` : `Completed ${formatTaskDate(task.completedAt ?? '')}`;

  const handleToggle = () => onToggle?.(task);
  const handleEdit = () => onEdit?.(task);
  const handleDelete = () => onDelete?.(task);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Task type chip */}
        <View style={styles.taskTypeChip}>
          <Text style={styles.taskTypeChipText}>{taskType}</Text>
        </View>

        {/* Task action buttons */}
        <View style={styles.actions}>
          {/* Edit button */}
          {showEdit && (
            <Pressable onPress={handleEdit}>
              <MaterialCommunityIcons name="pencil" size={20} color={colors.gray} />
            </Pressable>
          )}

          {/* Delete button */}
          {showDelete && (
            <Pressable onPress={handleDelete}>
              <MaterialCommunityIcons name="trash-can" size={20} color={colors.gray} />
            </Pressable>
          )}

          {/* Toggle button */}
          {showToggle && (
            <Pressable onPress={handleToggle}>
              <MaterialCommunityIcons name={taskStatusIcon} size={24} color={taskStatusColor} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Task info */}
      <View style={styles.info}>
        <Text style={titleStyle}>{task.title}</Text>

        {/* Task notes */}
        <Text style={styles.notes}>{task.notes?.trim()}</Text>

        {/* Task date text */}
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taskTypeChip: {
    backgroundColor: colors.lightGray,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  taskTypeChipText: {
    fontSize: 12,
    textTransform: 'capitalize',
    color: colors.primary,
  },
  info: {
    flexDirection: 'column',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.secondary,
  },
  dateText: {
    fontSize: 13,
    color: colors.secondary,
  },
  notes: {
    fontSize: 14,
  },
});
