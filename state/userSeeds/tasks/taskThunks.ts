import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Dispatch } from 'react';
import { UserSeedAction } from '../seeds/seedTypes';
import { UserSeedTask, TaskStatus, TaskDraft } from './taskTypes';
import { createTempId } from '../../app/appUtils';
import { getTimestamp } from '../../app/dateUtils';
import { insertTask, deleteTask, updateTaskDetails, updateTaskStatus } from './taskQueries';
import { requestReminderPermissions } from './taskUtils';

// taskThunks.ts: Thunks used to handle async operations that interact with the database, as well as optimistic state updates.

// Creates a new task in the UI and database (optimistic update)
export async function runAddTask(dispatch: Dispatch<UserSeedAction>, userId: string, draft: TaskDraft) {
  const { userSeedId, taskType, customTaskType, date, notes } = draft;

  const now = getTimestamp();
  const taskDate = new Date(date).toISOString();
  const tempId = createTempId();

  const newTask = {
    id: tempId,
    userId,
    userSeedId,
    taskType,
    customTaskType,
    notes,
    status: 'pending',
    date: taskDate,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  } as UserSeedTask;

  dispatch({ type: 'ADD_TASK', payload: { ...newTask, tempId } });

  try {
    const insertedTask = await insertTask({
      userId,
      userSeedId,
      taskType,
      date: taskDate,
      customTaskType,
      notes,
      status: 'pending',
    });

    dispatch({ type: 'SYNC_TASK_WITH_DB', payload: { ...insertedTask, tempId } });
  } catch (error) {
    dispatch({ type: 'DELETE_TASK', payload: tempId });
    throw new Error(`Error adding task to seed: ${error}`);
  }
}

// Delete a task from the UI and database (restores task to state on failure to delete from database)
export async function runDeleteTask(dispatch: Dispatch<UserSeedAction>, userId: string, task: UserSeedTask) {
  if (task.id.startsWith('temp-')) return;
  const taskToDelete = task;
  dispatch({ type: 'DELETE_TASK', payload: task.id });
  try {
    await deleteTask(userId, task.id);
  } catch (error) {
    dispatch({ type: 'RESTORE_TASK_TO_SEED', payload: taskToDelete });
    throw new Error(`Error deleting task from seed: ${error}`);
  }
}

// Update a task in the UI and database
export async function runUpdateTask(dispatch: Dispatch<UserSeedAction>, userId: string, task: UserSeedTask, draft: TaskDraft) {
  const updatedTask: UserSeedTask = {
    ...task,
    taskType: draft.taskType,
    customTaskType: draft.customTaskType,
    notes: draft.notes,
    date: draft.date, // ISO string
    updatedAt: new Date().toISOString(),
  };

  dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

  // Temp tasks don't exist in DB yet
  if (task.id.startsWith('temp-')) return;

  try {
    await updateTaskDetails(userId, updatedTask);
  } catch (error) {
    dispatch({ type: 'UPDATE_TASK', payload: task }); // Rollback to original task
    throw new Error(`Error updating task: ${error}`);
  }
}

// Toggle the status of a task in the UI and database
export async function runToggleTaskStatus(dispatch: Dispatch<UserSeedAction>, userId: string, task: UserSeedTask, newStatus: TaskStatus) {
  if (task.id.startsWith('temp-')) return;

  const prevStatus = task.status;

  const payload = {
    userSeedId: task.userSeedId,
    taskId: task.id,
    status: newStatus,
  };

  dispatch({ type: 'TOGGLE_TASK_STATUS', payload });
  try {
    await updateTaskStatus(userId, task.id, newStatus);
  } catch (error) {
    dispatch({
      type: 'TOGGLE_TASK_STATUS',
      payload: { ...payload, status: prevStatus },
    });
    throw new Error(`Error toggling task status: ${error}`);
  }
}

// Schedule a daily task notification if there are pending tasks due today
// https://docs.expo.dev/versions/latest/sdk/notifications/

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const KEY_DAILY_TASKS = 'daily-tasks';

// Get the date key for the daily tasks
function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Schedule a daily task notification if there are pending tasks due today
export async function scheduleDailyTaskNotification(pendingTodayCount: number): Promise<void> {
  if (pendingTodayCount <= 0) return;

  const now = new Date();
  const morning = new Date().setHours(9, 0, 0, 0);

  // Schedule the notification only if it's before morning trigger time
  if (now.getTime() > morning) return;

  // Check if the user has granted permission to receive notifications
  const hasPermission = await requestReminderPermissions();
  if (!hasPermission) return;

  const key = `${KEY_DAILY_TASKS}:${dateKey(now)}`;
  const existing = await AsyncStorage.getItem(key);
  if (existing) return;

  // Schedule the notification
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Garden tasks for today',
      body: `You have ${pendingTodayCount} task${pendingTodayCount === 1 ? '' : 's'} today.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: morning,
    },
  });

  // Store notification ID in AsyncStorage
  await AsyncStorage.setItem(key, id);
}
