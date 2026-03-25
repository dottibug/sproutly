import { UserSeed } from '../seeds/seedTypes';
import { NotePayload, UserSeedNote } from './noteTypes';
import { createTempId, getTimestamp } from '../../app/appUtils';

/** True if at least one of title or body has non-whitespace content. */
export function noteHasContent(title: string | null | undefined, note: string | null | undefined): boolean {
  const t = title?.trim() ?? '';
  const n = note?.trim() ?? '';
  return Boolean(t || n);
}

// Build a note payload for adding a new note to a seed
export function buildNotePayload(userId: string, userSeedId: string, title: string | null, note: string): NotePayload | null {
  const trimTitle = title?.trim() ? title.trim() : null;
  const trimNote = note.trim();
  if (!noteHasContent(trimTitle, trimNote)) return null;
  const tempId = createTempId();

  return {
    userId,
    userSeedId,
    tempId,
    title: trimTitle,
    note: trimNote,
  } as NotePayload;
}

export function buildUserSeedNote(
  id: string,
  userSeedId: string,
  userId: string,
  title: string | null,
  note: string | null,
  createdAt: string,
  updatedAt: string,
): UserSeedNote {
  return {
    id,
    userSeedId,
    userId,
    title,
    note,
    createdAt,
    updatedAt,
  } as UserSeedNote;
}

// Create a note in state
export function createNote(seeds: UserSeed[], payload: NotePayload) {
  const seedsCopy = [...seeds];

  const { userId, userSeedId, tempId, title, note } = payload;

  return seedsCopy.map((s) => {
    if (s.id !== userSeedId) return s;

    const currentNotes = s.notes ?? [];
    const now = getTimestamp();

    const newNote = buildUserSeedNote(tempId, userSeedId, userId, title, note, now, now);

    return { ...s, notes: [newNote, ...currentNotes] };
  });
}

// Edit a note in state
export function editNote(seeds: UserSeed[], payload: UserSeedNote) {
  const seedsCopy = [...seeds];
  const now = getTimestamp();

  const updated = seedsCopy.map((s) => {
    if (s.id !== payload.userSeedId) return s;

    const currentNotes = s.notes ?? [];

    const noteToUpdate = currentNotes.find((n) => n.id === payload.id);
    if (!noteToUpdate) return s;

    const updatedNote = buildUserSeedNote(
      noteToUpdate.id,
      noteToUpdate.userSeedId,
      noteToUpdate.userId,
      payload.title,
      payload.note,
      now,
      now,
    );

    return {
      ...s,
      notes: currentNotes.map((n) => (n.id === payload.id ? updatedNote : n)),
    };
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

// Delete a note in state
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

// Group notes by userSeedId (key is userSeedId)
export function groupNotesByUserSeedId(notes: UserSeedNote[]): Map<string, UserSeedNote[]> {
  const map = new Map<string, UserSeedNote[]>();

  notes.forEach((note) => {
    if (!map.has(note.userSeedId)) map.set(note.userSeedId, []);
    map.get(note.userSeedId)?.push(note);
  });

  return map;
}
