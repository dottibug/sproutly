import { TextStyle, View, StyleSheet, Text } from 'react-native';
import { UserSeedTask, TASK_TYPE_COLOR_MAP } from '../../../state/userSeeds/tasks/taskTypes';
import { isCustomTask } from '../../../state/userSeeds/tasks/taskUtils';
import { colors } from '../../../styles/theme';

type TimelineEventProps = {
  readonly task: UserSeedTask;
};

// TimelineEvent.tsx: Renders a single task event for the timeline component (Timeline.tsx)
export default function TimelineEvent({ task }: TimelineEventProps) {
  const isCustom = isCustomTask(task);
  const typeLabel = isCustom ? 'custom' : task.taskType;
  const taskLabelColor = isCustom ? TASK_TYPE_COLOR_MAP.custom : TASK_TYPE_COLOR_MAP[task.taskType];

  const notes = (task.notes ?? '').trim();
  const hasNotes = notes.length > 0;

  const noteTextStyle: TextStyle = {
    fontStyle: hasNotes ? 'normal' : 'italic',
    color: hasNotes ? colors.primary : colors.secondary,
  };

  return (
    <View style={styles.descriptionContainer}>
      <View style={[styles.taskTypeChip, { backgroundColor: taskLabelColor }]}>
        <Text style={styles.taskTypeText}>{typeLabel}</Text>
      </View>
      <View style={styles.notesContainer}>
        <Text style={[styles.notes, noteTextStyle]}>{hasNotes ? notes : 'No task notes'}</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  descriptionContainer: {
    gap: 12,
    paddingBottom: 12,
  },
  taskTypeChip: {
    alignSelf: 'flex-start',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  taskTypeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateText: {
    color: colors.secondary,
    fontSize: 12,
  },
  notesContainer: {
    gap: 8,
  },
  notes: {
    fontSize: 16,
    color: colors.secondary,
  },
});
