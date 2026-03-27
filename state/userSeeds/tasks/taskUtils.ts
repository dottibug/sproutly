import { UserSeed } from '../seeds/seedTypes';
import { UserSeedTask, TaskStatus, BuildTaskInput } from './taskTypes';
import { getTimestamp, isSameDay, isDueToday, isISOToday, startOfDay } from '../../app/dateUtils';
import * as Notifications from 'expo-notifications';

/** Title and notes cannot both be empty — same idea as notes (need at least one). Applies to all task types including custom. */
export function taskHasSaveableText(title: string | null | undefined, notes: string | null | undefined): boolean {
  const titleTrim = title?.trim() ?? '';
  const notesTrim = notes?.trim() ?? '';
  return Boolean(titleTrim || notesTrim);
}

export function buildUserSeedTask(input: BuildTaskInput): UserSeedTask {
  return {
    id: input.id,
    userId: input.userId,
    userSeedId: input.userSeedId,
    taskType: input.taskType,
    customTaskType: input.customTaskType,
    title: input.title,
    notes: input.notes,
    status: input.status,
    date: input.date,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    completedAt: input.completedAt,
  } as UserSeedTask;
}

// Create a task in the UI (optimistic update)
export function createTask(seeds: UserSeed[], payload: UserSeedTask & { tempId: string }) {
  const seedsCopy = [...seeds];

  const { userId, userSeedId, tempId, taskType, customTaskType, date, title, notes, status } = payload;

  const updated = seedsCopy.map((s) => {
    if (s.id !== userSeedId) return s;

    const currentTasks = s.tasks ?? [];
    const now = getTimestamp();

    const newTask = buildUserSeedTask({
      id: tempId,
      userId,
      userSeedId,
      taskType,
      customTaskType,
      date,
      title,
      notes,
      status,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    });

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

export function countDailyPendingTasks(seeds: UserSeed[]): number {
  const numTasks = seeds.reduce((acc, seed) => {
    const tasks = seed.tasks ?? [];

    const pendingTasks = tasks.filter((task) => task.status === 'pending' && isSameDay(new Date(task.date)));

    return acc + pendingTasks.length;
  }, 0);

  return numTasks;
}

// Group tasks by userSeedId (key is userSeedId)
export function groupTasksByUserSeedId(tasks: UserSeedTask[]): Map<string, UserSeedTask[]> {
  const map = new Map<string, UserSeedTask[]>();

  tasks.forEach((task) => {
    if (!map.has(task.userSeedId)) map.set(task.userSeedId, []);
    map.get(task.userSeedId)?.push(task);
  });

  return map;
}

// Request reminder permissions from the user
export async function requestReminderPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Get the number of pending tasks due today
export function getPendingTodayCount(tasks: UserSeedTask[], now = new Date()): number {
  return tasks.filter((task) => task.status !== 'completed' && isDueToday(new Date(task.date), now)).length;
}

// Sort the timeline by completedAt date (most recent first)
function sortTimeline(timeline: UserSeedTask[]) {
  return [...timeline].sort((a, b) => {
    const aTime = new Date(a.completedAt!).getTime();
    const bTime = new Date(b.completedAt!).getTime();
    return bTime - aTime;
  });
}

export function splitTasks(tasks: UserSeedTask[]) {
  const pending: UserSeedTask[] = [];
  const completedToday: UserSeedTask[] = [];
  const upcoming: UserSeedTask[] = [];
  const timeline: UserSeedTask[] = [];

  const today = startOfDay(new Date());

  tasks.forEach((task) => {
    const due = startOfDay(new Date(task.date));

    if (task.status === 'pending') {
      if (due > today) upcoming.push(task);
      else pending.push(task);
      return;
    }

    if (task.status === 'completed') {
      if (task.completedAt && isISOToday(task.completedAt)) completedToday.push(task);
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

// Get the title for the new task modal
export function getNewTaskModalTitle(variety: string, plant: string) {
  if (variety !== '' && plant !== '') return `Create New Task for ${variety} ${plant}`;
  else return 'Create New Task';
}
