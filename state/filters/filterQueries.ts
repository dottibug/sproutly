import { supabase } from '../app/supabase';
import { UserFilterPreferences, SEARCH_FILTER_NAMES, DEFAULT_OPEN, SearchFilter } from './filterTypes';

// filterQueries.tsx: Contains database queries for filters

// Fetch user filter preferences from the database
export async function fetchUserFilterPrefs(profileId: string): Promise<UserFilterPreferences> {
  const { data, error } = await supabase.from('profiles').select('filter_order, filter_expanded_by_default').eq('id', profileId).single();

  if (error) throw error;

  return {
    order: (data.filter_order as SearchFilter[]) ?? SEARCH_FILTER_NAMES,
    openByDefault: (data.filter_expanded_by_default as SearchFilter[]) ?? DEFAULT_OPEN,
  };
}

// Update user filter preferences in the database
export async function updateUserFilterPrefs(profileId: string, userFilterPrefs: UserFilterPreferences): Promise<UserFilterPreferences> {
  const { order, openByDefault } = userFilterPrefs;

  const { error } = await supabase
    .from('profiles')
    .update({
      filter_order: order,
      filter_expanded_by_default: openByDefault,
    })
    .eq('id', profileId);

  if (error) throw error;
  return userFilterPrefs;
}
