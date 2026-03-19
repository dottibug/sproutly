import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSeedTask } from './types';

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

const DAILY_SUMMARY_KEY_PREFIX = 'daily-task-summary';

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

export function organizeTasksByCollectionId(tasks: UserSeedTask[]): Record<string, UserSeedTask[]> {
  return tasks.reduce<Record<string, UserSeedTask[]>>((acc, task) => {
    if (!acc[task.userCollectionId]) acc[task.userCollectionId] = [];
    acc[task.userCollectionId].push(task);
    return acc;
  }, {});
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function getPendingTodayCount(tasks: UserSeedTask[], now = new Date()): number {
  return tasks.filter((t) => t.status !== 'completed' && isSameLocalDay(new Date(t.date), now)).length;
}

export function splitTasksForAgenda(tasks: UserSeedTask[], now = new Date()) {
  const sorted = [...tasks].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const today = sorted.filter((r) => r.status !== 'completed' && isSameLocalDay(new Date(r.date), now));
  const upcoming = sorted.filter((r) => r.status !== 'completed' && new Date(r.date).getTime() > endOfDay(now).getTime());
  const completed = sorted.filter((r) => r.status === 'completed');

  return { today, upcoming, completed };
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getTodayMorning(hour = 8): Date {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
}

export async function requestReminderPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/**
 * Schedules ONE summary notification for today if:
 * - there are pending reminders today
 * - it's before morning trigger time
 * - one hasn't already been scheduled today
 */
export async function scheduleDailyTaskSummaryIfNeeded(pendingTodayCount: number): Promise<void> {
  if (pendingTodayCount <= 0) return;

  const now = new Date();
  const morning = getTodayMorning(8);

  // If it's already past the morning window, skip for today.
  if (now.getTime() > morning.getTime()) return;

  const hasPermission = await requestReminderPermissions();
  if (!hasPermission) return;

  const key = `${DAILY_SUMMARY_KEY_PREFIX}:${dateKey(now)}`;
  const existing = await AsyncStorage.getItem(key);
  if (existing) return;

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

  await AsyncStorage.setItem(key, id);
}

export function formatDateOnly(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export type TimelineEntry = {
  id: string;
  dateIso: string;
  title: string;
  subtitle?: string | null;
};

export function buildTimelineFromCompletedTasks(tasks: UserSeedTask[]): TimelineEntry[] {
  return tasks
    .filter((t) => t.status === 'completed')
    .map((t) => ({
      id: `task-${t.id}`,
      dateIso: t.updatedAt || t.date,
      title: t.title ?? `${t.taskType} task completed`,
      subtitle: t.notes,
    }))
    .sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime());
}
