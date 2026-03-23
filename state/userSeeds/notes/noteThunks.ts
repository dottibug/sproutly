// TODO: Never import from the context (circular dependency)
// noteThunks.ts
// thunks are used to handle async operations that interact with the database, as well as optimistic dispatch actions to the context reducer

import { Dispatch } from 'react';
import { UserSeedAction } from '../seeds/seedTypes';
import { AddNoteDraft, UserSeedNote } from './noteTypes';
import { buildNotePayload } from './noteUtils';
import { insertNote, updateNote, deleteNote } from './noteQueries';

// Add a new note to state and database
export async function runAddNote(dispatch: Dispatch<UserSeedAction>, userId: string, draft: AddNoteDraft) {
  // Optimistic state update
  const payload = buildNotePayload(userId, draft.userSeedId, draft.title, draft.note);
  if (!payload) return;

  const { tempId } = payload;
  dispatch({ type: 'ADD_NOTE', payload });

  try {
    // Database insert
    const dbNote = await insertNote(payload);
    dispatch({ type: 'SYNC_NOTE_WITH_DB', payload: { ...dbNote, tempId } });
  } catch (error) {
    // Rollback optimistic state update
    dispatch({ type: 'DELETE_NOTE', payload: tempId });
    console.error('Error adding note to seed: ', error);
  }
}

// Update a note in state and database
export async function runUpdateNote(dispatch: Dispatch<UserSeedAction>, payload: UserSeedNote) {
  const { id } = payload;

  // Optimistic state update
  if (id.startsWith('temp-')) return;
  dispatch({ type: 'UPDATE_NOTE', payload });

  try {
    // Database update
    await updateNote(payload);
  } catch (error) {
    console.error('Error adding note to seed: ', error);
  }
}

// Delete a note in state and database
export async function runDeleteNote(dispatch: Dispatch<UserSeedAction>, userId: string, noteId: string) {
  // Optimistic state update
  if (noteId.startsWith('temp-')) return;
  dispatch({ type: 'DELETE_NOTE', payload: noteId });

  try {
    // Database delete
    await deleteNote(userId, noteId);
  } catch (error) {
    console.error('Error deleting note from seed: ', error);
  }
}
