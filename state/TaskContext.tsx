import { createContext, useReducer, useCallback, useMemo, useContext } from 'react';
import { TaskType, UserSeedTask } from './userSeeds/tasks/taskTypes';

/**
 * TaskContext.tsx: Handles the form state for adding or updating a task in TaskSheet.tsx
 * Follows the reducer and context pattern to manage state
 * Reference: https://react.dev/learn/scaling-up-with-reducer-and-context
 */

// ---- ACTIONS ----
type TaskAction =
  | { type: 'SET_TASK_TYPE'; payload: TaskType }
  | { type: 'SET_CUSTOM_TASK_TYPE'; payload: string | null }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'RESET_TASK'; payload: null };

// ---- INITIAL STATE SETUP ----
type TaskState = {
  task: UserSeedTask;
};

const initialState: TaskState = {
  task: {
    id: '',
    userId: '',
    userSeedId: '',
    taskType: 'sow',
    customTaskType: null,
    notes: '',
    status: 'pending',
    date: '',
    createdAt: '',
    updatedAt: '',
    completedAt: null,
  },
};

// ---- REDUCER ----
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  const { type, payload } = action;

  switch (type) {
    case 'SET_TASK_TYPE':
      return { ...state, task: { ...state.task, taskType: payload } };
    case 'SET_CUSTOM_TASK_TYPE':
      return { ...state, task: { ...state.task, customTaskType: payload } };
    case 'SET_NOTES':
      return { ...state, task: { ...state.task, notes: payload } };
    case 'SET_DATE':
      return { ...state, task: { ...state.task, date: payload } };
    case 'RESET_TASK':
      return { ...state, task: initialState.task };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type TaskContext = TaskState & {
  setTaskType: (taskType: TaskType) => void;
  setCustomTaskType: (customTaskType: string | null) => void;
  setNotes: (notes: string) => void;
  setDate: (dateISO: string) => void;
  resetTask: () => void;
};

const TaskContext = createContext<TaskContext | null>(null);

// ---- PROVIDER ----
type TaskProviderProps = { readonly children: React.ReactNode };

export function TaskProvider({ children }: TaskProviderProps) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const setTaskType = useCallback((taskType: TaskType) => dispatch({ type: 'SET_TASK_TYPE', payload: taskType }), []);

  const setCustomTaskType = useCallback(
    (customTaskType: string | null) => dispatch({ type: 'SET_CUSTOM_TASK_TYPE', payload: customTaskType }),
    [],
  );

  const setNotes = useCallback((notes: string) => dispatch({ type: 'SET_NOTES', payload: notes }), []);

  const setDate = useCallback((dateISO: string) => dispatch({ type: 'SET_DATE', payload: dateISO }), []);

  const resetTask = useCallback(() => dispatch({ type: 'RESET_TASK', payload: null }), []);

  const value = useMemo(
    () => ({ ...state, setTaskType, setCustomTaskType, setNotes, setDate, resetTask }),
    [state, setTaskType, setCustomTaskType, setNotes, setDate, resetTask],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// ---- CUSTOM HOOK ----
export function useTask() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within a TaskProvider');
  return context;
}
