import { supabase } from '../app/supabase';
import { Profile } from './authUtils';

// authQueries.tsx: Contains database queries for authentication

// Fetch profile from the database (if it exists)
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('id, username, created_at').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id,
    username: data.username,
    createdAt: data.created_at == null ? null : String(data.created_at),
  };
}
