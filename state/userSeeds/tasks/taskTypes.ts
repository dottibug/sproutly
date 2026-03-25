// ---- ACTIONS ----
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
  title: string | null;
  notes: string;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

// ---- BUILD TASK INPUT ----
export type BuildTaskInput = {
  id: string;
  userId: string;
  userSeedId: string;
  taskType: TaskType;
  customTaskType: string | null;
  title: string | null;
  notes: string | null;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
};

// ---- TASK INFO ----
export type TaskType = 'sow' | 'transplant' | 'fertilize' | 'harvest' | 'prune' | 'custom';
export type TaskStatus = 'pending' | 'completed';

// ---- DRAFT (what the user types in the modal) ----
export type AddTaskDraft = {
  userSeedId: string;
  taskType: TaskType;
  customTaskType: string | null;
  date: string;
  title: string | null;
  notes: string;
};

export type TaskSectionMode = 'editable' | 'todayDone' | 'timeline';
