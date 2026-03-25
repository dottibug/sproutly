import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Dispatch } from 'react';
import { UserSeedAction } from '../seeds/seedTypes';
import { UserSeedTask, TaskStatus, AddTaskDraft } from './taskTypes';
import { getTimestamp, createTempId } from '../../app/appUtils';
import { insertTask, deleteTask, updateTaskDetails, updateTaskStatus } from './taskQueries';
import { buildUserSeedTask, requestReminderPermissions, taskHasSaveableText } from './taskUtils';

export async function runAddTask(dispatch: Dispatch<UserSeedAction>, userId: string, draft: AddTaskDraft) {
  if (!taskHasSaveableText(draft.title, draft.notes)) return;

  const now = getTimestamp();
  const trimTitle = draft.title?.trim() || '';
  const trimNotes = draft.notes.trim();

  const { userSeedId, taskType, customTaskType, date } = draft;
  const taskDate = new Date(date).toISOString();
  const tempId = createTempId();

  const newTask = buildUserSeedTask({
    id: tempId,
    userId,
    userSeedId,
    taskType,
    customTaskType,
    title: trimTitle,
    notes: trimNotes,
    status: 'pending',
    date: taskDate,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  });

  dispatch({ type: 'ADD_TASK', payload: { ...newTask, tempId } });

  try {
    // Database insert
    const insertedTask = await insertTask({
      userId,
      userSeedId,
      taskType,
      date: taskDate,
      customTaskType,
      title: trimTitle,
      notes: trimNotes,
      status: 'pending',
    });

    dispatch({ type: 'SYNC_TASK_WITH_DB', payload: { ...insertedTask, tempId } });
  } catch (error) {
    dispatch({ type: 'DELETE_TASK', payload: tempId });
    console.error('Error adding task to seed: ', error);
  }
}

export async function runDeleteTask(dispatch: Dispatch<UserSeedAction>, userId: string, taskId: string) {
  // Optimistic state update
  if (taskId.startsWith('temp-')) return;
  dispatch({ type: 'DELETE_TASK', payload: taskId });

  try {
    // Database delete
    await deleteTask(userId, taskId);
  } catch (error) {
    console.error('Error deleting task from seed: ', error);
  }
}

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
    // Database update
    await updateTaskStatus(userId, task.id, newStatus);
  } catch (error) {
    dispatch({
      type: 'TOGGLE_TASK_STATUS',
      payload: { ...payload, status: prevStatus },
    });
    console.error('Error toggling task status: ', error);
  }
}

export async function runUpdateTask(dispatch: Dispatch<UserSeedAction>, userId: string, task: UserSeedTask) {
  // Optimistic state update
  dispatch({ type: 'UPDATE_TASK', payload: task });

  // Temp tasks don't exist in DB yet
  if (task.id.startsWith('temp-')) return;

  try {
    await updateTaskDetails(userId, task);
  } catch (error) {
    console.error('Error updating task details: ', error);
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
