import { View, Text, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/theme';
import { TaskSectionMode, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { isDueToday } from '../../../state/userSeeds/tasks/taskUtils';
import TaskCard from './TaskCard';

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

type TaskSectionProps = {
  readonly title?: string;
  readonly tasks: UserSeedTask[];
  readonly mode: TaskSectionMode;
  readonly emptyMessage?: string;
  readonly onToggleStatus?: (task: UserSeedTask) => void;
  readonly onDelete?: (task: UserSeedTask) => void;
  readonly onEdit?: (task: UserSeedTask) => void;
  // readonly showDueDate?: boolean;
};

export default function TaskSection({
  title,
  tasks,
  mode,
  emptyMessage = 'No tasks.',
  onToggleStatus,
  onDelete,
  onEdit,
  // showDueDate = true,
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
  // card: {
  //   backgroundColor: colors.white,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  //   borderRadius: 12,
  //   padding: 14,
  //   gap: 8,
  // },
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   gap: 8,
  // },
  // title: {
  //   flex: 1,
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
  // titleDone: {
  //   textDecorationLine: 'line-through',
  //   color: colors.secondary,
  // },
  // actions: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 10,
  // },
  // metaRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   gap: 8,
  // },
  // typeChip: {
  //   backgroundColor: colors.lightGray,
  //   borderRadius: 999,
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   alignSelf: 'flex-start',
  // },
  // typeChipText: {
  //   fontSize: 12,
  //   textTransform: 'capitalize',
  //   color: colors.primary,
  // },
  // metaText: {
  //   fontSize: 13,
  //   color: colors.secondary,
  // },
  metaSubtle: {
    fontSize: 12,
    color: colors.gray,
  },
  // notes: {
  //   fontSize: 14,
  //   lineHeight: 19,
  // },
});
