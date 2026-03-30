import { UserSeed } from '../seeds/seedTypes';
import { UserSeedTask, TaskStatus } from './taskTypes';
import { getTimestamp, isISOToday, startOfDay } from '../../app/dateUtils';
import * as Notifications from 'expo-notifications';

// taskUtils.ts: Contains utility functions for tasks

// --------------- STATE UTILS ---------------
// Create a task in the UI (optimistic update)
export function createTask(seeds: UserSeed[], payload: UserSeedTask & { tempId: string }) {
  const seedsCopy = [...seeds];
  const { userId, userSeedId, tempId, taskType, customTaskType, date, notes, status } = payload;

  const updated = seedsCopy.map((s) => {
    if (s.id !== userSeedId) return s;
    const currentTasks = s.tasks ?? [];
    const now = getTimestamp();

    const newTask = {
      id: tempId,
      userId,
      userSeedId,
      taskType,
      customTaskType,
      date,
      notes,
      status,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    } as UserSeedTask;
    return { ...s, tasks: [...currentTasks, newTask] };
  });

  return updated;
}

// Replace the optimistic task in the UI with the successful DB insert (ensures the task id is updated in the UI)
export function replaceUITask(seeds: UserSeed[], payload: UserSeedTask & { tempId: string }) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== payload.userSeedId) return s;
    const currentTasks = s.tasks ?? [];
    return {
      ...s,
      tasks: currentTasks.map((t) => (t.id === payload.tempId ? ({ ...payload } as UserSeedTask) : t)),
    };
  });
  return updated;
}

// Edit a task in the UI
export function editTask(seeds: UserSeed[], payload: UserSeedTask) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((seed) => {
    if (seed.id !== payload.userSeedId) return seed;
    const currentTasks = seed.tasks ?? [];
    return {
      ...seed,
      tasks: currentTasks.map((task) => (task.id === payload.id ? ({ ...payload } as UserSeedTask) : task)),
    };
  });
  return updated;
}

// Delete a task in the UI (optimistic update)
export function deleteByTaskId(seeds: UserSeed[], taskId: string) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    const currentTasks = s.tasks ?? [];
    return {
      ...s,
      tasks: currentTasks.filter((t) => t.id !== taskId),
    } as UserSeed;
  });
  return updated;
}

// Restore a task in the UI (if it failed to be successfully deleted in the DB)
export function restoreTask(seeds: UserSeed[], task: UserSeedTask) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== task.userSeedId) return s;
    const currentTasks = s.tasks ?? [];
    return {
      ...s,
      tasks: [...currentTasks, task],
    } as UserSeed;
  });
  return updated;
}

// Toggle the status of a task in the UI (optimistic update)
// Set task status in the UI (optimistic update + rollback)
export function applyTaskStatus(seeds: UserSeed[], payload: { userSeedId: string; taskId: string; status: TaskStatus }): UserSeed[] {
  const { userSeedId, taskId, status } = payload;
  const now = new Date().toISOString();
  const completedAt = status === 'completed' ? now : null;
  return seeds.map((seed) => {
    if (seed.id !== userSeedId) return seed;
    const currentTasks = seed.tasks ?? [];
    return {
      ...seed,
      tasks: currentTasks.map((task) => (task.id === taskId ? { ...task, status, updatedAt: now, completedAt } : task)),
    } as UserSeed;
  });
}

// --------------- COUNTING TASKS --------------
// Checks if a task is overdue or due today
function isPendingDueOnOrBeforeToday(task: UserSeedTask, now: Date): boolean {
  if (task.status !== 'pending') return false;
  const today = startOfDay(now);
  const due = startOfDay(new Date(task.date));
  return due <= today;
}

// Due date is today's calendar day (not overdue)
function isDueDateToday(taskDateIso: string, now: Date): boolean {
  return startOfDay(new Date(taskDateIso)) === startOfDay(now);
}

// Pending tasks for a single seed
export function getPendingTodayCount(tasks: UserSeedTask[], now = new Date()): number {
  return tasks.filter((task) => isPendingDueOnOrBeforeToday(task, now)).length;
}

// Pending tasks across all seeds
export function countDailyPendingTasks(seeds: UserSeed[], now = new Date()): number {
  return seeds.reduce((acc, seed) => {
    const tasks = seed.tasks ?? [];
    return acc + tasks.filter((task) => isPendingDueOnOrBeforeToday(task, now)).length;
  }, 0);
}

// --------------- NOTIFICATION PERMISSION --------------
// Request reminder permissions from the user
export async function requestReminderPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// --------------- TASK SORTING UTILS --------------
// Group tasks by userSeedId (key is userSeedId)
export function groupTasksByUserSeedId(tasks: UserSeedTask[]): Map<string, UserSeedTask[]> {
  const map = new Map<string, UserSeedTask[]>();
  tasks.forEach((task) => {
    if (!map.has(task.userSeedId)) map.set(task.userSeedId, []);
    map.get(task.userSeedId)?.push(task);
  });
  return map;
}

// Sort the timeline by completedAt date (most recent first)
function sortTimeline(timeline: UserSeedTask[]) {
  return [...timeline].sort((a, b) => {
    const aTime = new Date(a.completedAt!).getTime();
    const bTime = new Date(b.completedAt!).getTime();
    return bTime - aTime;
  });
}

// Split tasks into pending, completed today, upcoming, and timeline.
export function splitTasks(tasks: UserSeedTask[]) {
  const pending: UserSeedTask[] = [];
  const completedToday: UserSeedTask[] = [];
  const upcoming: UserSeedTask[] = [];
  const timeline: UserSeedTask[] = [];

  const now = new Date();

  tasks.forEach((task) => {
    if (task.status === 'pending') {
      if (isPendingDueOnOrBeforeToday(task, now)) pending.push(task);
      else upcoming.push(task);
      return;
    }
    if (task.status === 'completed') {
      const markedDoneToday = Boolean(task.completedAt && isISOToday(task.completedAt));
      const dueToday = isDueDateToday(task.date, now);
      if (markedDoneToday && dueToday) completedToday.push(task);
      else timeline.push(task);
    }
  });

  // Sort timeline by completedAt date (most recent first)
  const sortedTimeline = sortTimeline(timeline);
  return {
    pending,
    completedToday,
    upcoming,
    timeline: sortedTimeline,
  };
}

// --------------- TASK SHEET UTILS ---------------
// Check if the task is a user-defined custom task
export function isCustomTask(task: UserSeedTask): boolean {
  return (
    task.taskType !== 'sow' &&
    task.taskType !== 'transplant' &&
    task.taskType !== 'fertilize' &&
    task.taskType !== 'harvest' &&
    task.taskType !== 'prune'
  );
}

// Helper function to create the title for the task sheet
export function getTaskSheetTitle(isAnUpdate: boolean, variety: string, plant: string): string {
  if (isAnUpdate) return 'Edit Task';
  if (variety !== '' && plant !== '') return `Create New Task for ${variety} ${plant}`;
  else return 'Create New Task';
}
