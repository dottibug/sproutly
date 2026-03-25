import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState, useEffect } from 'react';
import { Alert, View, TextInput, Pressable, Text, StyleSheet, Platform, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { appStyles, colors } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import Button from '../../ui/buttons/AppButton';
import { TaskType, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import AppModal from '../../ui/AppModal';
import { taskHasSaveableText } from '../../../state/userSeeds/tasks/taskUtils';
import Input from '../../ui/form/Input';

// TODO: Text in the modal such as "Add a new task for {seed variety} {seed plant}"

// TODO: add a clear all tasks button

type StartTaskModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly userSeedId: string;
  readonly editingTask?: UserSeedTask | null;
};

const TASK_TYPES: TaskType[] = ['sow', 'transplant', 'fertilize', 'harvest', 'prune', 'custom'];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

export default function StartTaskModal({ visible, onRequestClose, userSeedId, editingTask = null }: StartTaskModalProps) {
  const { addTask, updateTask } = useUserSeed();
  const insets = useSafeAreaInsets();

  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0); // noon default
    return d;
  }, []);

  const [taskType, setTaskType] = useState<TaskType>('sow');
  const [customTaskType, setCustomTaskType] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [taskDate, setTaskDate] = useState<Date>(defaultDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (editingTask) {
      setTaskType(editingTask.taskType);
      setCustomTaskType(editingTask.customTaskType || '');
      setTitle(editingTask.title || '');
      setNotes(editingTask.notes || '');
      setTaskDate(new Date(editingTask.date));
      return;
    }

    setTaskType('sow');
    setCustomTaskType('');
    setTitle('');
    setNotes('');
    setTaskDate(defaultDate);
  }, [visible, editingTask, defaultDate]);

  useEffect(() => {
    if (!visible) setShowDatePicker(false);
  }, [visible]);

  const dateMinimum = editingTask ? undefined : startOfToday();

  const customTypeEnabled = taskType === 'custom';

  const handleSaveTask = async () => {
    const payloadDate = new Date(taskDate);
    payloadDate.setHours(12, 0, 0, 0); // noon
    const payloadTitle = title.trim() || null;
    const payloadNotes = notes.trim();
    const payloadCustomTaskType = customTypeEnabled ? customTaskType.trim() || null : null;

    if (!taskHasSaveableText(payloadTitle, payloadNotes)) {
      Alert.alert('Cannot save', 'Enter a title or notes (at least one).');
      return;
    }

    // Do not await database insert/update
    if (editingTask) {
      updateTask({
        ...editingTask,
        taskType,
        customTaskType: payloadCustomTaskType,
        date: payloadDate.toISOString(),
        title: payloadTitle,
        notes: payloadNotes,
        updatedAt: new Date().toISOString(),
      }).catch((error) => console.error('Error updating task:', error));
    } else {
      addTask({
        userSeedId,
        taskType,
        customTaskType: payloadCustomTaskType,
        date: payloadDate.toISOString(),
        title: payloadTitle,
        notes: payloadNotes,
      }).catch((error) => console.error('Error adding task to seed:', error));
    }

    onRequestClose();
  };

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} title={editingTask ? 'Edit Task' : 'New Task'}>
      <View style={styles.section}>
        <Heading size="xsmall">Type</Heading>
        <View style={styles.typeRow}>
          {TASK_TYPES.map((type) => {
            const selected = taskType === type;
            return (
              <Pressable
                key={type}
                onPress={() => {
                  setTaskType(type);
                  if (type !== 'custom') setCustomTaskType('');
                }}
                style={[styles.typeChip, selected && styles.typeChipSelected]}>
                <Text style={[styles.typeChipText, selected && styles.typeChipTextSelected]}>{type}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Input
          label="Custom Type"
          placeholder={customTypeEnabled ? 'e.g. water, prune, weed' : 'Select "custom" above'}
          value={customTaskType}
          onChangeText={setCustomTaskType}
          editable={customTypeEnabled}
          readOnly={!customTypeEnabled}
        />
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Heading size="xsmall">Title (optional)</Heading>
        <Input label="Title" placeholder="Task title" value={title} onChangeText={setTitle} />
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Heading size="xsmall">Date</Heading>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Choose task date"
          style={styles.dateInputRow}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateInputText}>{formatDate(taskDate)}</Text>
          <Ionicons name="calendar-outline" size={22} color={colors.gray} />
        </Pressable>

        {Platform.OS === 'android' && showDatePicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display="default"
            minimumDate={dateMinimum}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setTaskDate(selected);
            }}
          />
        )}

        {Platform.OS === 'ios' && (
          <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
            <View style={styles.pickerBackdrop}>
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => setShowDatePicker(false)}
                accessibilityLabel="Dismiss date picker"
              />
              <View style={[styles.pickerSheet, { paddingBottom: Math.max(16, insets.bottom) }]}>
                <View style={styles.pickerHeader}>
                  <Text style={styles.pickerTitle}>Choose date</Text>
                  <Pressable onPress={() => setShowDatePicker(false)} hitSlop={12}>
                    <Text style={styles.headerButton}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={taskDate}
                  mode="date"
                  display="inline"
                  minimumDate={dateMinimum}
                  themeVariant="light"
                  onChange={(_, selected) => {
                    if (selected) setTaskDate(selected);
                  }}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>

      <View style={appStyles.customSeedInputSection}>
        <Input label="Notes" placeholder="Optional details" value={notes} onChangeText={setNotes} multiline />
      </View>

      <Button text={editingTask ? 'Save Changes' : 'Save Task'} size="small" onPress={handleSaveTask} />
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
  customTypeInputDisabled: {
    opacity: 0.55,
    backgroundColor: colors.lightGray,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInputRow: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 9,
    fontSize: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  dateInputText: {
    fontSize: 16,
    color: colors.primary,
    flex: 1,
  },
  pickerBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingHorizontal: 12,
    maxHeight: '72%',
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
