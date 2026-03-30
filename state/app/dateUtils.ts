// dateUtils.ts: Contains date utility functions

// ---- DATE TIMESTAMPS ----
// Get the current timestamp
export function getTimestamp(): string {
  return new Date().toISOString();
}

// Get the start of today
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Get the start of the day for the given date
export function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
}

// ---- DATE COMPARISONS ----
// Check if the given date is the same day as the due date
function isDueToday(date: Date, dueDate: Date): boolean {
  return date.getFullYear() === dueDate.getFullYear() && date.getMonth() === dueDate.getMonth() && date.getDate() === dueDate.getDate();
}

// Check if the given ISO string is today
export function isISOToday(iso: string): boolean {
  return isDueToday(new Date(iso), new Date());
}

// ---- DATE FORMATTING ----

// Format the task date for display
export function formatISODate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format the task month and day
export function formatISOMonthDay(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
}

// Format the date for display (ex. Mar 23, 2026)
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// ---- DATE SORTING ----
// Sort two dates by their timestamp
export function sortByDate(a: string, b: string): number {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return bTime - aTime;
}

// Format the member since date for display (ex. Mar 23, 2026)
export function formatMemberSince(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return null;
  }
}
