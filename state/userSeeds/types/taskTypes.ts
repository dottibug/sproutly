// ---- ACTIONS ----
export type TaskAction =
  | { type: 'ADD_TASK'; payload: UserSeedTask & { tempId: string } }
  | { type: 'SYNC_TASK_WITH_DB'; payload: UserSeedTask & { tempId: string } }
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
  title: string | null;
  notes: string;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
};

// ---- BUILD TASK INPUT ----
export type BuildTaskInput = {
  id: string;
  userId: string;
  userSeedId: string;
  taskType: TaskType;
  title: string | null;
  notes: string | null;
  status: TaskStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
};

// ---- TASK INFO ----
export type TaskType = 'sow' | 'transplant' | 'fertilize' | 'harvest';
export type TaskStatus = 'pending' | 'completed' | 'skipped';

// ---- DRAFT (what the user types in the modal) ----
export type AddTaskDraft = {
  userSeedId: string;
  taskType: TaskType;
  date: string;
  title: string | null;
  notes: string;
};
