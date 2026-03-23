import { createContext, useReducer, useCallback, useMemo, useEffect, useContext } from 'react';
import { userSeedReducer } from './reducer';
import { UserSeedState, UserSeedContextValue, UserSeed } from './seeds/seedTypes';
import { BrowseSeed } from '../browseSeeds/browseTypes';
import { CustomSeedPayload } from '../customSeedForm/customSeedTypes';
import { ImagePreview, AddPhotoDraft } from './photos/photoTypes';
import { UserSeedNote, AddNoteDraft } from './notes/noteTypes';
import { UserSeedTask, TaskStatus, AddTaskDraft } from './tasks/taskTypes';
import { useAuth } from '../app/AuthContext';
import { runLoadUserSeeds, runAddSeedFromBrowse, runAddCustomSeed, runDeleteByCatalogId, runDeleteByCustomId } from './seeds/seedThunks';
import { runAddNote, runUpdateNote, runDeleteNote } from './notes/noteThunks';
import { runAddPhoto, runDeletePhoto } from './photos/photoThunks';
import { runAddTask, runDeleteTask, runToggleTaskStatus, scheduleDailyTaskNotification } from './tasks/taskThunks';
import { countDailyPendingTasks } from './tasks/taskUtils';

// TODO: Handle errors

// UserSeedsContext.tsx follows the React context & reducer pattern to manage state for the user's seeds.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

const initialState: UserSeedState = {
  seeds: [],
  loading: false,
  error: null,
};

const UserSeedContext = createContext<UserSeedContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type UserSeedProviderProps = {
  readonly children: React.ReactNode;
};

export function UserSeedProvider({ children }: UserSeedProviderProps) {
  const [state, dispatch] = useReducer(userSeedReducer, initialState);
  const { profile } = useAuth();
  const userId = profile?.id ?? null;

  const loadUserSeeds = useCallback(async () => {
    if (!userId) return;
    await runLoadUserSeeds(dispatch, userId);
  }, [dispatch, userId]);

  useEffect(() => {
    if (!userId) {
      dispatch({ type: 'LOAD_SUCCESS', payload: [] });
      return;
    }
    loadUserSeeds();
  }, [userId, loadUserSeeds]);

  useEffect(() => {
    if (!userId) return;
    const pendingTodayCount = countDailyPendingTasks(state.seeds);
    scheduleDailyTaskNotification(pendingTodayCount).catch((err) => {
      console.error('Failed to schedule daily task summary:', err);
    });
  }, [userId, state.seeds]);

  const addSeedFromBrowse = useCallback(
    async (browseSeed: BrowseSeed) => {
      if (!userId) return;
      await runAddSeedFromBrowse(dispatch, userId, state.seeds, browseSeed);
    },
    [dispatch, userId, state.seeds],
  );

  const addCustomSeed = useCallback(
    async (preview: ImagePreview | null, payload: CustomSeedPayload) => {
      if (!userId) return;
      console.log('addCustomSeed called in UserSeedsContext.tsx');
      await runAddCustomSeed(dispatch, userId, payload, preview);
    },
    [dispatch, userId],
  );

  const deleteByCatalogId = useCallback(
    async (seed: UserSeed) => {
      if (!userId) return;
      await runDeleteByCatalogId(dispatch, userId, seed.catalogSeedId);
    },
    [dispatch, userId],
  );

  const deleteByCustomId = useCallback(async (seed: UserSeed) => await runDeleteByCustomId(dispatch, seed.customSeedId), [dispatch]);

  const addNote = useCallback(
    async (draft: AddNoteDraft) => {
      if (!userId) return;
      await runAddNote(dispatch, userId, draft);
    },
    [dispatch, userId],
  );

  const updateNote = useCallback(async (payload: UserSeedNote) => await runUpdateNote(dispatch, payload), [dispatch, userId]);

  const deleteNote = useCallback(
    async (noteId: string) => {
      if (!userId) return;
      await runDeleteNote(dispatch, userId, noteId);
    },
    [dispatch, userId],
  );

  const addPhoto = useCallback(
    async (draft: AddPhotoDraft) => {
      if (!userId) return;
      await runAddPhoto(dispatch, userId, draft);
    },
    [dispatch, userId],
  );

  const deletePhoto = useCallback(
    async (photoId: string) => {
      if (!userId) return;
      await runDeletePhoto(dispatch, userId, photoId);
    },
    [dispatch, userId],
  );

  const addTask = useCallback(
    async (draft: AddTaskDraft) => {
      if (!userId) return;
      await runAddTask(dispatch, userId, draft);
    },
    [dispatch, userId],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!userId) return;
      await runDeleteTask(dispatch, userId, taskId);
    },
    [dispatch, userId],
  );

  const toggleTaskStatus = useCallback(
    async (task: UserSeedTask, newStatus: TaskStatus) => {
      if (!userId) return;
      await runToggleTaskStatus(dispatch, userId, task, newStatus);
    },
    [dispatch, userId],
  );

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      addSeedFromBrowse,
      addCustomSeed,
      deleteByCatalogId,
      deleteByCustomId,
      addNote,
      updateNote,
      deleteNote,
      addPhoto,
      deletePhoto,
      addTask,
      toggleTaskStatus,
      deleteTask,
    }),
    [
      state.seeds,
      state.loading,
      state.error,
      addSeedFromBrowse,
      addCustomSeed,
      deleteByCatalogId,
      deleteByCustomId,
      addNote,
      updateNote,
      deleteNote,
      addPhoto,
      deletePhoto,
      addTask,
      toggleTaskStatus,
      deleteTask,
    ],
  );

  return <UserSeedContext.Provider value={value}>{children}</UserSeedContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useUserSeed() {
  const context = useContext(UserSeedContext);
  if (!context) throw new Error('useUserSeed must be used within a UserSeedProvider');
  return context;
}
