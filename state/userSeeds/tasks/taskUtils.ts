import { UserSeed } from '../seeds/seedTypes';
import { UserSeedTask, TaskStatus, BuildTaskInput } from './taskTypes';
import { getTimestamp } from '../../app/appUtils';
import * as Notifications from 'expo-notifications';

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

export function isSameDay(dueDate: Date): boolean {
  const now = new Date();

  return dueDate.getFullYear() === now.getFullYear() && dueDate.getMonth() === now.getMonth() && dueDate.getDate() === now.getDate();
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

// Format the task date for display
export function formatTaskDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Check if the task date is the same day as the given date
export function isDueToday(taskDate: Date, dueDate: Date): boolean {
  return (
    taskDate.getFullYear() === dueDate.getFullYear() &&
    taskDate.getMonth() === dueDate.getMonth() &&
    taskDate.getDate() === dueDate.getDate()
  );
}

// Check if the task date is today
export function isToday(iso: string): boolean {
  return isDueToday(new Date(iso), new Date());
}

// Get the number of pending tasks due today
export function getPendingTodayCount(tasks: UserSeedTask[], now = new Date()): number {
  return tasks.filter((task) => task.status !== 'completed' && isDueToday(new Date(task.date), now)).length;
}

export function splitTasks(tasks: UserSeedTask[]) {
  const tasksPendingToday: UserSeedTask[] = [];
  const tasksCompletedToday: UserSeedTask[] = [];
  const upcomingTasks: UserSeedTask[] = [];
  const timeline: UserSeedTask[] = [];

  tasks.forEach((task) => {
    // Pending tasks due today
    if (task.status === 'pending' && isToday(task.date)) tasksPendingToday.push(task);
    // Completed tasks due today
    else if (task.status === 'completed' && task.completedAt && isToday(task.completedAt)) tasksCompletedToday.push(task);
    // Pending tasks not due today
    else if (task.status === 'pending' && !isToday(task.date)) upcomingTasks.push(task);
    // Completed tasks not due today
    else if (task.status === 'completed' && task.completedAt && !isToday(task.completedAt)) timeline.push(task);
  });

  // Sort timeline by completedAt date (most recent first)
  const sortedTimeline = [...timeline].sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  return {
    tasksPendingToday,
    tasksCompletedToday,
    upcomingTasks,
    timeline: sortedTimeline,
  };
}
