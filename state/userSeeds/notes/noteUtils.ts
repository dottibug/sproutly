import { UserSeed } from '../seeds/seedTypes';
import { UserSeedNote } from './noteTypes';
import { getTimestamp } from '../../app/dateUtils';

// noteUtils.ts: Contains utility functions for notes

// --------------- STATE UTILS ---------------
// Create a note in the UI (optimistic update)
export function createNote(seeds: UserSeed[], payload: UserSeedNote & { tempId: string }) {
  const seedsCopy = [...seeds];
  const { userId, userSeedId, tempId, title, note } = payload;

  const updated = seedsCopy.map((s) => {
    if (s.id !== userSeedId) return s;
    const currentNotes = s.notes ?? [];
    const now = getTimestamp();

    const newNote = {
      id: tempId,
      userId,
      userSeedId,
      title,
      note,
      createdAt: now,
      updatedAt: now,
    } as UserSeedNote;
    return { ...s, notes: [newNote, ...currentNotes] };
  });

  return updated;
}

// Replace the optimistic note in state with the successful DB insert (ensures the note id is updated in state)
export function replaceUINote(seeds: UserSeed[], payload: UserSeedNote & { tempId: string }) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== payload.userSeedId) return s;
    const currentNotes = s.notes ?? [];
    return {
      ...s,
      notes: currentNotes.map((n) => (n.id === payload.tempId ? ({ ...payload } as UserSeedNote) : n)),
    };
  });
  return updated;
}

// Edit a note in the UI (optimistic update)
export function editNote(seeds: UserSeed[], payload: UserSeedNote) {
  const seedsCopy = [...seeds];
  const now = getTimestamp();
  const updated = seedsCopy.map((seed) => {
    if (seed.id !== payload.userSeedId) return seed;
    const currentNotes = seed.notes ?? [];
    return {
      ...seed,
      notes: currentNotes.map((note) => (note.id === payload.id ? ({ ...payload, updatedAt: now } as UserSeedNote) : note)),
    } as UserSeed;
  });
  return updated;
}

// Delete a note in the UI (optimistic update)
export function deleteByNoteId(seeds: UserSeed[], noteId: string) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    const currentNotes = s.notes ?? [];
    return {
      ...s,
      notes: currentNotes.filter((n) => n.id !== noteId),
    } as UserSeed;
  });
  return updated;
}

// Restore a note in the UI (if it failed to be successfully deleted in the DB)
export function restoreNote(seeds: UserSeed[], note: UserSeedNote) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== note.userSeedId) return s;
    const currentNotes = s.notes ?? [];
    return { ...s, notes: [note, ...currentNotes] } as UserSeed;
  });
  return updated;
}

// --------------- NOTE SORTING UTILS ---------------
// Group notes by userSeedId (key is userSeedId)
export function groupNotesByUserSeedId(notes: UserSeedNote[]): Map<string, UserSeedNote[]> {
  const map = new Map<string, UserSeedNote[]>();
  notes.forEach((note) => {
    if (!map.has(note.userSeedId)) map.set(note.userSeedId, []);
    map.get(note.userSeedId)?.push(note);
  });
  return map;
}

// --------------- NOTE SHEET UTILS ---------------
// Helper function to create the title for the note sheet
export function getNoteSheetTitle(isAnUpdate: boolean, variety: string, plant: string): string {
  if (isAnUpdate) return `Update Note for ${variety} ${plant}`;
  if (variety !== '' && plant !== '') return `Create New Note for ${variety} ${plant}`;
  else return 'Create New Note';
}
