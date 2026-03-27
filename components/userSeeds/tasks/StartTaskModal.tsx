import { useState, useEffect, useMemo } from 'react';
import { Alert, View, Pressable, Text, StyleSheet } from 'react-native';
import { colors } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import AppButton from '../../ui/buttons/AppButton';
import { AddTaskDraft, TaskType, UserSeedTask } from '../../../state/userSeeds/tasks/taskTypes';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import AppModal from '../../ui/AppModal';
import { taskHasSaveableText, getNewTaskModalTitle } from '../../../state/userSeeds/tasks/taskUtils';
import Input from '../../ui/form/Input';
import DatePickerSheet from '../../ui/DatePickerSheet';
import { startOfToday, createNoonDate } from '../../../state/app/dateUtils';
import SheetModal from '../../ui/SheetModal';

// TODO: Text in the modal such as "Add a new task for {seed variety} {seed plant}"

type StartTaskModalProps = {
  readonly visible: boolean;
  readonly userSeedId: string;
  readonly editingTask?: UserSeedTask | null;
  readonly onRequestClose: () => void;
  readonly variety: string;
  readonly plant: string;
};

export default function StartTaskModal({ visible, userSeedId, editingTask = null, onRequestClose, variety, plant }: StartTaskModalProps) {
  const { addTask, updateTask } = useUserSeed();

  const defaultDate = useMemo(() => createNoonDate(), []);
  const dateMinimum = editingTask ? undefined : startOfToday();

  const [taskType, setTaskType] = useState<TaskType>('sow');
  const [customTaskType, setCustomTaskType] = useState('');
  const [customTaskEnabled, setCustomTaskEnabled] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskDate, setTaskDate] = useState<Date>(defaultDate);

  const modalTitleNewTask = useMemo(() => getNewTaskModalTitle(variety, plant), [variety, plant]);
  const modalTitle = editingTask ? EDIT_TITLE : modalTitleNewTask;

  // Effect to set the state of the modal when it is opened
  useEffect(() => {
    if (!visible) {
      setShowDatePicker(false);
      return;
    }

    if (editingTask) {
      setTaskType(editingTask.taskType);
      setCustomTaskEnabled(editingTask.taskType === 'custom');
      setCustomTaskType(editingTask.customTaskType || '');
      setTitle(editingTask.title || '');
      setNotes(editingTask.notes || '');
      setTaskDate(new Date(editingTask.date));
      return;
    }

    setCustomTaskEnabled(false);
    setTaskType('sow');
    setCustomTaskType('');
    setTitle('');
    setNotes('');
    setTaskDate(defaultDate);
  }, [visible, editingTask?.id, defaultDate]);

  const handleSelectTaskType = (type: TaskType) => {
    setTaskType(type);
    if (type === 'custom') setCustomTaskEnabled(true);
    else {
      setCustomTaskType('');
      setCustomTaskEnabled(false);
    }
  };

  const handleSaveTask = async () => {
    const date = new Date(taskDate);
    date.setHours(12, 0, 0, 0);

    const draft: AddTaskDraft = {
      userSeedId,
      taskType,
      customTaskType: taskType === 'custom' ? customTaskType.trim() || 'custom' : null,
      date: date.toISOString(),
      title: title.trim() || null,
      notes: notes.trim(),
    };

    if (!taskHasSaveableText(draft.title, draft.notes)) {
      Alert.alert(SAVE_ERROR_TITLE, SAVE_ERROR_MESSAGE);
      return;
    }

    if (editingTask) {
      void updateTask({
        ...editingTask,
        ...draft,
        updatedAt: new Date().toISOString(),
      }).catch((e) => {
        console.error('Error updating task:', e);
        Alert.alert('Could not sync yet', 'Check your connection. Your change may not be saved on the server.');
      });
    } else {
      void addTask(draft).catch((e) => {
        console.error('Error adding task to seed:', e);
        Alert.alert('Could not sync yet', 'Check your connection. This task may disappear after refresh until it syncs.');
      });
    }

    onRequestClose();
  };

  return (
    <SheetModal
      accessibilityLabel={modalTitle}
      title={modalTitle}
      open={visible}
      showTrigger={false}
      onPressTrigger={() => {}}
      onRequestClose={onRequestClose}>
      <View style={styles.contentContainer}>
        <View style={styles.inputSection}>
          <Heading size="xsmall">{TASK_TYPE_TITLE}</Heading>
          <View style={styles.taskChips}>
            {TASK_TYPES.map((type) => {
              const selected = taskType === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => handleSelectTaskType(type)}
                  style={[styles.taskChip, selected && styles.taskChipSelected]}>
                  <Text style={[styles.taskChipText, selected && styles.taskChipTextSelected]}>{type}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Input
            label={CUSTOM_TYPE_TITLE}
            placeholder={customTaskEnabled ? CUSTOM_PLACEHOLER_EXAMPLE : CUSTOM_PLACEHOLER_SELECT}
            value={customTaskType}
            onChangeText={setCustomTaskType}
            editable={customTaskEnabled}
            disabled={!customTaskEnabled}
            headingSize="xsmall"
          />
        </View>

        <View style={styles.inputSection}>
          <Input label={TASK_TITLE} headingSize="xsmall" placeholder={TASK_PLACEHOLDER} value={title} onChangeText={setTitle} />
        </View>

        <DatePickerSheet
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          taskDate={taskDate}
          setTaskDate={setTaskDate}
          dateMinimum={dateMinimum}
        />

        <View style={styles.inputSection}>
          <Input label={NOTES_TITLE} headingSize="xsmall" placeholder={NOTES_PLACEHOLDER} value={notes} onChangeText={setNotes} multiline />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton text={editingTask ? EDIT_SAVE_BUTTON : NEW_SAVE_BUTTON} size="xsmall" rounded onPress={handleSaveTask} />
        </View>
      </View>
    </SheetModal>
  );
}

// ---- CONSTANTS ----
const TASK_TYPES: TaskType[] = ['sow', 'transplant', 'fertilize', 'harvest', 'prune', 'custom'];
const EDIT_TITLE = 'Edit Task';
const TASK_TYPE_TITLE = 'Select Garden Task';
const CUSTOM_TYPE_TITLE = 'Custom Garden Task';
const CUSTOM_PLACEHOLER_EXAMPLE = 'e.g. water, prune, weed';
const CUSTOM_PLACEHOLER_SELECT = `Tap 'custom' to enable`;
const TASK_TITLE = 'Task Title';
const TASK_PLACEHOLDER = 'Name of task';
const NOTES_TITLE = 'Notes';
const NOTES_PLACEHOLDER = 'Additional task notes';
const EDIT_SAVE_BUTTON = 'Save Changes';
const NEW_SAVE_BUTTON = 'Save Task';
const SAVE_ERROR_TITLE = 'Cannot save task';
const SAVE_ERROR_MESSAGE = 'Tasks must have a title or notes.';

// ---- STYLES ----
const styles = StyleSheet.create({
  section: {
    // gap: 12,
  },
  contentContainer: {
    gap: 18,
  },
  inputSection: {
    gap: 8,
    marginTop: 2,
  },
  taskChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
  },
  taskChip: {
    backgroundColor: colors.alabaster,
    alignSelf: 'flex-start',
    borderRadius: 100,
    marginVertical: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  taskChipSelected: {
    backgroundColor: colors.greenLight,
  },
  taskChipText: {
    color: colors.opaqueBlack,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  taskChipTextSelected: {
    color: colors.white,
  },
  buttonContainer: {
    marginVertical: 16,
  },
});
