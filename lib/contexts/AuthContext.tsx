import { createContext, useReducer, useCallback, useEffect, useMemo, useContext } from 'react';
import { supabase } from '../supabase';
import { Session, User } from '@supabase/supabase-js';
import { getAuthEmail } from '../constants/auth';
import { UNIVERSAL_PIN } from '../constants/auth';

// AuthContext.tsx follows the React context & reducer pattern to manage state for user authentication.
// https://react.dev/learn/scaling-up-with-reducer-and-context

export type Profile = {
  id: string;
  username: string;
};

// State
type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
};

// Initial state
const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  error: null,
};

// Auth actions
type AuthContextValue = AuthState & {
  signIn: (username: string, pin: string) => Promise<void>;
  signUp: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

// Context
const AuthContext = createContext<AuthContextValue | null>(null);

// Fetch profile from the database (if it exists)
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('id, username').eq('id', userId).single();
  if (error || !data) return null;
  return { id: data.id, username: data.username };
}

// AuthProvider component to provide the auth context to all child components.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useReducer((prev: AuthState, next: Partial<AuthState>) => ({ ...prev, ...next }), initialState);

  // Load the session and profile when the component mounts
  const loadSessionAndProfile = useCallback(async () => {
    setState({ loading: true, error: null });

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setState({ session: null, user: null, profile: null, loading: false });
        return;
      }
      const profile = await fetchProfile(session.user.id);
      setState({ session, user: session.user, profile, loading: false });
    } catch (error) {
      setState({ loading: false, error: error instanceof Error ? error.message : 'Failed to load session' });
    }
  }, []);

  // Subscribe to supabase auth state changes
  useEffect(() => {
    loadSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setState({ session: null, user: null, profile: null, loading: false });
        return;
      }

      const profile = await fetchProfile(session.user.id);
      setState({ session, user: session.user, profile, loading: false });
    });

    return () => subscription.unsubscribe();
  }, [loadSessionAndProfile]);

  // Sign in user flow
  const signIn = useCallback(async (username: string) => {
    setState({ error: null });
    const email = getAuthEmail(username);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: UNIVERSAL_PIN,
    });

    if (error) throw error;
    const profile = data.user ? await fetchProfile(data.user.id) : null;
    setState({ session: data.session, user: data.user, profile, loading: false });
  }, []);

  // Sign up user flow
  const signUp = useCallback(async (username: string) => {
    setState({ error: null });

    const email = getAuthEmail(username);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: UNIVERSAL_PIN,
      options: { data: { username: username.trim() } },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed');

    await supabase.from('profiles').insert({
      id: data.user.id,
      username: username.trim(),
    });

    const profile = await fetchProfile(data.user.id);
    setState({ session: data.session, user: data.user, profile, loading: false });
  }, []);

  // Sign out user flow
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ session: null, user: null, profile: null });
  }, []);

  const clearError = useCallback(() => setState({ error: null }), []);

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
      clearError,
    }),
    [state, signIn, signUp, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with AuthProvider');
  return context;
}
