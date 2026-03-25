import { supabase } from '../app/supabase';
import { Profile } from './authUtils';

// Fetch profile from the database (if it exists)
export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('id, username').eq('id', userId).single();
  if (error || !data) throw error;
  return { id: data.id, username: data.username } as Profile;
}
