import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { UserSeedTask, TASK_TYPE_COLOR_MAP } from '../../../state/userSeeds/tasks/taskTypes';
import { isCustomTask } from '../../../state/userSeeds/tasks/taskUtils';
import { formatISODate } from '../../../state/app/dateUtils';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Heading from '../../ui/Heading';
import { colors } from '../../../styles/theme';

type TaskCardProps = {
  readonly task: UserSeedTask;
  readonly showToggle?: boolean;
  readonly showEdit?: boolean;
  readonly onEdit?: (task: UserSeedTask) => void;
  readonly onToggle?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
};

// TaskCard.tsx: Renders a single task card.
export default function TaskCard({ task, showToggle, showEdit, onEdit, onToggle, onDelete }: TaskCardProps) {
  const isCustom = isCustomTask(task);
  const taskType = task.customTaskType?.trim() || task.taskType;

  const taskLabelColor = isCustom ? TASK_TYPE_COLOR_MAP.custom : TASK_TYPE_COLOR_MAP[task.taskType];

  const taskStatusIcon = task.status === 'completed' ? 'checkbox-marked' : 'checkbox-blank-outline';

  const taskTitle =
    task.status === 'completed' ? (
      <Heading size="xsmall" customStyles={styles.taskDone}>
        {task.title}
      </Heading>
    ) : (
      <Heading size="xsmall">{task.title}</Heading>
    );

  const hasNotes = Boolean(task.notes?.trim());

  const dateText = task.status === 'pending' ? `Due ${formatISODate(task.date)}` : `Completed ${formatISODate(task.completedAt ?? '')}`;

  const handleToggle = () => onToggle?.(task);
  const handleEdit = () => onEdit?.(task);
  const handleDelete = () => onDelete?.(task);

  return (
    <View style={styles.card}>
      <View style={styles.toggle}>
        {showToggle && (
          <Pressable onPress={handleToggle}>
            <MaterialCommunityIcons name={taskStatusIcon} size={31} color={taskLabelColor} />
          </Pressable>
        )}
      </View>

      <View style={[styles.taskTypeChip, { backgroundColor: taskLabelColor }]}>
        <Text style={styles.taskTypeText}>{taskType}</Text>
      </View>

      <View style={styles.info}>
        {taskTitle}
        {hasNotes && <Text style={styles.notes}>{task.notes?.trim()}</Text>}
      </View>

      <View style={styles.cardBottomRow}>
        <View style={styles.actionButtons}>
          {showEdit && (
            <Pressable onPress={handleEdit} style={styles.actionButton}>
              <FontAwesome6 name="pencil" size={18} color={colors.secondary} />
            </Pressable>
          )}
          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <FontAwesome6 name="trash-can" size={18} color={colors.secondary} />
          </Pressable>
        </View>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.13,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toggle: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  taskTypeChip: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  taskTypeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  info: {
    flexDirection: 'column',
    gap: 8,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    textDecorationColor: colors.opaqueBlack45,
  },
  notes: {
    fontSize: 15,
  },
  cardBottomRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.alabaster,
    borderRadius: 100,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: colors.secondary,
  },
});
