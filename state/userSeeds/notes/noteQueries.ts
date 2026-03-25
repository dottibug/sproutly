import { supabase } from '../../app/supabase';
import { UserSeedNote, NotePayload } from './noteTypes';
import { getTimestamp } from '../../app/appUtils';
import { buildUserSeedNote } from './noteUtils';

// Insert a new note into the user_seed_notes table
export async function insertNote(notePayload: NotePayload): Promise<UserSeedNote> {
  const titleTrim = notePayload.title?.trim() || null;
  const noteTrim = notePayload.note.trim();

  if (!titleTrim && !noteTrim) throw new Error('Title and note cannot both be empty');

  const { data, error } = await supabase
    .from('user_seed_notes')
    .insert({
      user_id: notePayload.userId,
      user_seed_id: notePayload.userSeedId,
      title: titleTrim,
      note: noteTrim || '',
    })
    .select('id, user_seed_id, user_id, title, note, created_at, updated_at')
    .single();

  if (error) throw error;
  const { id, user_seed_id, user_id, title, note, created_at, updated_at } = data;

  return buildUserSeedNote(id, user_seed_id, user_id, title, note, created_at, updated_at);
}

// Update a note in the user_seed_notes table
export async function updateNote(userNote: UserSeedNote): Promise<void> {
  const { id, title, note, userId } = userNote;

  const titleTrim = title?.trim() || null;
  const noteTrim = note?.trim() ?? '';

  if (!titleTrim && !noteTrim) throw new Error('Title and note cannot both be empty');
  const now = getTimestamp();

  const { error } = await supabase
    .from('user_seed_notes')
    .update({
      title: titleTrim,
      note: noteTrim || '',
      updated_at: now,
    })
    .eq('id', id)
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

  const notes = data?.map((note) =>
    buildUserSeedNote(note.id, note.user_seed_id, note.user_id, note.title, note.note, note.created_at, note.updated_at),
  );

  return notes ?? ([] as UserSeedNote[]);
}
