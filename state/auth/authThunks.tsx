import { supabase } from '../app/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Dispatch } from 'react';
import { AuthAction } from './AuthContext';
import { fetchProfile } from './authQueries';
import { getAuthEmail, Profile, UNIVERSAL_PIN } from './authUtils';

// Load the session and profile when the component mounts
export async function runLoadSessionAndProfile(dispatch: Dispatch<AuthAction>) {
  dispatch({ type: 'LOAD_START', payload: null });

  try {
    // Check for an existing session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If no session, return early (user needs to sign in)
    if (!session?.user) {
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { session: null as Session | null, user: null as User | null, profile: null as Profile | null },
      });
      return;
    }

    const profile = await fetchProfile(session.user.id);
    dispatch({ type: 'LOAD_SUCCESS', payload: { session, user: session.user, profile } });
  } catch {
    dispatch({ type: 'LOAD_ERROR', payload: 'Failed to load session' });
  }
}

// Subscribe to supabase auth state changes
export function runSubscribeToAuthStateChanges(dispatch: Dispatch<AuthAction>) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session?.user) {
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { session: null as Session | null, user: null as User | null, profile: null as Profile | null },
      });
    } else {
      const profile = await fetchProfile(session.user.id);
      dispatch({ type: 'LOAD_SUCCESS', payload: { session, user: session.user, profile } });
    }
  });
  return subscription;
}

// Sign in user
export async function runSignIn(dispatch: Dispatch<AuthAction>, username: string) {
  dispatch({ type: 'SIGN_IN_START', payload: null });

  const usernameTrim = username.trim();
  const email = getAuthEmail(usernameTrim);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: UNIVERSAL_PIN });
    if (error || !data.user) throw new Error('Sign in failed');
    const profile = await fetchProfile(data.user.id);
    dispatch({ type: 'SIGN_IN_SUCCESS', payload: { session: data.session, user: data.user, profile } });
  } catch (error) {
    dispatch({ type: 'SIGN_IN_ERROR', payload: error as string });
  }
}

// Sign up user
export async function runSignUp(dispatch: Dispatch<AuthAction>, username: string) {
  dispatch({ type: 'SIGN_UP_START', payload: null });

  const usernameTrim = username.trim();
  const email = getAuthEmail(usernameTrim);

  try {
    const { data, error } = await supabase.auth.signUp({ email, password: UNIVERSAL_PIN, options: { data: { username: usernameTrim } } });
    if (error || !data.user) throw new Error('Sign up failed');

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username: usernameTrim,
    });
    if (profileError) throw profileError;

    const profile = await fetchProfile(data.user.id);
    dispatch({ type: 'SIGN_UP_SUCCESS', payload: { session: data.session, user: data.user, profile } });
  } catch (error) {
    dispatch({ type: 'SIGN_UP_ERROR', payload: error as string });
  }
}
