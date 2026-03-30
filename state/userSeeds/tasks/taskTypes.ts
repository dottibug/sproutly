import { colors } from '../../../styles/theme';

// taskTypes.ts: Contains types for tasks

// ---- CONTEXT: UserSeedsContext actions related to tasks ----
export type TaskAction =
  | { type: 'ADD_TASK'; payload: UserSeedTask & { tempId: string } }
  | { type: 'SYNC_TASK_WITH_DB'; payload: UserSeedTask & { tempId: string } }
  | { type: 'UPDATE_TASK'; payload: UserSeedTask }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'RESTORE_TASK_TO_SEED'; payload: UserSeedTask }
  | {
      type: 'TOGGLE_TASK_STATUS';
      payload: { userSeedId: string; taskId: string; status: TaskStatus };
    };

// ---- USER SEED TASK ----
export type UserSeedTask = {
  id: string;
  userId: string;
  userSeedId: string;
  taskType: TaskType;
  customTaskType: string | null;
  notes: string;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

// ---- TASK INFO ----
export type TaskType = 'sow' | 'transplant' | 'fertilize' | 'harvest' | 'prune' | 'custom';
export type TaskStatus = 'pending' | 'completed';
export type TaskSectionMode = 'editable' | 'todayDone' | 'timeline' | 'upcoming';

// ---- COLOR MAP FOR TASK TYPE CHIPS ----
export const TASK_TYPE_COLOR_MAP: Record<TaskType, string> = {
  sow: colors.chocolate,
  transplant: colors.tangerine,
  fertilize: colors.coral,
  prune: colors.amethyst,
  harvest: colors.teal,
  custom: colors.blue,
};

// ---- TASK SHEET TYPES ----
// User-defined input values
export type TaskDraft = {
  userSeedId: string;
  taskType: TaskType;
  customTaskType: string | null;
  date: string;
  notes: string;
};

export type CleanTask = {
  taskType: TaskType;
  customTaskType: string | null;
  notes: string;
  date: string;
};

export const TASK_FIELDS = ['taskType', 'customTaskType', 'title', 'notes', 'date'] as const;
export type TaskFields = (typeof TASK_FIELDS)[number];
export type TaskErrors = Partial<Record<TaskFields, string>>;
