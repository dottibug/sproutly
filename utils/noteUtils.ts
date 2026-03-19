import { supabase } from './supabase';
import { UserSeedNote } from './types';

// Create array of notes for each seed in a user's collection
export function organizeNotesByCollectionId(notes: UserSeedNote[], collectionIds: string[]): Record<string, UserSeedNote[]> {
  return notes.reduce<Record<string, UserSeedNote[]>>((acc, note) => {
    if (!acc[note.userCollectionId]) acc[note.userCollectionId] = [];
    acc[note.userCollectionId].push(note);
    return acc;
  }, {});
}
