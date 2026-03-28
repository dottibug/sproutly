import { CleanTask, TaskDraft, TaskErrors, TaskType } from '../../../state/userSeeds/tasks/taskTypes';

// validateTask.ts: Validates the task input and returns either errors or a task draft ready for database insertion

type TaskInput = {
  taskType: TaskType;
  customTaskType: string | null;
  notes: string;
  date: string;
};

type ValidResult = {
  isValid: boolean;
  errors: TaskErrors | null;
  taskDraft: TaskDraft | null;
};

// Validate task input and return either errors or a task draft ready for database insertion
export function validateTask(input: TaskInput, userSeedId: string): ValidResult {
  const errors: TaskErrors = {};

  if (input.taskType === 'custom' && !input.customTaskType) errors.customTaskType = `Custom Garden Task is required`;

  if (!isValid(errors))
    return {
      isValid: false,
      errors: errors,
      taskDraft: null,
    };

  const taskDraft = createTaskDraft(input, userSeedId);
  return {
    isValid: true,
    errors: null,
    taskDraft,
  };
}

// Check if the task has any errors
function isValid(errors: TaskErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Create a draft task object with cleaned fields (ready for database insertion)
function createTaskDraft(task: TaskInput, userSeedId: string): TaskDraft {
  const cleaned = cleanTask(task);

  return {
    userSeedId,
    taskType: cleaned.taskType,
    customTaskType: cleaned.customTaskType,
    date: cleaned.date,
    notes: cleaned.notes,
  };
}

// Clean user-defined task fields
function cleanTask(task: TaskInput): CleanTask {
  const cleanCustomTaskType = task.customTaskType?.trim() || null;
  const isoDate = task.date ? new Date(task.date).toISOString() : new Date().toISOString();

  return {
    taskType: task.taskType,
    customTaskType: cleanCustomTaskType,
    notes: task.notes.trim(),
    date: isoDate,
  };
}
