import { UserSeedState, UserSeedAction } from './seeds/seedTypes';
import { createUserSeedFromBrowse } from '../browseSeeds/browseUtils';
import { filterByCatalogId, replaceUISeed, applySeedFavorite } from './seeds/seedUtils';
import { filterByCustomId } from '../customSeed/customSeedUtils';
import { createNote, editNote, replaceUINote, deleteByNoteId, restoreNote } from './notes/noteUtils';
import { createPhoto, replaceUIPhoto, deleteByPhotoId, restorePhoto } from './photos/photoUtils';
import { createTask, editTask, deleteByTaskId, replaceUITask, restoreTask, applyTaskStatus } from './tasks/taskUtils';

// reducer.tsx: Contains the reducer for UserSeedsContext.tsx

// ---- REDUCER ----
export function userSeedReducer(state: UserSeedState, action: UserSeedAction): UserSeedState {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };

    case 'LOAD_SUCCESS':
      return { ...state, seeds: payload, loading: false, error: null };

    case 'LOAD_ERROR':
      return { ...state, loading: false, error: payload };

    case 'ADD_SEED_FROM_BROWSE':
      return { ...state, seeds: [...state.seeds, createUserSeedFromBrowse(payload)] };

    case 'ADD_CUSTOM_SEED':
      return { ...state, seeds: [payload, ...state.seeds] };

    case 'SYNC_CUSTOM_SEED_WITH_DB':
      return { ...state, seeds: replaceUISeed(state.seeds, payload) };

    case 'DELETE_BY_CATALOG_ID':
      return { ...state, seeds: filterByCatalogId(state.seeds, payload ?? '') };

    case 'DELETE_BY_CUSTOM_ID':
      return { ...state, seeds: filterByCustomId(state.seeds, payload ?? '') };

    case 'SET_SEED_FAVORITE':
      return { ...state, seeds: applySeedFavorite(state.seeds, payload) };

    case 'ADD_NOTE':
      return { ...state, seeds: createNote(state.seeds, payload) };

    case 'UPDATE_NOTE':
      return { ...state, seeds: editNote(state.seeds, payload) };

    case 'SYNC_NOTE_WITH_DB':
      return { ...state, seeds: replaceUINote(state.seeds, payload) };

    case 'DELETE_NOTE':
      return { ...state, seeds: deleteByNoteId(state.seeds, payload) };

    case 'RESTORE_NOTE_TO_SEED':
      return { ...state, seeds: restoreNote(state.seeds, payload) };

    case 'ADD_PHOTO':
      return { ...state, seeds: createPhoto(state.seeds, payload) };

    case 'SYNC_PHOTO_WITH_DB':
      return { ...state, seeds: replaceUIPhoto(state.seeds, payload) };

    case 'DELETE_PHOTO':
      return { ...state, seeds: deleteByPhotoId(state.seeds, payload) };

    case 'RESTORE_PHOTO_TO_SEED':
      return { ...state, seeds: restorePhoto(state.seeds, payload) };

    case 'ADD_TASK':
      return { ...state, seeds: createTask(state.seeds, payload) };

    case 'SYNC_TASK_WITH_DB':
      return { ...state, seeds: replaceUITask(state.seeds, payload) };

    case 'UPDATE_TASK':
      return { ...state, seeds: editTask(state.seeds, payload) };

    case 'DELETE_TASK':
      return { ...state, seeds: deleteByTaskId(state.seeds, payload) };

    case 'RESTORE_TASK_TO_SEED':
      return { ...state, seeds: restoreTask(state.seeds, payload) };

    case 'TOGGLE_TASK_STATUS':
      return { ...state, seeds: applyTaskStatus(state.seeds, payload) };

    default:
      return state;
  }
}
