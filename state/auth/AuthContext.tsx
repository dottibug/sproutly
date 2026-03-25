import { createContext, useReducer, useCallback, useEffect, useMemo, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../app/supabase';
import { runLoadSessionAndProfile, runSignIn, runSignUp, runSubscribeToAuthStateChanges } from './authThunks';

/**
 * AuthContext.tsx: Manages user authentication state and provides authentication functions to child components.
 * Uses the React context & reducer pattern to manage state for user authentication.
 * https://react.dev/learn/scaling-up-with-reducer-and-context
 */

// ---- TYPES ----
type Profile = {
  id: string;
  username: string;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signIn: (username: string, pin: string) => Promise<void>;
  signUp: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export type AuthAction =
  | { type: 'LOAD_START'; payload: null }
  | { type: 'LOAD_SUCCESS'; payload: { session: Session | null; user: User | null; profile: Profile | null } }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'SIGN_IN_START'; payload: null }
  | { type: 'SIGN_IN_SUCCESS'; payload: { session: Session | null; user: User | null; profile: Profile | null } }
  | { type: 'SIGN_IN_ERROR'; payload: string }
  | { type: 'SIGN_UP_START'; payload: null }
  | { type: 'SIGN_UP_SUCCESS'; payload: { session: Session | null; user: User | null; profile: Profile | null } }
  | { type: 'SIGN_UP_ERROR'; payload: string }
  | { type: 'SIGN_OUT_SUCCESS'; payload: null };

// ---- STATE & CONTEXT SETUP ----
const initialState: AuthState = {
  session: null,
  user: null,
  profile: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

// ---- REDUCER ----
function authReducer(state: AuthState, action: AuthAction): AuthState {
  const { type, payload } = action;

  switch (type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, session: payload.session, user: payload.user, profile: payload.profile, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: payload };
    case 'SIGN_IN_START':
      return { ...state, loading: true, error: null };
    case 'SIGN_IN_SUCCESS':
      return { ...state, session: payload.session, user: payload.user, profile: payload.profile, loading: false, error: null };
    case 'SIGN_IN_ERROR':
      return { ...state, loading: false, error: payload };
    case 'SIGN_UP_START':
      return { ...state, loading: true, error: null };
    case 'SIGN_UP_SUCCESS':
      return { ...state, session: payload.session, user: payload.user, profile: payload.profile, loading: false, error: null };
    case 'SIGN_UP_ERROR':
      return { ...state, loading: false, error: payload };
    case 'SIGN_OUT_SUCCESS':
      return { ...state, session: null, user: null, profile: null, loading: false, error: null };
    default:
      return state;
  }
}

// ---- PROVIDER ----
type AuthProviderProps = {
  readonly children: React.ReactNode;
};

// AuthProvider component to provide the auth context to all child components.
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadSessionAndProfile = useCallback(async () => {
    await runLoadSessionAndProfile(dispatch);
  }, [dispatch]);

  // Subscribe to supabase auth state changes
  useEffect(() => {
    loadSessionAndProfile();
    const subscription = runSubscribeToAuthStateChanges(dispatch);
    return () => subscription.unsubscribe();
  }, [dispatch, loadSessionAndProfile]);

  // Sign in user
  const signIn = useCallback(
    async (username: string) => {
      await runSignIn(dispatch, username);
    },
    [dispatch],
  );

  // Sign up user
  const signUp = useCallback(
    async (username: string) => {
      await runSignUp(dispatch, username);
    },
    [dispatch],
  );

  // Sign out user
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'SIGN_OUT_SUCCESS', payload: null });
  }, []);

  // Memoize context value (context value should not change unless the state changes)
  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
    }),
    [state, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used with AuthProvider');
  return context;
}
