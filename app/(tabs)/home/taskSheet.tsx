import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { useMemo, useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserSeed, useTask } from '../../../state/barrels/contextBarrel';
import { TaskType, TaskErrors, UserSeedTask } from '../../../state/barrels/typesBarrel';
import { startOfToday, getTaskSheetTitle } from '../../../state/barrels/utilsBarrel';
import { AppButton, Input, DatePickerSheet, Heading, ScreenOptions } from '../../../components/uiComponentBarrel';
import TaskChips from '../../../components/userSeeds/tasks/TaskChips';
import { validateTask } from '../../../components/userSeeds/tasks/validateTask';

// TaskSheet.tsx: Renders the task sheet for a user seed. Users can add a new task or edit an existing task. TaskContext.tsx manages the form state.

type TaskSheetParams = {
  userSeedId: string;
  taskId?: string;
  variety: string;
  plant: string;
};

export default function TaskSheet() {
  const router = useRouter();
  const params = useLocalSearchParams<TaskSheetParams>();
  const { userSeedId, taskId, variety, plant } = params;
  const { seeds, addTask, updateTask } = useUserSeed();
  const seed = seeds.find((s) => s.id === userSeedId);
  const isUpdate = taskId !== null && taskId !== undefined && taskId !== '';

  const taskToUpdate: UserSeedTask | undefined = isUpdate ? seed?.tasks.find((t) => t.id === taskId) : undefined;

  // State of the task form
  const { task, setTaskType, setCustomTaskType, setNotes, setDate, resetTask } = useTask();

  // Flags and error state
  const [customTaskEnabled, setCustomTaskEnabled] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<TaskErrors | null>(null);

  const dateMinimum = startOfToday();

  const dateForPicker = useMemo(() => {
    const taskDate = new Date(task.date);
    return Number.isNaN(taskDate.getTime()) ? startOfToday() : taskDate;
  }, [task.date]);

  const sheetTitle = useMemo(() => getTaskSheetTitle(isUpdate, variety, plant), [isUpdate, variety, plant]);

  // Set default values for task type, custom task type, title, notes, and date. Runs on mount and when editing the task.
  useEffect(() => {
    // Pre-fill fields when editing the task
    if (isUpdate) {
      if (!taskToUpdate) return;
      setTaskType(taskToUpdate.taskType);
      setCustomTaskType(taskToUpdate.customTaskType || null);
      setNotes(taskToUpdate.notes || '');
      setDate(taskToUpdate.date || '');
      setCustomTaskEnabled(taskToUpdate.taskType === 'custom');
      return;
    }
    resetTask(); // Clear fields when creating a new task
  }, [isUpdate, taskToUpdate, resetTask, setTaskType, setCustomTaskType, setNotes, setDate, setCustomTaskEnabled]);

  // Toggle customTaskEnabled if the task type is 'custom' or not (this enables/disables the custom task type input field)
  const onSelectTaskType = (type: TaskType) => {
    if (type === 'custom') setCustomTaskEnabled(true);
    setTaskType(type);
    if (type !== 'custom') {
      setCustomTaskType(null);
      setCustomTaskEnabled(false);
    }
  };

  const onSaveTask = async () => {
    const { isValid, errors, taskDraft } = validateTask(
      {
        taskType: task.taskType,
        customTaskType: task.customTaskType || null,
        notes: task.notes || '',
        date: task.date || '',
      },
      userSeedId,
    );

    // Creating a new task
    if (!isUpdate) {
      if (!isValid) {
        setErrors(errors);
        return;
      }
      if (taskDraft)
        addTask(taskDraft).catch((error) =>
          Alert.alert('Could not add task', 'Please try again.', [
            { text: 'OK', onPress: () => console.error('Error adding task:', error) },
          ]),
        );
    }

    // Updating an existing task
    if (isUpdate) {
      if (!taskToUpdate) return;
      if (!isValid) {
        setErrors(errors);
        return;
      }
      if (taskDraft)
        updateTask(taskToUpdate, taskDraft).catch((error) =>
          Alert.alert('Could not save changes', 'Please try again.', [
            { text: 'OK', onPress: () => console.error('Error updating task:', error) },
          ]),
        );
    }
    resetTask();
    router.back();
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <ScreenOptions backButtonMode="generic" title="Tasks" />
      <View style={styles.contentContainer}>
        <Heading size="small" customStyles={styles.sheetTitle}>
          {sheetTitle}
        </Heading>
        <View style={styles.inputs}>
          <View style={styles.inputSection}>
            <Heading size="xsmall">Select Garden Task Type</Heading>
            <TaskChips thisTaskType={task.taskType} onSelectTaskType={onSelectTaskType} />
          </View>
          <View style={styles.inputSection}>
            <Input
              label="Custom Garden Task"
              placeholder={customTaskEnabled ? CUSTOM_PLACEHOLER_EXAMPLE : CUSTOM_PLACEHOLER_SELECT}
              value={task.customTaskType || ''}
              onChangeText={setCustomTaskType}
              editable={customTaskEnabled}
              disabled={!customTaskEnabled}
              headingSize="xsmall"
              hasError={Boolean(errors?.customTaskType)}
              errorMessage={errors?.customTaskType}
              required={customTaskEnabled}
            />
          </View>
          <DatePickerSheet
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            taskDate={dateForPicker}
            setTaskDate={setDate}
            dateMinimum={dateMinimum}
          />
          <View style={styles.inputSection}>
            <Input
              label="Notes"
              headingSize="xsmall"
              placeholder="Additional task notes"
              value={task.notes || ''}
              onChangeText={setNotes}
              multiline
            />
          </View>
          <View style={styles.buttonContainer}>
            <AppButton text={isUpdate ? 'Save Changes' : 'Save Task'} size="small" rounded onPress={onSaveTask} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ---- CONSTANTS ----
const CUSTOM_PLACEHOLER_EXAMPLE = 'e.g. water, prune, weed';
const CUSTOM_PLACEHOLER_SELECT = `Tap 'custom' to enable`;

// ---- STYLES ----
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 17,
    textAlign: 'left',
  },
  contentContainer: {
    gap: 18,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  inputs: {
    gap: 18,
    marginTop: 8,
  },
  inputSection: {
    gap: 12,
  },
  buttonContainer: {
    marginVertical: 16,
  },
});
