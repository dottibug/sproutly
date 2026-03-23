import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Modal, View, TextInput, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { appStyles, colors } from '../../styles/theme';
import Heading from '../ui/Heading';
import Button from '../ui/buttons/AppButton';
import { TaskType } from '../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import AppModal from '../ui/AppModal';

// TODO: Error handling if both the title and notes are blank (nothing to save)
// TODO: Text in the modal such as "Add a new task for {seed variety} {seed plant}"

// TODO: add a clear all tasks button

// TODO: Pick a nicer calendar component?

type StartTaskModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly userSeedId: string;
};

const TASK_TYPES: TaskType[] = ['sow', 'transplant', 'fertilize', 'harvest'];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function StartTaskModal({ visible, onRequestClose, userSeedId }: StartTaskModalProps) {
  const { addTask } = useUserSeed();

  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0); // noon default
    return d;
  }, []);

  const [taskType, setTaskType] = useState<TaskType>('sow');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [taskDate, setTaskDate] = useState<Date>(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSaveTask = async () => {
    const payloadDate = new Date(taskDate);
    payloadDate.setHours(12, 0, 0, 0); // noon
    const payloadTitle = title.trim() || null;
    const payloadNotes = notes.trim();

    // TODO: Error handling to go here

    // Do not await database insert
    addTask({ userSeedId, taskType, date: payloadDate.toISOString(), title: payloadTitle, notes: payloadNotes }).catch((error) =>
      console.error('Error adding task to seed:', error),
    );

    onRequestClose();
  };

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} title="New Task">
      <View style={styles.section}>
        <Heading size="xsmall">Type</Heading>
        <View style={styles.typeRow}>
          {TASK_TYPES.map((type) => {
            const selected = taskType === type;
            return (
              <Pressable key={type} onPress={() => setTaskType(type)} style={[styles.typeChip, selected && styles.typeChipSelected]}>
                <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>{type}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Heading size="xsmall">Title (optional)</Heading>
        <TextInput placeholder="Task title" value={title} onChangeText={setTitle} style={appStyles.customSeedInput} />
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Heading size="xsmall">Date</Heading>
        <Pressable style={appStyles.customSeedInput} onPress={() => setShowDatePicker(true)}>
          <Text>{formatDate(taskDate)}</Text>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(event, selected) => {
              if (Platform.OS === 'android') setShowDatePicker(false);
              if (!selected) return;
              setTaskDate(selected);
            }}
          />
        )}
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Heading size="xsmall">Notes (optional)</Heading>
        <TextInput
          placeholder="Optional details"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={appStyles.customSeedMultilineInput}
        />
      </View>

      <Button text="Save Task" size="small" onPress={handleSaveTask} />
    </AppModal>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typeChipSelected: {
    backgroundColor: colors.hunterGreen,
    borderColor: colors.hunterGreen,
  },
  typeChipText: {
    fontSize: 14,
    color: colors.gray,
    textTransform: 'capitalize',
  },
  typeChipTextSelected: {
    color: colors.white,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  pickerSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerButton: {
    color: colors.hunterGreen,
    fontSize: 16,
    fontWeight: '600',
  },
});
