import { supabase } from '../../app/supabase';
import { UserSeedNote, InsertNoteInput } from './noteTypes';

// noteQueries.ts: Contains functions to interact with the database for notes

// Insert a new note into the user_seed_notes table
export async function insertNote(input: InsertNoteInput): Promise<UserSeedNote> {
  const { userId, userSeedId, title, note } = input;

  const { data, error } = await supabase
    .from('user_seed_notes')
    .insert({
      user_id: userId,
      user_seed_id: userSeedId,
      title: title,
      note: note,
    })
    .select('*')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    userId: data.user_id,
    userSeedId: data.user_seed_id,
    title: data.title,
    note: data.note,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  } as UserSeedNote;
}

// Update a note in the user_seed_notes table
export async function updateNote(userId: string, note: UserSeedNote): Promise<void> {
  const { error } = await supabase
    .from('user_seed_notes')
    .update({
      title: note.title,
      note: note.note,
      updated_at: note.updatedAt,
    })
    .eq('id', note.id)
    .eq('user_id', userId);

  if (error) throw error;
}

// Delete a note from the user_seed_notes table
export async function deleteNote(userId: string, noteId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_notes').delete().eq('id', noteId).eq('user_id', userId);
  if (error) throw error;
}

// Fetch notes associated with the seeds in a user's collection
export async function fetchNotesByUserSeedId(userSeedIds: string[]): Promise<UserSeedNote[]> {
  if (userSeedIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_seed_notes')
    .select('id, user_seed_id, user_id, title, note, created_at, updated_at')
    .in('user_seed_id', userSeedIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const notes = data?.map((note) => {
    return {
      id: note.id,
      userSeedId: note.user_seed_id,
      userId: note.user_id,
      title: note.title,
      note: note.note,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    } as UserSeedNote;
  });

  return notes ?? ([] as UserSeedNote[]);
}
