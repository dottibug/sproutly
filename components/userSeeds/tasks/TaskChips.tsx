import { Pressable, Text, StyleSheet, View } from 'react-native';
import { TaskType } from '../../../state/userSeeds/tasks/taskTypes';
import { colors } from '../../../styles/theme';

type TaskChipsProps = {
  readonly thisTaskType: TaskType;
  readonly onSelectTaskType: (type: TaskType) => void;
};

// TaskChips.tsx: Renders a list of task types as chips.
export default function TaskChips({ thisTaskType, onSelectTaskType }: TaskChipsProps) {
  return (
    <View style={styles.taskChips}>
      {TASK_TYPES.map((type) => {
        const selected = thisTaskType === type;
        return (
          <Pressable key={type} onPress={() => onSelectTaskType(type)} style={[styles.taskChip, selected && styles.taskChipSelected]}>
            <Text style={[styles.taskChipText, selected && styles.taskChipTextSelected]}>{type}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---- CONSTANTS ----
const TASK_TYPES: TaskType[] = ['sow', 'transplant', 'fertilize', 'harvest', 'prune', 'custom'];

// ---- STYLES ----
const styles = StyleSheet.create({
  taskChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
  },
  taskChip: {
    backgroundColor: colors.gray200,
    alignSelf: 'flex-start',
    borderRadius: 100,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.10)',
  },
  taskChipSelected: {
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.greenLight,
  },
  taskChipText: {
    color: colors.blackSheer55,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  taskChipTextSelected: {
    color: colors.white,
  },
});
