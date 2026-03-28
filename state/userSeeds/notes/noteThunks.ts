import { Dispatch } from 'react';
import { insertNote, updateNote, deleteNote } from './noteQueries';
import { createTempId } from '../../app/appUtils';
import { getTimestamp } from '../../app/dateUtils';
import { UserSeedAction } from '../seeds/seedTypes';
import { NoteDraft, UserSeedNote } from './noteTypes';

// noteThunks.ts: Thunks used to handle async operations that interact with the database, as well as optimistic state updates.

// Creates a new note in the UI and database (optimistic update)
export async function runAddNote(dispatch: Dispatch<UserSeedAction>, userId: string, draft: NoteDraft) {
  const { userSeedId, title, note } = draft;
  const now = getTimestamp();
  const tempId = createTempId();

  const newNote = {
    id: tempId,
    userId,
    userSeedId,
    title,
    note,
    createdAt: now,
    updatedAt: now,
  } as UserSeedNote;

  dispatch({ type: 'ADD_NOTE', payload: { ...newNote, tempId } });

  try {
    const insertedNote = await insertNote({
      userId,
      userSeedId,
      title,
      note,
    });

    dispatch({ type: 'SYNC_NOTE_WITH_DB', payload: { ...insertedNote, tempId } });
  } catch (error) {
    dispatch({ type: 'DELETE_NOTE', payload: tempId });
    throw new Error(`Error adding note to seed: ${error}`);
  }
}

// Updates an existing note in the UI and database (optimistic update)
export async function runUpdateNote(dispatch: Dispatch<UserSeedAction>, note: UserSeedNote, draft: NoteDraft) {
  if (note.id.startsWith('temp-')) return;

  const now = getTimestamp();
  const updatedNote: UserSeedNote = {
    ...note,
    title: draft.title,
    note: draft.note,
    updatedAt: now,
  };

  dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });

  try {
    await updateNote(updatedNote.userId, updatedNote);
  } catch (error) {
    dispatch({ type: 'UPDATE_NOTE', payload: note });
    throw new Error(`Error updating note: ${error}`);
  }
}

// Deletes a note in the UI and database (optimistic update)
export async function runDeleteNote(dispatch: Dispatch<UserSeedAction>, userId: string, note: UserSeedNote) {
  if (note.id.startsWith('temp-')) return;
  const noteToDelete = note;

  dispatch({ type: 'DELETE_NOTE', payload: note.id });

  try {
    await deleteNote(userId, note.id);
  } catch (error) {
    dispatch({ type: 'RESTORE_NOTE_TO_SEED', payload: noteToDelete });
    throw new Error(`Error deleting note from seed: ${error}`);
  }
}
